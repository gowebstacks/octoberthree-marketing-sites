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
  const [activeIndexes, setActiveIndexes] = useState<
    Record<number, number>
  >({});

  return (
    <div
      className="mx-auto flex max-w-360 flex-col gap-12 sm:gap-16"
      {...storyblokEditable(blok)}
      id={htmlId}
    >
      {rows?.map((row, rowIndex) => {
        const isTwoCards = row.cards?.length === 2;
        const activeIndex = activeIndexes[rowIndex] ?? 0;

        return (
          <div
            key={rowIndex}
            onMouseLeave={() =>
              setActiveIndexes((prev) => ({
                ...prev,
                [rowIndex]: 0,
              }))
            }
            className="flex w-full flex-col gap-4 overflow-hidden sm:flex-row"
          >
            {row.cards?.map((item, i) => {
              const key = (item as any)?._uid || (item as any)?._key || i;
              const isActive = i === activeIndex;

              return (
                <div
                  key={key}
                  onMouseEnter={() =>
                    setActiveIndexes((prev) => ({
                      ...prev,
                      [rowIndex]: i,
                    }))
                  }
                  className={twMerge(
                    "transition-flex duration-400 ease-in-out min-w-0 w-full",
                    isTwoCards
                      ? "sm:flex-1"
                      : isActive
                      ? "sm:flex-2"
                      : "sm:flex-1"
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