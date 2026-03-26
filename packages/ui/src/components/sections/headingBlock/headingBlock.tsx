import type { FC } from "react";
import { SbBlokData, storyblokEditable } from "@storyblok/react";
import { ContentBlock } from "../../organisms/contentBlock";

interface HeadingBlockSectionProps extends SbBlokData {
  eyebrow?: any[];
  heading?: any[];
  body?: any;
  variant?: "centered" | "leading" | "split";
}

export const HeadingBlock: FC<HeadingBlockSectionProps> = ({
  eyebrow,
  heading,
  body,
  variant = "centered",
  ...blok
}) => {
  return (
    <div {...storyblokEditable(blok)} className="mx-auto md:max-w-200">
      <ContentBlock
        blok={{
          eyebrow,
          heading: heading,
          body: body,
          layout: variant === "centered" ? "stacked" : variant,
        }}
      />
    </div>
  );
};
