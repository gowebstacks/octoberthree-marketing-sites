"use client";

import type { FC } from "react";
import { useMemo, useState } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";

import {
  ContentBlock,
  ContentBlockBlok,
  LeadershipCard,
  LeadershipCardBlok,
} from "../../../organisms";
import { Dropdown } from "../../../molecules";
import { Badge } from "../../../atoms";

interface LeadershipCardRow {
  cardsPerRow?: string;
  cards?: LeadershipCardBlok[];
}

type CardContent = {
  name?: string;
  location?: string;
  team?: string[];
};

export interface LeadershipCardDeckBlok extends SbBlokData {
  content?: ContentBlockBlok[];
  rows?: LeadershipCardRow[];
  htmlId?: string;
}

export const LeadershipCardDeck: FC<LeadershipCardDeckBlok> = ({
  content,
  rows,
  htmlId,
  ...blok
}) => {
  const [teams, setTeams] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);

  const cards = useMemo(
    () => rows?.flatMap((row) => row.cards ?? []) ?? [],
    [rows]
  );
  const getContent = (card: LeadershipCardBlok) =>
    card as LeadershipCardBlok & CardContent;

  const teamOptions = useMemo(
    () =>
      [...new Set(cards.flatMap((card) => getContent(card).team ?? []))].map(
        (team) => ({
          label: team,
          value: team,
        })
      ),
    [cards]
  );

  const locationOptions = useMemo(
    () =>
      [
        ...new Set(
          cards.map((card) => getContent(card).location).filter(Boolean)
        ),
      ].map((location) => ({ label: location!, value: location! })),
    [cards]
  );

  const filteredByTeamLocation = useMemo(
    () =>
      cards.filter((card) => {
        const { team = [], location } = getContent(card);
        return (
          (!teams.length || teams.some((t) => team.includes(t))) &&
          (!locations.length || locations.includes(location ?? ""))
        );
      }),
    [cards, teams, locations]
  );

  const nameOptions = useMemo(
    () =>
      [
        ...new Set(
          filteredByTeamLocation
            .map((card) => getContent(card).name)
            .filter(Boolean)
        ),
      ].map((name) => ({ label: name!, value: name! })),
    [filteredByTeamLocation]
  );

  const filteredCards = useMemo(
    () =>
      filteredByTeamLocation.filter(
        (card) => !names.length || names.includes(getContent(card).name ?? "")
      ),
    [filteredByTeamLocation, names]
  );

  return (
    <div
      className="flex flex-col gap-12 sm:gap-16 mx-auto max-w-(--widths-1440-834-375)"
      {...storyblokEditable(blok)}
      id={htmlId}
    >
      <div className="border border-(--stroke-secondary) p-4 sm:px-8 sm:py-4.5 lg:py-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <Dropdown
            label="Select a Team"
            multiple
            value={teams}
            onChange={(v) => setTeams(v as string[])}
            options={teamOptions}
            placeholder="All"
          />
          <Dropdown
            label="Location"
            multiple
            value={locations}
            onChange={(v) => setLocations(v as string[])}
            options={locationOptions}
            placeholder="All"
          />
          <Dropdown
            label="Search by Name"
            multiple
            value={names}
            onChange={(v) => setNames(v as string[])}
            options={nameOptions}
            placeholder="Search"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <Badge
              key={team}
              label={team}
              onRemove={() =>
                setTeams((prev) => prev.filter((t) => t !== team))
              }
            />
          ))}
          {locations.map((location) => (
            <Badge
              key={location}
              label={location}
              onRemove={() =>
                setLocations((prev) => prev.filter((l) => l !== location))
              }
            />
          ))}
          {names.map((name) => (
            <Badge
              key={name}
              label={name}
              onRemove={() =>
                setNames((prev) => prev.filter((n) => n !== name))
              }
            />
          ))}
        </div>
      </div>

      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>
      ) : null}

      <div className="grid w-full gap-y-(--gaps-56-48-48) gap-x-(--gaps-16-12-12) grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
        {filteredCards.map((card, i) => (
          <div
            key={card._uid || i}
            {...storyblokEditable(card)}
            className="w-full h-full"
          >
            <LeadershipCard blok={card} />
          </div>
        ))}
      </div>
    </div>
  );
};
