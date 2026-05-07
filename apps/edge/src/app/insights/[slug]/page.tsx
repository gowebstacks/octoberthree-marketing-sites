import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  ComponentGenerator,
  generateMetaDataByslug,
  getAllStoriesByFolder,
  getPageData,
  StoryblokBridge,
} from "@repo/storyblok";
import { isStoryblokEditor } from "../../../lib/helper";
import { PageParams } from "../page";
import { isStoryblokConfigured } from "@repo/ui";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

// Folder where insight stories live (e.g., 'edge/insights')
const INSIGHTS_FOLDER = "edge/insights";

const InsightContent = async ({
  slug,
  preview,
}: {
  slug: string;
  preview: boolean;
}) => {
const story = await getPageData(
  `edge/insights/${slug}`,
  preview
);  if (!story) return notFound();

  const { content } = story;
  const sections = content.sections || [];
  const rels = (story as any).rels || [];

  return (
    <>
      {preview ? (
       <StoryblokBridge
  story={{
    ...story,
    content: {
      ...story.content,
      sections,
    },
    rels,
  }}
/>
      ) : (
        <ComponentGenerator
          sections={sections}
          documentId={story.id.toString()}
          documentType={story.content.component}
          rels={rels || []}
            tags={content.tags || []}
  topics={content.topics || []}
        />
      )}
    </>
  );
};


const InsightPageContainer = async (props: {
  params: Promise<PageProps["params"]>;
  searchParams?: Promise<PageProps["searchParams"]>;
}) => {
  const { slug } = await props.params;
  const preview = isStoryblokEditor(
    props.searchParams ? await props.searchParams : undefined
  );
  try {
    return (
      <Suspense fallback={<div>Loading insight...</div>}>
        <InsightContent slug={slug} preview={preview} />
      </Suspense>
    );
  } catch {
    return notFound();
  }
};

export default InsightPageContainer;


export const generateMetadata = async (props: {
  params: Promise<PageParams>;
}): Promise<Metadata> => {
  const params = await props.params;

  const slugParam =
    params.slug && params.slug.length > 0
      ? params.slug
      : "home";

   const metaData = await generateMetaDataByslug('edge', `insights/${slugParam}`);
  return metaData;
};

// export async function generateStaticParams() {
//   if (!isStoryblokConfigured()) return [];
//   const stories = await getAllStoriesByFolder("edge/insights", false);
//   return stories.map((story: any) => ({
//     slug: story.slug.split("/").pop(),
//   }));
// }