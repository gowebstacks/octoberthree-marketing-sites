import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  ComponentGenerator,
  getAllStoriesByFolder,
  getInsightBySlug,
  getStoryBySlug,
  isStoryblokConfigured,
  renderMetadataFromStoryblok,
  StoryblokBridge,
} from "@repo/storyblok";
import { renderMetadata } from "@repo/ui";
import { isStoryblokEditor } from "../../../lib/helper";
import { PageParams } from "../page";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

// Folder where insight stories live (e.g., 'edge/insights')
const INSIGHTS_FOLDER = "edge/insights";

const InsightContent = async ({
  slug,
  preview,
}: {
  slug: string;
  preview: boolean;
}) => {
  const fullSlug = `${INSIGHTS_FOLDER}/${slug}`;
  const story = await getInsightBySlug(slug, preview, INSIGHTS_FOLDER);
  if (!story) return notFound();

  const { content } = story;
  const sections = content.sections || [];
  const rels = (story as any).rels || [];

  return (
    <>
      {preview ? (
        <StoryblokBridge
          story={{ ...story, content: { ...story.content, sections } }}
        />
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
};

// export async function generateStaticParams() {
//   if (!isStoryblokConfigured()) return [];
//   try {
//     const stories = await getAllStoriesByFolder(INSIGHTS_FOLDER, false);
//     return stories.map((story: any) => ({
//       slug: story.slug.split("/").pop(), 
//     }));
//   } catch {
//     return [];
//   }
// }

export const generateMetadata = async (props: {
  params: Promise<PageParams>;
}): Promise<Metadata> => {
  const { slug } = await props.params;

  try {
    const story = await getInsightBySlug(slug, false);
    if (!story) {
      return { title: "Insight Not Found" };
    }
   const seo = story.content.seo?.[0];
   console.log(seo, "seo content", story)

    return renderMetadataFromStoryblok(`insights/${slug}`, process.env.NEXT_PUBLIC_SITE_URL || 'https://o3-edge-webstacks.vercel.app/', seo, {}as any);
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      title: "Insight",
      description: "Explore our insights",
    };
  }
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
