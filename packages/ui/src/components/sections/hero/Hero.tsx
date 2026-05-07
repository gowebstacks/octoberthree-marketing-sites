"use client";
import { useEffect, useState, type FC } from "react";
import Image from "next/image";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { twMerge } from "tailwind-merge";
import { ContentBlock, type ContentBlockBlok } from "../../organisms";
import { Video, type VideoBlok } from "../../modules";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";
import { StoryblokAsset } from "../../../lib";
import { buildRelMap, resolveRel, StoryblokRel } from "../../../utils";
export interface HeroBlok extends SbBlokData {
  body?: ContentBlockBlok[];
  heroImage?: { filename: string; alt?: string };
  video?: VideoBlok[];
  theme?: "primary" | "secondary" | "tertiary";
  pattern?: "square";
  logoPopout?: StoryblokAsset;
  reverse?: boolean;
}
export const Hero: FC<{
  blok: HeroBlok;
  rels?: StoryblokRel[];
  tags?: any;
  topics?: any;
}> = ({ blok, rels = [], tags, topics }) => {
  const hasImage = Boolean(blok.heroImage?.filename);
  const hasVideo = Boolean(blok.video?.length);
  const [animate, setAnimate] = useState(false);
  const relMap = buildRelMap(rels);

  const resolvedTags = tags
    ?.map((tag: any) => resolveRel(tag, relMap))
    .filter(Boolean);

  const resolvedTopics = topics
    ?.map((topic: any) => resolveRel(topic, relMap))
    .filter(Boolean);

  useEffect(() => {
    setAnimate(true);
  }, []);
  const themeClasses = {
    primary: "bg-[var(--surface-accent-background)]",
    secondary: "bg-[var(--surface-icon-card)]",
    tertiary: "bg-[var(--illustration-secondary)]",
  };
  return (
    <div
      className={twMerge(
        "relative mx-auto max-w-360 rounded-sm overflow-hidden",
        themeClasses[blok.theme ?? "primary"]
      )}
      {...storyblokEditable(blok)}
    >
      {blok.pattern === "square" && (
        <div
          className={twMerge(
            "pattern-grid pattern-white",
            blok.theme === "primary" ? "opacity-10" : "opacity-20"
          )}
        />
      )}
      <div
        className={twMerge(
          "relative  mx-auto grid items-center",
          hasImage || hasVideo ? "grid-cols-1 lg:grid-cols-[57%_43%] " : ""
        )}
      >
        <div
          className={twMerge(
            "z-12 relative",
            hasImage || hasVideo
              ? "px-4 py-12 sm:px-11.5 lg:px-14 sm:py-(--scale-72) lg:py-(--scale-96)"
              : "section-padding-xl sm:px-(--scale-80) sm:py-(--scale-120)",
            blok.reverse && "lg:order-2"
          )}
        >
          <div
            className={
              blok?.logoPopout?.filename && "pb-20 sm:pb-0 sm:pr-20 lg:pr-0"
            }
          >
            {blok.body?.map((nestedBlok) => (
              <ContentBlock
                key={nestedBlok._uid}
                blok={{
                  ...nestedBlok,
                  mode: blok.theme === "primary" ? "dark" : "light",
                  badge: resolvedTags?.[0]
                    ? [
                        {
                          label: resolvedTags[0].tagName,
                        },
                      ]
                    : [],
                }}
              />
            ))}
          </div>
        </div>
        {(hasVideo || hasImage) && (
          <div
            className={twMerge(
              "relative h-full w-full overflow-hidden aspect-4/3",
              blok.reverse && "lg:order-1"
            )}
          >
            {hasVideo ? (
              <Video
                blok={{
                  ...blok.video![0],
                  classname: twMerge(
                    "h-full min-h-full aspect-auto rounded-none",
                    (hasImage || hasVideo) &&
                      "rounded-b-[4px] lg:rounded-b-none lg:rounded-r-[4px]"
                  ),
                }}
              />
            ) : (
              <Image
                loader={storyblokLoader}
                src={blok.heroImage!.filename}
                alt={blok.heroImage!.alt ?? ""}
                fill
                className="object-cover object-[23%]"
              />
            )}
          </div>
        )}

        {blok.logoPopout?.filename && (
          <div
            className={twMerge(
              "absolute bottom-[5%] w-fit sm:bottom-[15%] z-20 flex h-22.5 items-center overflow-hidden bg-(--surface-button) p-3 md:h-37.5",
              blok.reverse
                ? "left-px rounded-[0_999px_999px_0]"
                : " rounded-[999px_0_0_999px]",
              hasVideo ? "right-px" : "right-0",
              animate ? "translate-x-0" : "translate-x-full",
              "transition-transform duration-700 ease-out"
            )}
          >
            <div className="absolute inset-0 bg-[linear-gradient(-80deg,var(--illustration-primary)_0%,transparent_15%)] opacity-50" />
            <Image
              loader={storyblokLoader}
              src={blok.logoPopout.filename}
              alt={blok.logoPopout.alt ?? ""}
              width={72}
              height={72}
              className="relative z-12 h-full w-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};
