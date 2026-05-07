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

export default async function ResourcesPage(props: {
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
  const ITEMS_PER_PAGE = 4 * 5;
  const preview = isStoryblokEditor(searchParams);

  const story = await getWebsitePageBySlug("rlc/resources", preview);

  if (!story) notFound();

  const categories = await getAllStoriesByFolder(
  "rlc/categories",
);

  const rels = story.rels as any;
  const sections = story.content.sections || [];

  const filterQuery = {
    ...(search && { search }),
    ...(category && { category }),
  };
  const resources = await getAllStoriesByFolder(
    "rlc/resources",
    preview,
    {
      perPage: ITEMS_PER_PAGE,
      page,
      filterQuery: Object.keys(filterQuery).length ? filterQuery : undefined,
    },
    "rlc"
  );
  const total = (resources as any).total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const rlcRels = (resources as any).rels;
  const mergedRels = [...(rels || []), ...(rlcRels || [])];

  const getDate = (content: any) => {
    return (
      content?.sections?.[0]?.section?.[0]?.body?.[0]?.eyebrow?.[0]?.eyebrow ||
      ""
    );
  };

  const rlcCards = resources
    .filter((a: any) => a.full_slug !== "rlc/resources/")
    .map((rlc: any) => ({
      _uid: rlc.uuid,
      component: "resourceCard",

      title:
        rlc.content?.title ||
        rlc.content.sections[0]?.section[0]?.body[0]?.heading[0]?.heading ||
        "",

      excerpt: rlc.content.sections[0].section[0].body[0],
      mode: "dark",
      body: rlc.content.sections[1].section[0].body,

      link: {
        cached_url: `${rlc.full_slug}`,
        linktype: "story",
        fieldtype: "multilink",
      },

      featuredImage: {},

      tags: rlc.content.tags,

      date: getDate(rlc.content),
    }));

  const updatedSections = sections.map((layout: any) => ({
    ...layout,
    section: layout.section?.map((section: any) => {
      if (section.component === "resourceCardDeck") {
        return {
          ...section,
          categories,
          resources: rlcCards,
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
  const metaData = await generateMetaDataByslug("rlc", "resources/");
  return metaData;
};
