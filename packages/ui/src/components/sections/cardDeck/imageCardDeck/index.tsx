"use client";

import { storyblokEditable } from "@storyblok/react";
import type { FC } from "react";
import type { SbBlokData } from "@storyblok/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { ImageTextCard, ImageTextCardProps } from "../../../molecules";

interface ImageCardRow {
  cardsPerRow?: string;
  cards?: ImageTextCardProps[];
}

export interface ImageCardDeckProps extends SbBlokData {
  rows?: ImageCardRow[];
  htmlId?: string;
}

export const ImageCardDeck: FC<ImageCardDeckProps> = ({
  rows,
  htmlId,
  ...blok
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="mx-auto flex max-w-360 flex-col gap-12 sm:gap-16"
      {...storyblokEditable(blok)}
      id={htmlId}
    >

      {rows?.map((row, rowIndex) => {
        const isTwoCards = row.cards?.length === 2;

        return (
          <div
            key={rowIndex}
            onMouseLeave={() => setActiveIndex(0)}
            className="flex flex-col sm:flex-row w-full gap-4 overflow-hidden"
          >
            {row.cards?.map((item, i) => {
              const key = (item as any)?._uid || (item as any)?._key || i;
              const isActive = i === activeIndex;

              return (
                <div
                  key={key}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={twMerge(
                    "transition-flex duration-400  ease-in-out min-w-0 w-full",
                    isTwoCards
                      ? "sm:flex-1"
                      : isActive
                      ? "sm:flex-2"
                      : "sm:flex-1"
                  )}
                >
                  <ImageTextCard {...(item as any)} isActive={isActive} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};