import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env file
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

if (!SPACE_ID || !ENV_ID || !TOKEN) {
  console.error(
    "Missing required env vars: CONTENTFUL_SPACE_ID, CONTENTFUL_ENV_ID, CONTENTFUL_TOKEN"
  );
  process.exit(1);
}

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}`;

async function fetchAllBlogPosts() {
  // First, discover content types to find the blog post type
  const typesRes = await fetch(`${BASE_URL}/content_types?access_token=${TOKEN}`);
  if (!typesRes.ok) {
    const err = await typesRes.text();
    console.error(`Failed to fetch content types: ${typesRes.status}`, err);
    process.exit(1);
  }

  const typesData = await typesRes.json();
  const typeIds = typesData.items.map((t) => t.sys.id);
  console.log("Available content types:", typeIds.join(", "));

  // Look for a blog-related content type
  const blogType = typesData.items.find((t) =>
    /blog|post|article/i.test(t.sys.id) || /blog|post|article/i.test(t.name)
  );

  if (!blogType) {
    console.log("\nNo blog-specific content type found. Fetching all entries instead.\n");
  } else {
    console.log(`\nUsing content type: "${blogType.sys.id}" (${blogType.name})\n`);
  }

  // Fetch entries (paginated, 100 per page)
  let allEntries = [];
  let skip = 0;
  const limit = 100;

  while (true) {
    const params = new URLSearchParams({
      access_token: TOKEN,
      limit: String(limit),
      skip: String(skip),
      include: "2",
    });

    if (blogType) {
      params.set("content_type", blogType.sys.id);
    }

    const res = await fetch(`${BASE_URL}/entries?${params}`);
    if (!res.ok) {
      const err = await res.text();
      console.error(`Failed to fetch entries: ${res.status}`, err);
      process.exit(1);
    }

    const data = await res.json();
    allEntries.push(...data.items);

    console.log(`Fetched ${allEntries.length} / ${data.total} entries...`);

    if (allEntries.length >= data.total) break;
    skip += limit;
  }

  console.log(`\nTotal blog posts fetched: ${allEntries.length}\n`);

  // Print summary of each entry
  for (const entry of allEntries) {
    const fields = entry.fields;
    const title = fields.title || fields.name || fields.headline || "(no title)";
    const slug = fields.slug || fields.url || "(no slug)";
    const createdAt = entry.sys.createdAt;
    const updatedAt = entry.sys.updatedAt;

    console.log(`- ${title}`);
    console.log(`  Slug: ${slug}`);
    console.log(`  Created: ${createdAt} | Updated: ${updatedAt}`);
    console.log(`  ID: ${entry.sys.id}`);
    console.log();
  }

  return allEntries;
}

fetchAllBlogPosts().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
