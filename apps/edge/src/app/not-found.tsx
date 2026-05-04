import { notFound } from "next/navigation";

import { ComponentGenerator, storyblokFetch } from "@repo/storyblok";

export default async function NotFoundPage() {
  const site = process.env.NEXT_PUBLIC_SITE || "edge";
  const slug = `${site}/globals/404`;

  const data = await storyblokFetch(slug, {
    version: "published",
  });

  if (!data?.story) {
    notFound();
  }

  const story = data.story;
  const sections = story.content?.sections || [];

  return (
    <ComponentGenerator
      sections={sections}
      documentId={story.id.toString()}
      documentType={story.content.component}
    />
  );
}

