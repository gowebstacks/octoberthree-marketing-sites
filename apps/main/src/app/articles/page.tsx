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


export default async function ArticlesPage(props: {
  params: Promise<PageParams>;
  searchParams?: Promise<SearchParams>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const preview = isStoryblokEditor(searchParams);

  const story = await getWebsitePageBySlug('octoberthree-main/articles', preview);

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
  console.log(updatedStory, 'updated story')

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
  const stories = await getAllStoriesByFolder('octoberthree-main/articles', false);
  return stories.map((story: any) => ({
    slug: story.slug.split("/").pop(),
  }));
}

export const generateMetadata = async (): Promise<Metadata> => {
   const metaData = await generateMetaDataByslug('octoberthree-main','articles/');
  return metaData;
};