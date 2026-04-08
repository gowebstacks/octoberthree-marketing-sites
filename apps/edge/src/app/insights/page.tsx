import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ComponentGenerator,
  getAllStoriesByFolder,
  getSiteSettings,
  getStoryBySlug,
  isStoryblokConfigured,
  renderMetadataFromStoryblok,
  StoryblokBridge,
  StoryblokSiteSettings,
} from "@repo/storyblok";
import { isStoryblokEditor } from "../../lib/helper";

export type PageParams = {
  slug: string;
};

type SearchParams = { [key: string]: string | string[] | undefined };

const INSIGHTS_FOLDER = "edge/insights";

export default async function InsightPage(props: {
  params: Promise<PageParams>;
  searchParams?: Promise<SearchParams>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const preview = isStoryblokEditor(searchParams);
  const fullSlug = `${INSIGHTS_FOLDER}`;

  const result = await getStoryBySlug(fullSlug, preview);

  if (!result) notFound();

  const { story, rels } = result;
  const sections = story.content.sections || [];

  const updatedStory = {
    ...story,
    content: {
      ...story.content,
      sections,
    },
  };

  return (
    <>
      {preview ? (
        <StoryblokBridge story={updatedStory} />
      ) : (
        <ComponentGenerator
          sections={sections}
          documentId={story.id.toString()}
          documentType={story.content.component}
          rels={rels || []}
        />
      )}
    </>
  );
}

export async function generateStaticParams() {
  if (!isStoryblokConfigured()) return [];
  const stories = await getAllStoriesByFolder(INSIGHTS_FOLDER, false);
  return stories.map((story: any) => ({
    slug: story.slug.split("/").pop(),
  }));
}

export const generateMetadata = async (props: {
  params: Promise<PageParams>;
}): Promise<Metadata> => {
  const { slug } = await props.params;
  const fullSlug = `${INSIGHTS_FOLDER}`;

  try {
    const result = await getStoryBySlug(fullSlug, false);
    if (!result) {
      return { title: "Insight Not Found" };
    }
   const seo = result.story.content.seo?.[0];

    return renderMetadataFromStoryblok(`insights`, process.env.NEXT_PUBLIC_SITE_URL || 'https://o3-edge-webstacks.vercel.app/', seo, {}as any);
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      title: "Insight",
      description: "Explore our insights",
    };
  }
};
