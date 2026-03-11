"use client";

import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { RichText } from "../../molecules/richText/richText";
import { twMerge } from "tailwind-merge";
import { Eyebrow, Heading, type EyebrowBlockProps } from "../../atoms";
import type { RichTextContent } from "../../../types/storyblok";
import CTABar, { CTABarProps } from "../../modules/ctaBar";
import { HeadingBlok } from "../../atoms/heading";

export interface ContentBlockBlok extends SbBlokData {
  eyebrow?: EyebrowBlockProps[];
  heading?: HeadingBlok[];
  body?: RichTextContent;
  ctaBar?: CTABarProps[];
  layout?: "stacked" | "leading" | "split";
}

interface ContentBlockProps {
  blok: ContentBlockBlok;
}

export function ContentBlock({ blok }: ContentBlockProps) {
  const {
    eyebrow,
    heading,
    body,
    ctaBar,
    layout = "stacked",
  } = blok;

  const layoutClasses = {
    stacked: "mx-auto text-center",
    leading: "",
    split: "grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center",
  };
  return (
    <div {...storyblokEditable(blok)}>
      <div
        className={twMerge(
          layoutClasses[layout],
          "max-w-(--widths-1280-704-343)"
        )}
      >
        <div>
          {eyebrow?.length ? <Eyebrow {...eyebrow[0]} /> : null}

          {heading?.length && (
            <Heading
              blok={heading[0]}
              className={
                twMerge(
                  "mb-4 lg:max-w-200",
                  layout === 'stacked' && 'mx-auto',
                )
              }
            />
          )}

        </div>

        <div>

          {body && (
            <RichText
              doc={body}
              className={twMerge(
                layout === "stacked" &&
                  "[&_ul]:w-fit [&_ul]:mx-auto [&_ul]:pl-0 max-w-150 mx-auto"
              )}
            />
          )}

          {ctaBar?.map((cta) => (
            <CTABar
              key={cta._uid}
              blok={cta}
              className={`${layout === "stacked" && "w-fit m-auto"} mt-8`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
