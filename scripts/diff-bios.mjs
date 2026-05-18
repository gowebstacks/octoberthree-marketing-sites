import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env
const envPath = resolve(__dirname, "..", ".env");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((line) => line.includes("="))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

// --- Contentful ---
const CF_SPACE = env.CONTENTFUL_SPACE_ID;
const CF_ENV = env.CONTENTFUL_ENV_ID;
const CF_TOKEN = env.CONTENTFUL_TOKEN;
const CF_BASE = `https://cdn.contentful.com/spaces/${CF_SPACE}/environments/${CF_ENV}`;

async function fetchContentfulBios() {
  let all = [];
  let skip = 0;
  while (true) {
    const params = new URLSearchParams({
      access_token: CF_TOKEN,
      content_type: "marketingBio",
      limit: "100",
      skip: String(skip),
    });
    const res = await fetch(`${CF_BASE}/entries?${params}`);
    if (!res.ok) {
      console.error(`Contentful error: ${res.status}`, await res.text());
      process.exit(1);
    }
    const data = await res.json();
    all.push(...data.items);
    if (all.length >= data.total) break;
    skip += 100;
  }
  return all.map((e) => ({
    id: e.sys.id,
    name: (e.fields.name || "").trim(),
    title: (e.fields.title || "").trim(),
    active: e.fields.active,
    site: e.fields.site,
    updatedAt: e.sys.updatedAt,
  }));
}

// --- Storyblok ---
const SB_API = "https://api.storyblok.com/v2/cdn";
// CDN preview token (from codebase fallback — STORYBLOK_PERSONAL_ACCESS_TOKEN is Management API, not CDN)
const SB_TOKEN = process.env.STORYBLOK_PREVIEW_TOKEN || "d0o0iv3cDTMUXB1yItM2FQtt";

async function fetchStoryblokTeam(sitename) {
  let all = [];
  let page = 1;
  while (true) {
    const params = new URLSearchParams({
      token: SB_TOKEN,
      starts_with: `${sitename}/team/`,
      per_page: "100",
      page: String(page),
      version: "draft",
    });
    let res = await fetch(`${SB_API}/stories?${params}`);
    if (!res.ok) {
      // Try published if draft fails
      params.set("version", "published");
      res = await fetch(`${SB_API}/stories?${params}`);
      if (!res.ok) {
        console.error(`Storyblok error for ${sitename}: ${res.status}`);
        return [];
      }
    }
    const total = parseInt(res.headers.get("total") || "0", 10);
    const data = await res.json();
    all.push(...(data.stories || []));
    if (data.stories.length < 100 || all.length >= total) break;
    page++;
  }
  return all;
}

function getAuthorCard(content) {
  return content?.sections
    ?.flatMap((layout) => layout.section || [])
    ?.find((section) => section.component === "portableText")
    ?.body?.content?.find((node) => node.type === "blok")
    ?.attrs?.body?.find((blok) => blok.component === "authorCard");
}

async function fetchAllStoryblokBios() {
  const sites = ["octoberthree-main", "edge", "rlc"];
  const allBios = [];

  for (const site of sites) {
    const stories = await fetchStoryblokTeam(site);
    for (const story of stories) {
      const card = getAuthorCard(story.content);
      allBios.push({
        id: story.uuid,
        slug: story.full_slug,
        site,
        name: (card?.name || story.name || "").trim(),
        title: (card?.designation || "").trim(),
        updatedAt: story.published_at || story.created_at,
      });
    }
  }
  return allBios;
}

// --- Normalize for matching ---
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// --- Main ---
async function main() {
  console.log("Fetching Contentful bios...");
  const cfBios = await fetchContentfulBios();
  console.log(`  Found ${cfBios.length} Contentful bios\n`);

  console.log("Fetching Storyblok team members...");
  const sbBios = await fetchAllStoryblokBios();
  console.log(`  Found ${sbBios.length} Storyblok team members\n`);

  // Build lookup by normalized name
  const sbByName = new Map();
  for (const sb of sbBios) {
    const key = normalize(sb.name);
    if (!sbByName.has(key)) sbByName.set(key, []);
    sbByName.get(key).push(sb);
  }

  const cfByName = new Map();
  for (const cf of cfBios) {
    const key = normalize(cf.name);
    if (!cfByName.has(key)) cfByName.set(key, []);
    cfByName.get(key).push(cf);
  }

  // --- Diff ---
  const titleMismatches = [];
  const matched = [];
  const inContentfulOnly = [];
  const inStoryblokOnly = [];

  for (const cf of cfBios) {
    const key = normalize(cf.name);
    const sbMatches = sbByName.get(key);

    if (!sbMatches || sbMatches.length === 0) {
      inContentfulOnly.push(cf);
      continue;
    }

    for (const sb of sbMatches) {
      const cfTitle = normalize(cf.title);
      const sbTitle = normalize(sb.title);

      if (cfTitle !== sbTitle) {
        titleMismatches.push({ cf, sb });
      } else {
        matched.push({ cf, sb });
      }
    }
  }

  for (const sb of sbBios) {
    const key = normalize(sb.name);
    if (!cfByName.has(key)) {
      inStoryblokOnly.push(sb);
    }
  }

  // --- Report ---
  console.log("=".repeat(80));
  console.log("DIFF REPORT: Contentful marketingBio vs Storyblok Team Members");
  console.log("=".repeat(80));

  console.log(`\nMatched (name + title identical): ${matched.length}`);
  console.log(`Title mismatches: ${titleMismatches.length}`);
  console.log(`In Contentful only (not in Storyblok): ${inContentfulOnly.length}`);
  console.log(`In Storyblok only (not in Contentful): ${inStoryblokOnly.length}`);

  if (titleMismatches.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("TITLE MISMATCHES (name matches but title differs)");
    console.log("-".repeat(80));
    for (const { cf, sb } of titleMismatches) {
      console.log(`\n  Name: ${cf.name}`);
      console.log(`    Contentful title: "${cf.title}"`);
      console.log(`    Storyblok title:  "${sb.title}"`);
      console.log(`    Contentful updated: ${cf.updatedAt}`);
      console.log(`    Storyblok updated:  ${sb.updatedAt}`);
      console.log(`    Storyblok slug:     ${sb.slug}`);
    }
  }

  if (inContentfulOnly.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("IN CONTENTFUL ONLY (no matching name in Storyblok)");
    console.log("-".repeat(80));
    for (const cf of inContentfulOnly) {
      console.log(`\n  Name: ${cf.name}`);
      console.log(`    Title: "${cf.title}"`);
      console.log(`    Active: ${cf.active}`);
      console.log(`    Updated: ${cf.updatedAt}`);
    }
  }

  if (inStoryblokOnly.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("IN STORYBLOK ONLY (no matching name in Contentful)");
    console.log("-".repeat(80));
    for (const sb of inStoryblokOnly) {
      console.log(`\n  Name: ${sb.name}`);
      console.log(`    Title: "${sb.title}"`);
      console.log(`    Slug: ${sb.slug}`);
      console.log(`    Updated: ${sb.updatedAt}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("END OF REPORT");
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
