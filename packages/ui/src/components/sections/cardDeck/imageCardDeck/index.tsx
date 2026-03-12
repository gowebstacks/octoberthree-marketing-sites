"use client";

import { storyblokEditable } from "@storyblok/react";
import type { FC } from "react";
import type { SbBlokData } from "@storyblok/react";

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
  return (
    <div
      className="flex flex-col gap-12 sm:gap-16 mx-auto max-w-(--widths-1440-834-375)"
      {...storyblokEditable(blok)}
      id={htmlId}
    >
      {content?.length ? (
        <div className="flex flex-col gap-8 ">
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
                  grid w-full gap-4 justify-items-center
                  grid-cols-1
                  ${
                    row.cardsPerRow === "3"
                      ? "sm:grid-cols-3 lg:grid-cols-3"
                      : row.cardsPerRow === "4"
                        ? "sm:grid-cols-2 lg:grid-cols-4"
                        : "sm:grid-cols-2 lg:grid-cols-2"
                  }
                `}
            >
              {row.cards?.map((item, i) => {
                const key = (item as any)?._uid || (item as any)?._key || i;

                return (
                  <div
                    key={key}
                    {...((item as any)?.component
                      ? storyblokEditable(item as any)
                      : {})}
                    className="w-full h-full"
                  >
                    <ImageTextCard {...(item as any)} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
