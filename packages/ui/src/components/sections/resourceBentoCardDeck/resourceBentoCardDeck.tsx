"use client";

import type { FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";

import {
  ContentBlock,
  ContentBlockBlok,
  ResourceBentoCard,
} from "../../organisms";

export interface ResourceBentoCardDeckBlok extends SbBlokData {
  content?: ContentBlockBlok[];
  resources?: any[];
  htmlId?: string;
}

export const ResourceBentoCardDeck: FC<ResourceBentoCardDeckBlok> = ({
  content,
  resources = [],
  htmlId,
  ...blok
}) => {
  const [primary, ...secondary] = resources;

  return (
    <div
      {...storyblokEditable(blok)}
      id={htmlId}
      className="
         grid mx-auto max-w-(--widths-1440-834-375) grid-cols-1
          gap-(--gaps-56-48-48)
        "
    >
      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>
      ) : null}

      <div
        className="
          flex flex-col
            gap-8
            lg:flex-row
          "
      >
        {primary ? (
          <div className="flex-1">
            <ResourceBentoCard {...primary} size="md" />
          </div>
        ) : null}

        <div className="flex gap-8 flex-col flex-1">
          {secondary.slice(0, 3).map((resource) => (
            <ResourceBentoCard key={resource._id} {...resource} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
};
