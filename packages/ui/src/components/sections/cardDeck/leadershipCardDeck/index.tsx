"use client";

import type { FC } from "react";
import { useMemo } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { ContentBlock, LeadershipCard } from "../../../organisms";
import { Dropdown, Pagination } from "../../../molecules";
import { Badge, Heading } from "../../../atoms";
import { buildRelMap } from "../../../../utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type StoryblokRel = {
  uuid: string;
  content: any;
  slug?: string;
};

interface LeadershipCardRow {
  cardsPerRow?: string;
  cardsPerRowTablet?: string;
  cardsPerRowMobile?: string;
  cards?: any[];
}

interface LeadershipCardDeckBlok extends SbBlokData {
  content?: any[];
  rows?: LeadershipCardRow[];
  htmlId?: string;
  rels?: StoryblokRel[];
  filterable?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
  allTeams?: string[];
  allNames?: string[];
}

const getGridClass = (desktop?: string, tablet?: string, mobile?: string) => {
  const m =
    mobile === "2"
      ? "grid-cols-2"
      : mobile === "3"
        ? "grid-cols-3"
        : mobile === "4"
          ? "grid-cols-4"
          : "grid-cols-1";
  const t =
    tablet === "2"
      ? "sm:grid-cols-2"
      : tablet === "3"
        ? "sm:grid-cols-3"
        : tablet === "4"
          ? "sm:grid-cols-4"
          : "sm:grid-cols-3";
  const d =
    desktop === "2"
      ? "lg:grid-cols-2"
      : desktop === "3"
        ? "lg:grid-cols-3"
        : desktop === "4"
          ? "lg:grid-cols-4"
          : "lg:grid-cols-4";
  return `${m} ${t} ${d}`;
};

const extractCardContent = (card: any) => ({
  name: card.name,
  location: card.location,
  team: card.team || [],
});
const getAuthorCard = (content: any) => {
  return content?.sections
    ?.flatMap((layout: any) => layout.section || [])
    ?.find((section: any) => section.component === "portableText")
    ?.body?.content?.find((node: any) => node.type === "blok")
    ?.attrs?.body?.find((blok: any) => blok.component === "authorCard");
};
const resolveRelatedBios = (card: any, relMap: Record<string, any>) => {
  if (card.component !== "relatedBios" || !card.relatedBio) return [card];

  return card.relatedBio
    .map((uuid: string) => {
      const content = relMap[uuid];

      if (!content) return null;
      const authorCard = getAuthorCard(content);

      if (!authorCard) return null;

      return {
        _uid: uuid,
        component: "leadershipCard",
        name: authorCard.name,
        location: authorCard.location,
        team: authorCard.team || [],
        image: authorCard.headshotImage,
        role: authorCard.designation,
        slug: content.slug,
      };
    })
    .filter(Boolean);
};

