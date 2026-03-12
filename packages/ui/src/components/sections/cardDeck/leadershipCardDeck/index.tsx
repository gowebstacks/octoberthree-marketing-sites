"use client";

import type { FC } from "react";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";

import {
  ContentBlock,
  ContentBlockBlok,
  LeadershipCard,
  LeadershipCardBlok,
} from "../../../organisms";

interface LeadershipCardRow {
  cardsPerRow?: string;
  cards?: LeadershipCardBlok[];
}

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
  return (
 
      <div className="flex flex-col gap-12 sm:gap-16 mx-auto max-w-(--widths-1440-834-375)"  {...storyblokEditable(blok)}   id={htmlId}>
        {content?.length ? (
          <div className="flex flex-col gap-8">
            {content.map((nestedBlok) => (
              <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
            ))}
          </div>
        ) : null}

        {rows && (
          <div
            {...storyblokEditable(blok)}
            data-blok-field="rows"
            className="w-full"
          >
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`
    grid w-full justify-items-center
    gap-y-(--gaps-56-48-48)
    gap-x-(--gaps-16-12-12)
    grid-cols-1
    ${
      row.cardsPerRow === "3"
        ? "sm:grid-cols-3 lg:grid-cols-3"
        : row.cardsPerRow === "4"
          ? "sm:grid-cols-3 lg:grid-cols-4"
          : "sm:grid-cols-3 lg:grid-cols-2"
    }
  `}
              >
                {row.cards?.map((card, i) => (
                  <div
                    key={card._uid || i}
                    {...storyblokEditable(card)}
                    className="w-full h-full"
                  >
                    <LeadershipCard blok={card} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
  );
};
