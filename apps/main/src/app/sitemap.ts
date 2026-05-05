const BASE_URL = "https://api.storyblok.com/v2/cdn/stories";

const SITE = process.env.NEXT_PUBLIC_SITE!;
const TOKEN = process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN;

const DOMAIN =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL || "https://october3-main-webstacks.vercel.app/"
    : "http://localhost:3000";


    //  ENV DEBUG
console.log("[env] NODE_ENV:", process.env.NODE_ENV);
console.log("[env] SITE:", SITE);
console.log("[env] DOMAIN:", DOMAIN);
console.log("[env] TOKEN exists:", !!TOKEN);

async function getAllStories() {
  let page = 1;
  let allStories: any[] = [];

  while (true) {
    const res = await fetch(
      `${BASE_URL}?version=published&per_page=100&page=${page}&token=${TOKEN}&resolve_relations=seo`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`Storyblok fetch failed: ${res.status}`);
    }

    const data = await res.json();
     console.log(`[data] stories count (page ${page}):`, data.stories?.length);
    console.log(
      `[data] first slug (page ${page}):`,
      data.stories?.[0]?.full_slug
    );
    allStories.push(...data.stories);

    if (data.stories.length < 100) break;
    page++;
  }

  return allStories;
}

export default async function sitemap() {
  try {
    const stories = await getAllStories();

    return stories
      .filter((story) => !story.is_folder)
      .filter((story) => story.full_slug.startsWith(SITE))

      .filter((story) => {
        const seo = story.content?.seo?.[0];
        return !seo?.noIndex;
      })

      .filter((story) => {
        const slug = story.full_slug;
        return (
          slug &&
          !slug.includes(".") &&
          !slug.includes("/tags") &&
          !slug.includes("/topics") &&
          !slug.includes("/globals")
        );
      })

      .map((story) => {
        const slug = story.full_slug.replace(`${SITE}/`, "");

        const url =
          slug === "home" || slug === ""
            ? DOMAIN
            : `${DOMAIN}/${slug}`;

        return {
          url,
          lastModified: story.published_at
            ? new Date(story.published_at)
            : new Date(),
        };
      });
  } catch {
    return [
      {
        url: DOMAIN,
        lastModified: new Date(),
      },
    ];
  }
}