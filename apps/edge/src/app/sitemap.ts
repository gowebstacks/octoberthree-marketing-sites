export const dynamic = "force-static";

import { getAllStories } from "@repo/storyblok";

const SITE = process.env.NEXT_PUBLIC_SITE!;
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap() {
  try {
    const stories = await getAllStories();

    return stories
      .filter((s) => !s.is_folder)
      .filter((s) => s.full_slug.startsWith(SITE))
      .filter((s) => !s.content?.seo?.[0]?.noIndex)
      .filter(
        (s) =>
          s.full_slug &&
          !s.full_slug.includes(".") &&
          !s.full_slug.includes("/tags") &&
          !s.full_slug.includes("/topics") &&
          !s.full_slug.includes("/globals")
      )
      .map((s) => {
        const slug = s.full_slug.replace(`${SITE}/`, "");
        return {
          url: slug === "home" ? DOMAIN : `${DOMAIN}/${slug}`,
          lastModified: new Date(s.published_at || Date.now()),
        };
      });
  } catch {
    return [{ url: DOMAIN, lastModified: new Date() }];
  }
}