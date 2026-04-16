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
  const preview = isStoryblokEditor(searchParams);

  const story = await getWebsitePageBySlug("rlc/resources", preview);

  if (!story) notFound();

  const rels = story.rels as any;
  const sections = story.content.sections || [];

  const resources = await getAllStoriesByFolder("rlc/resources", preview);

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
          resources: rlcCards,
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
  const stories = await getAllStoriesByFolder("rlc/resources", false);
  console.log(stories, "stories!!!@@###$#$%%^&^$$#FHg");
  return stories.map((story: any) => ({
    slug: story.slug.split("/").pop(),
  }));
}

export const generateMetadata = async (): Promise<Metadata> => {
  const metaData = await generateMetaDataByslug("rlc", "resources/");
  return metaData;
};
