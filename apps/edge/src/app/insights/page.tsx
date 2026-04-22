import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ComponentGenerator,
  generateMetaDataByslug,
  getAllStoriesByFolder,
  getPageData,
  getSiteSettings,
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
  const page = Number(searchParams?.page || 1);
  const search = searchParams?.search as string | undefined;
  const rawCategory = searchParams?.category as string | undefined;

  const category = rawCategory
    ? rawCategory.replace(/_/g, "-").toLowerCase()
    : undefined;
  const preview = isStoryblokEditor(searchParams);
  const ITEMS_PER_PAGE = 4 * 5;
const story = await getPageData("edge/insights", preview);
  if (!story) notFound();

  const rels = story.rels as any;
  const sections = story.content.sections || [];

    const filterQuery = {
  ...(search && { search }),
  ...(category && {category})}

  const insights = await getAllStoriesByFolder("edge/insights", preview, {
    perPage: ITEMS_PER_PAGE,
    page,
      filterQuery: Object.keys(filterQuery).length ? filterQuery : undefined,
  },
  'edge'
);
  const total = (insights as any).total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const insightRels = (insights as any).rels;
  const mergedRels = [...(rels || []), ...(insightRels || [])];

  const getDate = (content: any) => {
    return (
      content?.sections?.[0]?.section?.[0]?.body?.[0]?.eyebrow?.[0]?.eyebrow ||
      ""
    );
  };

  const insightCards = insights
    .filter((a: any) => a.full_slug !== "edge/insights/")
    .map((insight: any) => ({
      _uid: insight.uuid,
      component: "resourceCard",

      title:
        insight.content?.title ||
        insight.content.sections[0]?.section[0]?.body[0]?.heading[0]?.heading ||
        "",

      mode: "dark",
      body: insight.content.sections[1].section[0].body,

      link: {
        cached_url: `${insight.full_slug}`,
        linktype: "story",
        fieldtype: "multilink",
      },

      featuredImage: {},

      tags: insight.content.tags,

      date: getDate(insight.content),
    }));

  const updatedSections = sections.map((layout: any) => ({
    ...layout,
    section: layout.section?.map((section: any) => {
      if (section.component === "resourceCardDeck") {
        return {
          ...section,
          resources: insightCards,
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



export const generateMetadata = async (): Promise<Metadata> => {
  const metaData = await generateMetaDataByslug("edge", "insights/");
  return metaData;
};
