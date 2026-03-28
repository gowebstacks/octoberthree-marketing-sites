import type { FC } from "react";
import { SbBlokData, storyblokEditable } from "@storyblok/react";
import { ContentBlock } from "../../organisms/contentBlock";
import { CTABarProps } from "../../modules/ctaBar";
import { EyebrowBlockProps } from "../../atoms";
import { HeadingBlok } from "../../atoms/heading";
import { twMerge } from "tailwind-merge";

export interface HeadingBlockSectionProps extends SbBlokData {
  eyebrow?: EyebrowBlockProps[];
  heading?: HeadingBlok[];
  body?: any;
  variant?: "centered" | "leading" | "split";
  ctaBar :  CTABarProps[]
}

export const HeadingBlock: FC<HeadingBlockSectionProps> = ({
  eyebrow,
  heading,
  body,
  variant = "centered",
  ctaBar,
  ...blok
}) => {
  return (
    <div {...storyblokEditable(blok)} className={
      twMerge(
        "mx-auto",
        variant === "centered" ? " md:max-w-200" : "max-w-360"
      )
    }>
      <ContentBlock
        blok={{
          eyebrow,
          heading: heading,
          body: body,
          ctaBar : ctaBar,
          layout: variant === "centered" ? "stacked" : variant,
        }}
      />
    </div>
  );
};
