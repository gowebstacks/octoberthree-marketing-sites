import { notFound } from "next/navigation";
import { Metadata } from "next";

import {
  ComponentGenerator,
  generateMetaDataByslug,
  getAllTeamMembers,
  getPageData,
  StoryblokBridge,
  StoryblokSiteSettings,
} from "@repo/storyblok";
import { SITE_CONFIG } from "@repo/ui";
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
  `rlc/${slugParam}${slugParam === 'resources' || slugParam === 'services' ? '/' : ''}`,
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
  if (slugParam === "meet-the-team") {
    const currentPage = Number(searchParams?.page || 1);
    const ITEMS_PER_PAGE = 16;
    const selectedTeams = searchParams?.team
      ? Array.isArray(searchParams.team)
        ? searchParams.team
        : [searchParams.team]
      : [];

    const selectedNames = searchParams?.name
      ? Array.isArray(searchParams.name)
        ? searchParams.name
        : [searchParams.name]
      : [];

    const getAuthorCard = (content: any) =>
      content?.sections
        ?.flatMap((layout: any) => layout.section || [])
        ?.find((section: any) => section.component === "portableText")
        ?.body?.content?.find((node: any) => node.type === "blok")
        ?.attrs?.body?.find((blok: any) => blok.component === "authorCard");

    const teamMembersResponse = await getAllTeamMembers(
      preview,
      "rlc"
    );

    const allCards = teamMembersResponse
      .map((member: any) => {
        const authorCard = getAuthorCard(member.content);

        if (!authorCard) return null;

        return {
          _uid: member.uuid,
          component: "leadershipCard",
          name: authorCard.name || "",
          role: authorCard.designation || "",
          location: authorCard.location || "",
          image: authorCard.headshotImage || {},
          team: authorCard.team || [],
          slug: member.slug,
          ...member,
        };
      })
      .filter(Boolean);

    const allTeams = [
      ...new Set(allCards.flatMap((card: any) => card.team || [])),
    ].sort();

    const allNames = [
      ...new Set(allCards.map((card: any) => card.name).filter(Boolean)),
    ].sort();

    const filteredMembers = allCards.filter((member: any) => {
      const matchesTeam =
        !selectedTeams.length ||
        selectedTeams.some((team) => member.team?.includes(team));

      const matchesName =
        !selectedNames.length || selectedNames.includes(member.name);

      return matchesTeam && matchesName;
    });

    const totalPages = Math.max(
      1,
      Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    const paginatedMembers = filteredMembers.slice(
      start,
      start + ITEMS_PER_PAGE
    );

    updatedSections = sections.map((layout: any) => ({
      ...layout,
      section: layout.section?.map((section: any) => {
        if (section.component !== "leadershipCardDeck") {
          return section;
        }

        return {
          ...section,
          pagination: {
            currentPage: safeCurrentPage,
            totalPages,
          },
          allTeams,
          allNames,
          rows: [
            {
              ...(section.rows?.[0] || {}),
              _uid: section.rows?.[0]?._uid || section._uid,
              component: "leadershipCardDeckRow",
              cards: paginatedMembers,
            },
          ],
        };
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
    params.slug && params.slug.length > 0 ? params.slug.join("/") : "home";

  const metaData = await generateMetaDataByslug("rlc", slugParam);
  return metaData;
};
