import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ComponentGenerator,
  generateMetaDataByslug,
  getAllStoriesByFolder,
  getSiteSettings,
  getWebsitePageBySlug,
  isStoryblokConfigured,
  StoryblokBridge,
  StoryblokSiteSettings,
} from "@repo/storyblok";
import { isStoryblokEditor } from "../../lib/helper";

export type PageParams = {
  slug: string;
};

type SearchParams = { [key: string]: string | string[] | undefined };


export default async function InsightPage(props: {
  params: Promise<PageParams>;
  searchParams?: Promise<SearchParams>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const preview = isStoryblokEditor(searchParams);

  const story = await getWebsitePageBySlug('edge/insights', preview);

  if (!story) notFound();

  const rels = story.rels as any
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
  const stories = await getAllStoriesByFolder('edge/insights', false);
  return stories.map((story: any) => ({
    slug: story.slug.split("/").pop(),
  }));
}

export const generateMetadata = async (): Promise<Metadata> => {
   const metaData = await generateMetaDataByslug('edge','insights/');
  return metaData;
};