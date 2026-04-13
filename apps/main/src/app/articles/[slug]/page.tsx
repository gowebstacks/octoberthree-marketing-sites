import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";

import {
  ComponentGenerator,
  generateMetaDataByslug,
  getArticleBySlug,
  getWebsitePageBySlug,
  StoryblokBridge,
} from "@repo/storyblok";

import { isStoryblokEditor } from "../../../lib/helper";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

const ArticleContent = async ({
  slug,
  preview,
}: {
  slug: string;
  preview: boolean;
}) => {
  const article = await getWebsitePageBySlug(
    `octoberthree-main/articles/${slug}`,
    preview
  );

  if (!article) return notFound();

  const { content } = article;
  const rels = (article as any).rels || [];
  const sections = content.sections || [];


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
          }}
        />
      ) : (
        <ComponentGenerator
          sections={sections}
          documentId={article.id.toString()}
          documentType={article.content.component}
          rels={rels}
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
      <Suspense fallback={<div>Loading team member...</div>}>
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
    params.slug && params.slug.length > 0
      ? params.slug
      : "home";

   const metaData = await generateMetaDataByslug('octoberthree-main', `articles/${slugParam}`);
  return metaData;
};
