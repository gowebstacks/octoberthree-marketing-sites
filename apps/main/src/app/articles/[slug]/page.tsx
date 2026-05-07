import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";

import {
  ComponentGenerator,
  generateMetaDataByslug,
  getAllStoriesByFolder,
  getPageData,
  getWebsitePageBySlug,
  isStoryblokConfigured,
  StoryblokBridge,
} from "@repo/storyblok";

import { isStoryblokEditor } from "../../../lib/helper";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

const ArticleContent = async ({
  slug,
  preview,
}: {
  slug: string;
  preview: boolean;
}) => {
  const article = await getPageData(
    `octoberthree-main/articles/${slug}`,
    preview
  );

  if (!article) return notFound();

  const { content } = article;
  const rels = (article as any).rels || [];
  const sections = content.sections || [];

  console.log(content, "article content for tags");
  console.log(rels, "article content for rels tags");

  return (
    <>
      {preview ? (
        <StoryblokBridge
          story={{
            ...article,
            content: {
              ...article.content,
              sections,
            },
            rels,
          }}
        />
      ) : (
        <ComponentGenerator
          sections={sections}
          documentId={article.id.toString()}
          documentType={article.content.component}
          rels={rels}
          tags={content.tags || []}
          topics={content.topics || []}
        />
      )}
    </>
  );
};

const ArticlePageContainer = async (props: {
  params: Promise<PageProps["params"]>;
  searchParams?: Promise<PageProps["searchParams"]>;
}) => {
  const params = await props.params;
  const searchParams = props.searchParams
    ? await props.searchParams
    : undefined;
  const { slug } = params;
  const preview = isStoryblokEditor(searchParams);

  try {
    return (
      <Suspense fallback={<div>Loading article...</div>}>
        <ArticleContent slug={slug} preview={preview} />
      </Suspense>
    );
  } catch {
    return notFound();
  }
};

export default ArticlePageContainer;

export type PageParams = {
  slug: string;
};
export const generateMetadata = async (props: {
  params: Promise<PageParams>;
}): Promise<Metadata> => {
  const params = await props.params;

  const slugParam =
    params.slug && params.slug.length > 0 ? params.slug : "home";

  const metaData = await generateMetaDataByslug(
    "octoberthree-main",
    `articles/${slugParam}`
  );
  return metaData;
};

// export async function generateStaticParams() {
//   if (!isStoryblokConfigured()) return [];
//   const stories = await getAllStoriesByFolder(
//     "octoberthree-main/articles",
//     false
//   );
//   return stories.map((story: any) => ({
//     slug: story.slug.split("/").pop(),
//   }));
// }
