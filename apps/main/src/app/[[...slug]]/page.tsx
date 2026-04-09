import { notFound } from "next/navigation";
import { Metadata } from "next";

import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import {
  ComponentGenerator,
  getAllTeamMembers,
  getAllWebsitePageSlugs,
  getWebsitePageBySlug,
  isStoryblokConfigured,
  renderMetadataFromStoryblok,
  StoryblokBridge,
  StoryblokSiteSettings,
} from "@repo/storyblok";
import { renderMetadata, SITE_CONFIG } from "@repo/ui";

interface PageParams {
  slug?: string[];
}

type SearchParams = { [key: string]: string | string[] | undefined };

function isStoryblokEditor(searchParams?: SearchParams) {
  const qp = searchParams || {};
  const getParam = (k: string): string | undefined => {
    const v = qp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const version = (getParam("version") || "").toLowerCase();
  const hasSbKey = Object.keys(qp).some((k) =>
    k.toLowerCase().includes("storyblok")
  );
  const hasPreviewKey = ["_storyblok", "storyblok", "sb", "preview"].some(
    (k) => !!getParam(k)
  );

  return hasSbKey || hasPreviewKey || version === "draft";
}

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
console.log(slugParam)

  const page = await getWebsitePageBySlug(
    `octoberthree-main/${slugParam}${slugParam === 'articles' ? '/' :''}`,
    preview
  );
  console.log(page, slugParam, "page data");

  if (!page) {
    notFound();
  }
  console.log(
    "*********************************************************",
    page.content.sections,
    slugParam
  );

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
  console.log(slugParam, "slug param");
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
    console.log(teamMembers, "team members data");

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

    console.log(updatedSections, "updated sections with team members");
  }
const updatedStory = {
  ...page,
  content: {
    ...page.content,
    sections: updatedSections,
  },
};
  console.log(preview, "preview mode ______--------------------");
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
  const { slug } = await props.params;

  const slugParam =
    slug && slug.length > 0 ? slug.join("/") : "home";

  try {
    const story = await getWebsitePageBySlug(
      `octoberthree-main/${slugParam}${slugParam === "articles" ? "/" : ""}`,
      false
    );

    if (!story) {
      return { title: "Page Not Found" };
    }

    const seo = story.content?.seo?.[0];

    return renderMetadataFromStoryblok(
      slugParam === "home" ? "" : slugParam,
      process.env.NEXT_PUBLIC_SITE_URL ||
        "https://october3-main-webstacks.vercel.app/",
      seo,
      null
    );
  } catch {
    return {
      title: "Website",
      description: "Default description",
    };
  }
};