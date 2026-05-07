import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  ComponentGenerator,
  generateMetaDataByslug,
  getAllStoriesByFolder,
  getPageData,
  isStoryblokConfigured,
  StoryblokBridge,
} from "@repo/storyblok";
import { isStoryblokEditor } from "../../../lib/helper";
import { PageParams } from "../page";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

const ResourceContent = async ({
  slug,
  preview,
}: {
  slug: string;
  preview: boolean;
}) => {
  const story = await getPageData(`rlc/resources/${slug}`, preview);
  if (!story) return notFound();

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

const ResourcePageContainer = async (props: {
  params: Promise<PageProps["params"]>;
  searchParams?: Promise<PageProps["searchParams"]>;
}) => {
  const { slug } = await props.params;
  const preview = isStoryblokEditor(
    props.searchParams ? await props.searchParams : undefined
  );
  try {
    return (
      <Suspense fallback={<div>Loading resource...</div>}>
        <ResourceContent slug={slug} preview={preview} />
      </Suspense>
    );
  } catch {
    return notFound();
  }
};

export default ResourcePageContainer;

export const generateMetadata = async (props: {
  params: Promise<PageParams>;
}): Promise<Metadata> => {
  const params = await props.params;

  const slugParam =
    params.slug && params.slug.length > 0 ? params.slug : "home";

  const metaData = await generateMetaDataByslug(
    "rlc",
    `resources/${slugParam}`
  );
  return metaData;
};

// export async function generateStaticParams() {
//   if (!isStoryblokConfigured()) return [];
//   const stories = await getAllStoriesByFolder("rlc/resources", false);
//   return stories.map((story: any) => ({
//     slug: story.slug.split("/").pop(),
//   }));
// }
