"use client";

import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { RichText } from "../../molecules/richText/richText";
import { twMerge } from "tailwind-merge";
import {
  Badge,
  BadgeProps,
  Eyebrow,
  Heading,
  type EyebrowBlockProps,
} from "../../atoms";
import type { RichTextContent } from "../../../types/storyblok";
import CTABar, { CTABarProps } from "../../modules/ctaBar";
import { HeadingBlok } from "../../atoms/heading";

export interface ContentBlockBlok extends SbBlokData {
  badge?: BadgeProps[];
  eyebrow?: EyebrowBlockProps[];
  heading?: HeadingBlok[];
  body?: RichTextContent;
  ctaBar?: CTABarProps[];
  layout?: "stacked" | "leading" | "split";
  mode?: "light" | "dark";
}

interface ContentBlockProps {
  blok: ContentBlockBlok;
}

export function ContentBlock({ blok }: ContentBlockProps) {
  const {
    badge,
    eyebrow,
    heading,
    body,
    ctaBar,
    layout = "stacked",
    mode = "light",
  } = blok;

  const layoutClasses = {
    stacked: "mx-auto text-center",
    leading: "",
    split: "grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center",
  };

  return (
    <div {...storyblokEditable(blok)}>
      <div className={twMerge(layoutClasses[layout], "max-w-360")}>
        <div className="flex flex-col gap-(--gaps-16-12-12)">
          {!badge?.length && !eyebrow?.length && !heading?.length && (
            <div
              className={twMerge(
                "flex gap-2.5 items-center",
                layout === "stacked" ? "justify-center" : ""
              )}
            >
              {badge?.length ? <Badge {...badge[0]} /> : null}
              {eyebrow?.length ? (
                <Eyebrow
                  {...eyebrow[0]}
                  className={twMerge(
                    mode === "dark" && "text-(--text-eyebrow-light)"
                  )}
                />
              ) : null}
            </div>
          )}
          {!!heading?.length && (
            <Heading
              blok={heading[0]}
              className={twMerge(
                "mb-(--gaps-16-12-12) lg:max-w-200",
                layout === "stacked" && "mx-auto",
                mode === "dark" && "text-(--text-headings-light)"
              )}
            />
          )}
        </div>

        <div>
          {body && (
            <RichText
              doc={body}
              className={twMerge(
                layout === "stacked" &&
                  `[&_ul]:w-fit [&_ul]:mx-auto [&_ul]:pl-0 max-w-150 mx-auto **:data-[blok-c*="ctaBar"]:mx-auto`,
                mode === "dark" && "text-(--text-body-light)!"
              )}
            />
          )}

          {ctaBar?.map((cta) => (
            <CTABar
              key={cta._uid}
              blok={cta}
              className={twMerge(
                layout === "stacked" && "sm:w-fit m-auto",
                "mt-(--gaps-32-24-24)"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
