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
  const page = Number(searchParams?.page || 1);
  const search = searchParams?.search as string | undefined;
  const category = searchParams?.category as string | undefined;
  const preview = isStoryblokEditor(searchParams);

  const story = await getWebsitePageBySlug(
    "octoberthree-main/articles",
    preview
  );

  if (!story) notFound();

  const rels = story.rels as any;
  const sections = story.content.sections || [];
  const ITEMS_PER_PAGE = 4 * 5;

  const articles = await getAllStoriesByFolder(
    "octoberthree-main/articles",
    preview,
    {
      perPage: ITEMS_PER_PAGE,
      page,
  filterQuery: search ? { search } : undefined,
    }
  );
  const total = (articles as any).total || 0;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const articleRels = (articles as any).rels;
  const mergedRels = [...(rels || []), ...(articleRels || [])];

  const getDate = (content: any) => {
    return (
      content?.sections?.[0]?.section?.[0]?.body?.[0]?.eyebrow?.[0]?.eyebrow ||
      ""
    );
  };

  const articleCards = articles
    .filter((a: any) => a.full_slug !== "octoberthree-main/articles/")
    .map((article: any) => ({
      _uid: article.uuid,
      component: "resourceCard",

      title:
        article.content?.title ||
        article.content.sections[0]?.section[0]?.body[0]?.heading[0]?.heading ||
        "",

      mode: "dark",
      body: article.content.sections[1].section[0].body,

      link: {
        cached_url: `${article.full_slug}`,
        linktype: "story",
        fieldtype: "multilink",
      },

      featuredImage: {},

      tags: article.content.tags,

      date: getDate(article.content),
    }));

  const updatedSections = sections.map((layout: any) => ({
    ...layout,
    section: layout.section?.map((section: any) => {
      if (section.component === "resourceCardDeck") {
        return {
          ...section,
          resources: articleCards,
          pagination: {
            currentPage: page,
            totalPages,
          },
        };
      }
      return section;
    }),
  }));

  const updatedStory = {
    ...story,
    content: {
      ...story.content,
      sections: updatedSections,
    },
     rels: mergedRels, 
  };

  return (
    <>
      {preview ? (
        <StoryblokBridge story={updatedStory} />
      ) : (
        <ComponentGenerator
          sections={updatedSections}
          documentId={story.id.toString()}
          documentType={story.content.component}
          rels={mergedRels || []}
        />
      )}
    </>
  );
}

export async function generateStaticParams() {
  if (!isStoryblokConfigured()) return [];
  const stories = await getAllStoriesByFolder(
    "octoberthree-main/articles",
    false
  );
  return stories.map((story: any) => ({
    slug: story.slug.split("/").pop(),
  }));
}

export const generateMetadata = async (): Promise<Metadata> => {
  const metaData = await generateMetaDataByslug(
    "octoberthree-main",
    "articles/"
  );
  return metaData;
};
