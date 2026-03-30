"use client";

import type { FC } from "react";
import { useMemo, useState } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { ContentBlock, LeadershipCard } from "../../../organisms";
import { Dropdown } from "../../../molecules";
import { Badge, Heading } from "../../../atoms";
import { buildRelMap } from "../../../../utils";

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
}

const getGridClass = (desktop?: string, tablet?: string, mobile?: string) => {
  const m = mobile === "2" ? "grid-cols-2" : mobile === "3" ? "grid-cols-3" : mobile === "4" ? "grid-cols-4" : "grid-cols-1";
  const t = tablet === "2" ? "sm:grid-cols-2" : tablet === "3" ? "sm:grid-cols-3" : tablet === "4" ? "sm:grid-cols-4" : "sm:grid-cols-3";
  const d = desktop === "2" ? "lg:grid-cols-2" : desktop === "3" ? "lg:grid-cols-3" : desktop === "4" ? "lg:grid-cols-4" : "lg:grid-cols-4";
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
    ?.body?.content
    ?.find((node: any) => node.type === "blok")
    ?.attrs?.body
    ?.find((blok: any) => blok.component === "authorCard");
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
  ...blok
}) => {
  const [teams, setTeams] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);

  const relMap = useMemo(() => buildRelMap(rels), [rels]);

  const allCards = useMemo(() => {
    if (!rows) return [];
    return rows.flatMap((row) => 
      (row.cards ?? []).flatMap((card) => resolveRelatedBios(card, relMap))
    );
  }, [rows, relMap]);

  const teamOptions = useMemo(() => 
    [...new Set(allCards.flatMap((c) => extractCardContent(c).team))].map((t) => ({ label: t, value: t })),
    [allCards]
  );

  const locationOptions = useMemo(() => 
    [...new Set(allCards.map((c) => extractCardContent(c).location).filter(Boolean))].map((l) => ({ label: l!, value: l! })),
    [allCards]
  );

  const filteredByTeamLocation = useMemo(() => 
    allCards.filter((card) => {
      const { team, location } = extractCardContent(card);
      return (!teams.length || teams.some((t) => team.includes(t))) &&
             (!locations.length || locations.includes(location ?? ""));
    }),
    [allCards, teams, locations]
  );

  const nameOptions = useMemo(() => 
    [...new Set(filteredByTeamLocation.map((c) => extractCardContent(c).name).filter(Boolean))].map((n) => ({ label: n!, value: n! })),
    [filteredByTeamLocation]
  );

  const filteredCards = useMemo(() => 
    filteredByTeamLocation.filter((card) => 
      !names.length || names.includes(extractCardContent(card).name ?? "")
    ),
    [filteredByTeamLocation, names]
  );

  const groupedFilteredRows = useMemo(() => {
    if (!rows) return [];
    const filteredUids = new Set(filteredCards.map((c) => c._uid));
    
    return rows
      .map((row) => {
        const expandedCards = (row.cards ?? []).flatMap((card) => resolveRelatedBios(card, relMap));
        const filteredRowCards = expandedCards.filter((card) => filteredUids.has(card._uid));
        return { ...row, cards: filteredRowCards };
      })
      .filter((row) => row.cards.length > 0);
  }, [rows, filteredCards, relMap]);
const hasRelatedBios = useMemo(() => {
  if (!rows) return false;

  return rows.some((row) =>
    (row.cards || []).some((card) => card.component === "relatedBios")
  );
}, [rows]);
  console.log(allCards,"leadership",rels);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 mx-auto max-w-360" {...storyblokEditable(blok)} id={htmlId}>
     
     {
      hasRelatedBios && (
       <Heading as={'h3'} size={'4xl'}>Related People</Heading>
      )
     }
     {
      filterable && 
       <div className="border border-(--stroke-secondary) p-4 sm:px-8 sm:py-4.5 lg:py-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Dropdown label="Select a Team" multiple value={teams} onChange={(v) => setTeams(v as string[])} options={teamOptions} placeholder="All" />
          <Dropdown label="Location" multiple value={locations} onChange={(v) => setLocations(v as string[])} options={locationOptions} placeholder="All" />
          <Dropdown label="Search by Name" multiple value={names} onChange={(v) => setNames(v as string[])} options={nameOptions} placeholder="Search" />
        </div>
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => <Badge key={team} label={team} onRemove={() => setTeams((p) => p.filter((t) => t !== team))} />)}
          {locations.map((loc) => <Badge key={loc} label={loc} onRemove={() => setLocations((p) => p.filter((l) => l !== loc))} />)}
          {names.map((name) => <Badge key={name} label={name} onRemove={() => setNames((p) => p.filter((n) => n !== name))} />)}
        </div>
      </div>
     }

      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />)}
        </div>
      ) : null}

      <div className="flex flex-col gap-y-(--gaps-56-48-48)">
        {groupedFilteredRows.map((row, rowIndex) => (
          <div key={rowIndex} className={`grid w-full gap-y-(--gaps-56-48-48) gap-x-(--gaps-16-12-12) ${getGridClass(row.cardsPerRow, row.cardsPerRowTablet, row.cardsPerRowMobile)}`}>
            {row.cards?.map((card, i) => (
              <a key={card._uid || i} {...storyblokEditable(card)} className="w-full h-full cursor-pointer" href={`/team/${card.slug}`}>
                <LeadershipCard blok={card} />
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};