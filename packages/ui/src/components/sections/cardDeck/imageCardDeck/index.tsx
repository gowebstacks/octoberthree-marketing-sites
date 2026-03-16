"use client";

import { storyblokEditable } from "@storyblok/react";
import type { FC } from "react";
import type { SbBlokData } from "@storyblok/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { ImageTextCard, ImageTextCardProps } from "../../../molecules";
import { ContentBlock, ContentBlockBlok } from "../../../organisms";

interface ImageCardRow {
  cardsPerRow?: string;
  cards?: ImageTextCardProps[];
}

export interface ImageCardDeckProps extends SbBlokData {
  content?: ContentBlockBlok[];
  rows?: ImageCardRow[];
  htmlId?: string;
}

export const ImageCardDeck: FC<ImageCardDeckProps> = ({
  content,
  rows,
  htmlId,
  ...blok
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="mx-auto flex max-w-(--widths-1440-834-375) flex-col gap-12 sm:gap-16"
      {...storyblokEditable(blok)}
      id={htmlId}
    >
      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>
      ) : null}

    {rows?.map((row, rowIndex) => {
  const isTwoCards = row.cards?.length === 2;

  return (
    <div
      key={rowIndex}
      onMouseLeave={() => setActiveIndex(0)}
      className="flex w-full gap-4 overflow-hidden"
    >
      {row.cards?.map((item, i) => {
        const key = (item as any)?._uid || (item as any)?._key || i;
        const isActive = i === activeIndex;

        return (
          <div
            key={key}
            onMouseEnter={() => setActiveIndex(i)}
            className={twMerge(
              "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) min-w-0",
              isTwoCards ? "flex-1" : isActive ? "flex-[2]" : "flex-1"
            )}
          >
            <ImageTextCard
              {...(item as any)}
              isActive={isActive}
            />
          </div>
        );
      })}
    </div>
  );
})}
    </div>
  );
};