export const LeadershipCardDeck: FC<LeadershipCardDeckBlok> = ({
  content,
  rows,
  htmlId,
  rels = [],
  filterable,
  pagination,
  allTeams = [],
  allNames = [],
  ...blok
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const teams = searchParams.getAll("team");
  const names = searchParams.getAll("name");

  const relMap = useMemo(() => buildRelMap(rels), [rels]);

  const allCards = useMemo(() => {
    if (!rows) return [];
    return rows.flatMap((row) =>
      (row.cards ?? []).flatMap((card) => resolveRelatedBios(card, relMap))
    );
  }, [rows, relMap]);

  const TEAM_ORDER = [
    "Our Leadership",
    "Retirement Solutions",
    "Actuarial",
    "Pension Risk Transfer",
    "Advisor Services",
    "Pension Administration",
    "McCreedy",
    "Actuarial Operations",
    "Operations",
    "Marketing",
    "IT",
    "Finance",
  ];
  const shouldLinkToTeamPage =
    pathname.includes("meet-our-team") || pathname.includes("meet-the-team");
  const teamOptions = useMemo(() => {
    return allTeams
      .sort((a, b) => {
        const indexA = TEAM_ORDER.indexOf(a);
        const indexB = TEAM_ORDER.indexOf(b);

        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      })
      .map((t) => ({
        label: t,
        value: t,
      }));
  }, [allTeams]);
  const nameOptions = useMemo(
    () =>
      allNames.map((n) => ({
        label: n,
        value: n,
      })),
    [allNames]
  );

  const groupedPaginatedRows = useMemo(() => {
    if (!rows) return [];

    const paginatedUids = new Set(allCards.map((c) => c._uid));
    return rows
      .map((row) => {
        const expandedCards = (row.cards ?? []).flatMap((card) =>
          resolveRelatedBios(card, relMap)
        );

        const filteredRowCards = expandedCards.filter((card) =>
          paginatedUids.has(card._uid)
        );

        return { ...row, cards: filteredRowCards };
      })
      .filter((row) => row.cards.length > 0);
  }, [rows, allCards, relMap]);

  const hasRelatedBios = useMemo(() => {
    if (!rows) return false;

    return rows.some((row) =>
      (row.cards || []).some((card) => card.component === "relatedBios")
    );
  }, [rows]);

  return (
    <div
      className="flex flex-col gap-12 sm:gap-16 mx-auto max-w-360"
      {...storyblokEditable(blok)}
      id={htmlId}
    >
      {hasRelatedBios && (
        <Heading as={"h3"} size={"4xl"}>
          Related People
        </Heading>
      )}
      {filterable && (
        <div className="border border-(--stroke-secondary) p-4 sm:px-8 sm:py-4.5 lg:py-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Dropdown
              label="Select a Team"
              multiple
              value={teams}
              onChange={(v) => {
                const params = new URLSearchParams(searchParams.toString());

                params.delete("team");

                (v as string[]).forEach((team) => {
                  params.append("team", team);
                });

                params.delete("page");

                router.push(`${pathname}?${params.toString()}`);
              }}
              options={teamOptions}
              placeholder="All"
            />
            {/* Removed as per bugticket #187*/}
            {/* <Dropdown
              label="Location"
              multiple
              value={locations}
              onChange={(v) => setLocations(v as string[])}
              options={locationOptions}
              placeholder="All"
            /> */}
            <Dropdown
              label="Search by Name"
              multiple
              value={names}
              onChange={(v) => {
                const params = new URLSearchParams(searchParams.toString());

                params.delete("name");

                (v as string[]).forEach((name) => {
                  params.append("name", name);
                });

                params.delete("page");

                router.push(`${pathname}?${params.toString()}`);
              }}
              options={nameOptions}
              placeholder="Search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => (
              <Badge
                key={team}
                label={team}
                onRemove={() => {
                  const params = new URLSearchParams(searchParams.toString());

                  const updatedTeams = teams.filter((t) => t !== team);

                  params.delete("team");

                  updatedTeams.forEach((t) => {
                    params.append("team", t);
                  });

                  params.delete("page");

                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            ))}
            {names.map((name) => (
              <Badge
                key={name}
                label={name}
                onRemove={() => {
                  const params = new URLSearchParams(searchParams.toString());

                  const updatedNames = names.filter((n) => n !== name);

                  params.delete("name");

                  updatedNames.forEach((n) => {
                    params.append("name", n);
                  });

                  params.delete("page");

                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-y-(--gaps-56-48-48)">
        {groupedPaginatedRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid  w-full gap-y-(--gaps-56-48-48) gap-x-(--gaps-16-12-12) ${getGridClass(row.cardsPerRow, row.cardsPerRowTablet, row.cardsPerRowMobile)}`}
          >
            {row.cards?.map((card, i) =>
              shouldLinkToTeamPage ? (
                <a
                  key={card._uid || i}
                  {...storyblokEditable(card)}
                  className="w-full h-full cursor-pointer"
                  href={`/team/${card.slug}/`}
                >
                  <LeadershipCard blok={card} />
                </a>
              ) : (
                <LeadershipCard blok={card} />
              )
            )}
          </div>
        ))}
      </div>

      {pagination?.totalPages && pagination.totalPages > 1 ? (
        <Pagination totalPages={pagination.totalPages} baseUrl={pathname} />
      ) : null}
    </div>
  );
};
