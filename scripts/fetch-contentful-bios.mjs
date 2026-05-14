import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const SPACE_ID = env.CONTENTFUL_SPACE_ID;
const ENV_ID = env.CONTENTFUL_ENV_ID;
const TOKEN = env.CONTENTFUL_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}`;

async function fetchAll(contentType) {
  let all = [];
  let skip = 0;
  while (true) {
    const params = new URLSearchParams({
      access_token: TOKEN,
      content_type: contentType,
      limit: "100",
      skip: String(skip),
      include: "2",
    });
    const res = await fetch(`${BASE_URL}/entries?${params}`);
    if (!res.ok) {
      console.error(`Failed to fetch ${contentType}: ${res.status}`);
      return [];
    }
    const data = await res.json();
    all.push(...data.items);
    if (all.length >= data.total) break;
    skip += 100;
  }
  return all;
}

async function main() {
  // First get all content types and their fields to find ones with bio/title fields
  const typesRes = await fetch(`${BASE_URL}/content_types?access_token=${TOKEN}`);
  const typesData = await typesRes.json();

  console.log("=== CONTENT TYPES WITH BIO OR TITLE-LIKE FIELDS ===\n");

  const bioRelatedTypes = [];

  for (const type of typesData.items) {
    const fieldNames = type.fields.map((f) => f.id);
    const hasBio = fieldNames.some((f) => /bio/i.test(f));
    const hasTitle = fieldNames.some((f) => /title|name/i.test(f));
    const hasHeadshot = fieldNames.some((f) => /photo|headshot|avatar|image/i.test(f));

    // Look for types that have bio fields, or are clearly person/team related
    if (hasBio || /bio|team|author|person|staff|member/i.test(type.sys.id) || /bio|team|author|person|staff|member/i.test(type.name)) {
      bioRelatedTypes.push(type);
      console.log(`Content Type: "${type.sys.id}" (${type.name})`);
      console.log(`  Fields: ${fieldNames.join(", ")}`);
      console.log(`  Has bio field: ${hasBio} | Has title/name: ${hasTitle} | Has photo: ${hasHeadshot}`);
      console.log();
    }
  }

  // Now fetch entries for each bio-related content type
  console.log("\n=== FETCHING RECORDS ===\n");

  for (const type of bioRelatedTypes) {
    const entries = await fetchAll(type.sys.id);
    const fieldNames = type.fields.map((f) => f.id);

    console.log(`\n--- ${type.name} (${type.sys.id}) — ${entries.length} records ---\n`);

    for (const entry of entries) {
      const f = entry.fields;
      const name = f.name || f.title || f.fullName || f.displayName || "(no name)";
      const bio = f.bio || f.biography || f.shortBio || f.description || null;
      const title = f.jobTitle || f.title || f.role || f.position || null;

      console.log(`  Name: ${name}`);
      if (title && title !== name) console.log(`  Title/Role: ${title}`);
      if (bio) {
        const bioText = typeof bio === "string" ? bio : JSON.stringify(bio).substring(0, 150);
        console.log(`  Bio: ${bioText.substring(0, 150)}${bioText.length > 150 ? "..." : ""}`);
      }
      console.log(`  ID: ${entry.sys.id}`);
      console.log(`  Updated: ${entry.sys.updatedAt}`);
      console.log();
    }
  }

  // Also check post authors — posts may embed author bios
  console.log("\n=== POST AUTHOR FIELDS (sample of 10 most recent) ===\n");

  const params = new URLSearchParams({
    access_token: TOKEN,
    content_type: "post",
    limit: "10",
    order: "-sys.updatedAt",
    include: "2",
  });
  const postRes = await fetch(`${BASE_URL}/entries?${params}`);
  const postData = await postRes.json();

  for (const entry of postData.items) {
    const f = entry.fields;
    const title = f.title || "(no title)";
    const authorFields = Object.keys(f).filter((k) => /author|writer|byline|bio/i.test(k));

    console.log(`  Post: ${title}`);
    if (authorFields.length > 0) {
      for (const af of authorFields) {
        const val = f[af];
        if (val && typeof val === "object" && val.sys) {
          // It's a linked entry — find it in includes
          const linked = postData.includes?.Entry?.find((e) => e.sys.id === val.sys.id);
          if (linked) {
            console.log(`    ${af}: ${linked.fields.name || linked.fields.title || JSON.stringify(linked.fields).substring(0, 100)}`);
          } else {
            console.log(`    ${af}: (linked entry ${val.sys.id})`);
          }
        } else if (Array.isArray(val)) {
          for (const item of val) {
            if (item?.sys) {
              const linked = postData.includes?.Entry?.find((e) => e.sys.id === item.sys.id);
              if (linked) {
                console.log(`    ${af}: ${linked.fields.name || linked.fields.title || JSON.stringify(linked.fields).substring(0, 100)}`);
              }
            }
          }
        } else {
          console.log(`    ${af}: ${JSON.stringify(val).substring(0, 100)}`);
        }
      }
    } else {
      console.log(`    (no author/bio fields)`);
    }
    console.log();
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
