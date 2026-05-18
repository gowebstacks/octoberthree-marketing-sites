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

const APPLY = process.argv.includes("--apply");

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

// --- Storyblok CDN (for diffing) ---
const SB_CDN = "https://api.storyblok.com/v2/cdn";
const SB_CDN_TOKEN =
  process.env.STORYBLOK_PREVIEW_TOKEN || "d0o0iv3cDTMUXB1yItM2FQtt";

async function fetchStoryblokTeam(sitename) {
  let all = [];
  let page = 1;
  while (true) {
    const params = new URLSearchParams({
      token: SB_CDN_TOKEN,
      starts_with: `${sitename}/team/`,
      per_page: "100",
      page: String(page),
      version: "draft",
    });
    let res = await fetch(`${SB_CDN}/stories?${params}`);
    if (!res.ok) {
      params.set("version", "published");
      res = await fetch(`${SB_CDN}/stories?${params}`);
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

function getAuthorCardPath(content) {
  // Returns indices to reach the authorCard within content.sections
  if (!content?.sections) return null;
  for (let si = 0; si < content.sections.length; si++) {
    const layout = content.sections[si];
    const sectionArr = layout.section || [];
    for (let seci = 0; seci < sectionArr.length; seci++) {
      const section = sectionArr[seci];
      if (section.component !== "portableText") continue;
      const bodyContent = section.body?.content;
      if (!bodyContent) continue;
      for (let bi = 0; bi < bodyContent.length; bi++) {
        const node = bodyContent[bi];
        if (node.type !== "blok") continue;
        const blokBody = node.attrs?.body;
        if (!blokBody) continue;
        for (let bli = 0; bli < blokBody.length; bli++) {
          if (blokBody[bli].component === "authorCard") {
            return { si, seci, bi, bli };
          }
        }
      }
    }
  }
  return null;
}

async function fetchAllStoryblokBios() {
  const sites = ["octoberthree-main", "edge", "rlc"];
  const allBios = [];

  for (const site of sites) {
    const stories = await fetchStoryblokTeam(site);
    for (const story of stories) {
      const card = getAuthorCard(story.content);
      allBios.push({
        storyId: story.id,
        uuid: story.uuid,
        slug: story.full_slug,
        site,
        name: (card?.name || story.name || "").trim(),
        title: (card?.designation || "").trim(),
        company: (card?.company || "").trim(),
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

// --- Storyblok Management API ---
const SB_MAPI = "https://mapi.storyblok.com/v1";
const SB_TOKEN = env.STORYBLOK_PERSONAL_ACCESS_TOKEN;

async function mapiGet(path) {
  const res = await fetch(`${SB_MAPI}${path}`, {
    headers: { Authorization: SB_TOKEN },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MAPI GET ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function mapiPut(path, body) {
  const res = await fetch(`${SB_MAPI}${path}`, {
    method: "PUT",
    headers: {
      Authorization: SB_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MAPI PUT ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}


async function resolveSpaceId() {
  const data = await mapiGet("/spaces");
  if (!data.spaces || data.spaces.length === 0) {
    throw new Error("No spaces found for this token");
  }
  const space = data.spaces.find((s) => s.name === "October Three Consulting");
  if (!space) {
    throw new Error(
      `Could not find "October Three Consulting" space. Available: ${data.spaces.map((s) => s.name).join(", ")}`
    );
  }
  return space.id;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- Main ---
async function main() {
  if (!SB_TOKEN) {
    console.error(
      "Missing STORYBLOK_PERSONAL_ACCESS_TOKEN in .env — required for Management API writes."
    );
    process.exit(1);
  }

  console.log(APPLY ? "MODE: APPLY (will write changes)\n" : "MODE: DRY RUN (preview only, pass --apply to execute)\n");

  // 1. Fetch bios from both systems
  console.log("Fetching Contentful bios...");
  const cfBios = await fetchContentfulBios();
  console.log(`  Found ${cfBios.length} Contentful bios\n`);

  console.log("Fetching Storyblok team members...");
  const sbBios = await fetchAllStoryblokBios();
  console.log(`  Found ${sbBios.length} Storyblok team members\n`);

  // 2. Find title mismatches
  const sbByName = new Map();
  for (const sb of sbBios) {
    const key = normalize(sb.name);
    if (!sbByName.has(key)) sbByName.set(key, []);
    sbByName.get(key).push(sb);
  }

  const mismatches = [];
  for (const cf of cfBios) {
    const key = normalize(cf.name);
    const sbMatches = sbByName.get(key);
    if (!sbMatches) continue;

    for (const sb of sbMatches) {
      if (normalize(cf.title) !== normalize(sb.title)) {
        mismatches.push({ cf, sb });
      }
    }
  }

  if (mismatches.length === 0) {
    console.log("No title mismatches found — nothing to sync.");
    return;
  }

  console.log(`Found ${mismatches.length} title mismatches to sync:\n`);
  for (const { cf, sb } of mismatches) {
    console.log(`  ${cf.name} [${sb.site}] (story ${sb.storyId})`);
    console.log(`    Contentful: "${cf.title}"`);
    console.log(`    Storyblok:  "${sb.title}"`);
    if (sb.company && normalize(sb.company) === normalize(sb.title)) {
      console.log(`    Also updating company: "${sb.company}" → "${cf.title}"`);
    }
    console.log();
  }

  if (!APPLY) {
    console.log("Dry run complete. Pass --apply to execute these changes.");
    return;
  }

  // 3. Resolve space ID
  console.log("Resolving Storyblok space ID...");
  const spaceId = await resolveSpaceId();
  console.log(`  Space ID: ${spaceId}\n`);

  // 4. Apply updates
  let updated = 0;
  let errors = 0;

  for (const { cf, sb } of mismatches) {
    console.log(`Updating ${cf.name} [${sb.site}] (story ${sb.storyId})...`);
    try {
      // Fetch the full story via Management API
      const storyData = await mapiGet(
        `/spaces/${spaceId}/stories/${sb.storyId}`
      );
      const story = storyData.story;

      // Find the authorCard in the story content
      const path = getAuthorCardPath(story.content);
      if (!path) {
        console.error(`  Could not find authorCard in story — skipping`);
        errors++;
        continue;
      }

      const { si, seci, bi, bli } = path;
      const card =
        story.content.sections[si].section[seci].body.content[bi].attrs.body[
          bli
        ];

      const oldDesignation = card.designation || "";
      const oldCompany = card.company || "";

      // Update designation
      card.designation = cf.title;

      // Update company if it matches the old designation
      if (oldCompany && normalize(oldCompany) === normalize(oldDesignation)) {
        card.company = cf.title;
      }

      // Save and publish the story
      await mapiPut(`/spaces/${spaceId}/stories/${sb.storyId}`, {
        story: { content: story.content },
        publish: 1,
      });
      console.log(`  Saved and published.`);

      updated++;
      await sleep(500);
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      errors++;
    }
  }

  console.log(
    `\nDone. Updated: ${updated}, Errors: ${errors}, Total: ${mismatches.length}`
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
