"use client";

import type { FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { twMerge } from "tailwind-merge";

import { Heading } from "../../atoms/heading";
import { Eyebrow } from "../../atoms";
import type { HeadingProps } from "../../atoms/heading";
import type { EyebrowBlockProps } from "../../atoms";
import CTABar, { CTABarProps } from "../../modules/ctaBar";
import { RichText } from "../../molecules/richText/richText";
import type { RichTextContent } from "../../../types/storyblok";

export interface SubscribeProps extends SbBlokData {
  component?: "subscribe";
  eyebrow?: EyebrowBlockProps[];
  heading?: HeadingProps[];
  body?: string;
  ctaBar?: CTABarProps[];
  consentText?: RichTextContent;
  pattern?: "square";
  layout?: "split" | "leading" | "stacked";
  size?: "sm" | "default";
  rtc: boolean;
}

export const Subscribe: FC<{ blok: SubscribeProps }> = ({ blok }) => {
  const {
    eyebrow,
    heading,
    body,
    ctaBar,
    consentText,
    pattern,
    layout = "stacked",
    size = "default",
    rtc = true,
  } = blok;

  const layoutClasses = {
    stacked: "mx-auto text-center",
    leading: "",
    split: "flex flex-col sm:gap-10 md:flex-row  md:justify-between",
  };

  return (
    <div
      className={twMerge(
        rtc && 'lg:hidden',
        "bg-(--surface-accent-background) relative",
        size === "sm" ? "p-6" : "p-6 md:p-8 "
      )}
    >
      <div
        {...storyblokEditable(blok)}
        className={twMerge(
          "overflow-hidden w-full mx-auto max-w-360",
          layoutClasses[layout],
          "bg-(--surface-accent-background) [&_*:not(button):not(button_*):not(a):not(a_*)]:text-white!"
        )}
      >
        {pattern === "square" && (
          <div className="absolute inset-0 pattern-grid pattern-white opacity-10" />
        )}

        <div
          className={twMerge(
            "relative z-10 w-full",
            layout === "split" && "flex-1"
          )}
        >
          <div className="flex flex-col gap-(--gaps-16-12-12)">
            {eyebrow?.length ? (
              <Eyebrow
                {...eyebrow[0]}
                className={twMerge(
                  layout === "stacked" && "mx-auto",
                  "text-(--text-eyebrow-light)"
                )}
              />
            ) : null}

            {heading?.length ? (
              <Heading
                {...heading[0]}
                className={twMerge(
                  "lg:max-w-200",
                  layout === "stacked" && "mx-auto",
                  "text-(--text-headings-light)"
                )}
              />
            ) : null}
          </div>

          {body && (
            <p
              className={twMerge(
                "text-lg max-w-200 mt-(--gaps-16-12-12) text-(--text-body-light)",
                layout === "stacked" && "max-w-150 mx-auto"
              )}
            >
              {body}
            </p>
          )}
        </div>

        <div
          className={twMerge(
            layout === "split" && "flex-1",
            layout !== "split" && "w-full"
          )}
        >
          {ctaBar?.map((cta) => (
            <CTABar
              key={cta._uid}
              blok={cta}
              layout={size === "sm" ? "split" : layout}
              className={twMerge(
                layout === "stacked" && "sm:w-fit m-auto",
                layout === "split" && "w-full",
                "mt-(--gaps-32-24-24)"
              )}
            />
          ))}

          {consentText && (
            <RichText
              doc={consentText}
              className={twMerge(
                "mt-(--gaps-16-12-12)",
                layout === "stacked" && "text-center"
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
