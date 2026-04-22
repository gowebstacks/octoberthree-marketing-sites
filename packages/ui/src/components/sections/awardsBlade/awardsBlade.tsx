import Marquee from "react-fast-marquee";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import Image from "next/image";
import { storyblokEditable } from "@storyblok/react";

import type { FC } from "react";
import { RichText } from "../../molecules/richText/richText";
import { Heading } from "../../atoms";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";

interface StoryblokAward {
  _uid: string;
  image: {
    id: string;
    filename: string;
    alt?: string;
  };
  alt: string;
  title?: string;
  body?: any;
}

interface StoryblokAwardRow {
  _uid: string;
  cardsPerRow: string;
  awards: StoryblokAward[];
}

interface StoryblokAwardsBlade {
  _uid?: string;
  component: string;
  rows?: StoryblokAwardRow[];
  theme?: "light" | "dark" | "bright";
  variant?: "grid" | "scroll";
  inline?: boolean;
}

interface AwardImageProps {
  award: StoryblokAward;
  theme: "light" | "dark" | "bright";
  noPadding?: boolean;
}

const AwardImage: FC<AwardImageProps> = ({ award, theme, noPadding }) => {
  const isDarkTheme = theme === "dark" || theme === "bright";
  const hasContent = award.title || award.body;

  const filename = award.image.filename || "";
  const dimensionMatch = filename.match(/\/(\d+)x(\d+)\//);
  const width = dimensionMatch ? parseInt(dimensionMatch[1]) : 224;
  const height = dimensionMatch ? parseInt(dimensionMatch[2]) : 160;

  return (
    <div
      className={twMerge(
        "flex flex-col items-center",
        noPadding ? "" : "px-4 sm:px-8"
      )}
    >
      <div className="w-48 h-32 sm:w-56 sm:h-40 flex items-center justify-center">
        <Image
          loader={storyblokLoader}
          src={filename}
          alt={award.alt}
          width={width}
          height={height}
          className={twMerge(
            "max-h-full max-w-full object-contain",
            isDarkTheme && "invert brightness-0"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {hasContent && (
        <div className="text-center w-full">
          {award.title && (
            <Heading heading={award.title} headingSize="xl"></Heading>
          )}
          {award.body && (
            <div className="text-sm uppercase">
              <RichText
                className="text-(--text-eyebrow-date)!"
                doc={award.body}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AwardsBlade: FC<StoryblokAwardsBlade> = ({
  rows,
  theme = "light",
  variant = "grid",
  inline,
  ...blok
}) => {
  const allAwards = rows?.flatMap((row) => row.awards || []) || [];

  return (
    <div
      {...storyblokEditable(blok as any)}
      className="flex w-full flex-col gap-6 items-center max-w-(--widths-1440-834-375) mx-auto"
    >
      {rows &&
        (variant === "scroll" ? (
          <div
            {...{
              ...storyblokEditable(blok as any),
              "data-blok-field": "rows",
            }}
          >
            <Marquee autoFill speed={20} gradientWidth={200}>
              {allAwards.map((award, index) => (
                <div
                  key={award._uid || index}
                  {...storyblokEditable(award as any)}
                  className="inline-block"
                >
                  <AwardImage award={award} theme={theme} />
                </div>
              ))}
            </Marquee>
          </div>
        ) : (
          <div
            {...{
              ...storyblokEditable(blok as any),
              "data-blok-field": "rows",
            }}
            className={twMerge(
              "flex flex-col gap-8 w-full",
              inline ? "" : "max-w-7xl mx-auto"
            )}
          >
            {rows.map((row, rowIndex) => (
              <div key={row._uid || rowIndex} className="-mx-4">
                <div className="flex flex-wrap w-full justify-center gap-y-8">
                  {row.awards?.map((award, index) => (
                    <div
                      key={award._uid || index}
                      className={twMerge(
                        "w-full grow-0 shrink-0",

                        "md:w-1/2 md:basis-1/2",

                        row.cardsPerRow === "3" && "lg:w-1/3 lg:basis-1/3",
                        row.cardsPerRow === "4" && "lg:w-1/4 lg:basis-1/4",
                        row.cardsPerRow === "5" && "lg:w-1/5 lg:basis-1/5",
                        row.cardsPerRow === "6" && "lg:w-1/6 lg:basis-1/6"
                      )}
                    >
                      <div
                        {...storyblokEditable(award as any)}
                        className="w-full h-full"
                      >
                        <AwardImage award={award} theme={theme} noPadding />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
