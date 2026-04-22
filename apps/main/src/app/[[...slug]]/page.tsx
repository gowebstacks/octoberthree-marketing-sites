import { notFound } from "next/navigation";
import { Metadata } from "next";

import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import {
  ComponentGenerator,
  generateMetaDataByslug,
  getAllTeamMembers,
  getPageData,
  getWebsitePageBySlug,
  StoryblokBridge,
  StoryblokSiteSettings,
} from "@repo/storyblok";
import { renderMetadata, SITE_CONFIG } from "@repo/ui";
import { isStoryblokEditor } from "../../lib/helper";

interface PageParams {
  slug?: string[];
}

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function SlugPage(props: {
  params: Promise<PageParams>;
  searchParams?: Promise<SearchParams>;
}) {
  const params = await props.params;
  const searchParams = props.searchParams
    ? await props.searchParams
    : undefined;
  const slugParam =
    params.slug && params.slug.length > 0 ? params.slug.join("/") : "home";
  const inEditor = isStoryblokEditor(searchParams);
  const preview = inEditor; 

 const page = await getPageData(
  `octoberthree-main/${slugParam}${slugParam === "articles" ? "/" : ""}`,
  preview
);

  if (!page) {
    notFound();
  }


  // Extract content and settings from Storyblok page
  const { content } = page;
  const rels = (page as any).rels || []; // Storyblok resolved relations are in rels.content
  const sections = content.sections || [];
  const pageSettings = content.pageSettings || {};

  // Build absolute URL matching the public canonical path
  const siteBase = SITE_CONFIG.urls.domain;
  const pathPart = slugParam === "homepage" ? "" : `/${slugParam}`;
  const absoluteUrl = `${siteBase}${pathPart}`;

  let updatedSections = sections;
  if (slugParam === "meet-our-team") {
    const getAuthorCard = (content: any) => {
      return content?.sections
        ?.flatMap((layout: any) => layout.section || [])
        ?.find((section: any) => section.component === "portableText")
        ?.body?.content?.find((node: any) => node.type === "blok")
        ?.attrs?.body?.find((blok: any) => blok.component === "authorCard");
    };

    const teamMembers = (
      await getAllTeamMembers(preview, "octoberthree-main")
    ).map((member: any) => {
      const authorCard = getAuthorCard(member.content);

      return {
        _uid: member.uuid,
        component: "leadershipCard",

        name: authorCard?.name || "",
        role: authorCard?.designation || "",
        location: authorCard?.location || "",
        image: authorCard?.headshotImage || {},

        team: authorCard?.team || [],
        ...member,
      };
    });

    updatedSections = sections.map((layout: any) => ({
      ...layout,
      section: layout.section?.map((section: any) => {
        if (section.component === "leadershipCardDeck") {
          return {
            ...section,
            rows: [
              {
                ...(section.rows?.[0] || {}),
                _uid: section.rows?.[0]?._uid || section._uid,
                component: "leadershipCardDeckRow",
                cards: teamMembers,
              },
            ],
          };
        }

        return section;
      }),
    }));

  }
const updatedStory = {
  ...page,
  content: {
    ...page.content,
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
          documentId={page.id.toString()}
          documentType={page.content.component}
          rels={rels}
        />
      )}
    </>
  );
}

export const generateMetadata = async (props: {
  params: Promise<PageParams>;
}): Promise<Metadata> => {
  const params = await props.params;

  const slugParam =
    params.slug && params.slug.length > 0
      ? params.slug.join("/")
      : "home";

   const metaData = await generateMetaDataByslug('octoberthree-main',slugParam);
  return metaData;
};