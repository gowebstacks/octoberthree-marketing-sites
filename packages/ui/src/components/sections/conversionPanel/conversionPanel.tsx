import type { FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import {
  ContentBlock,
  type ContentBlockBlok,
} from "../../organisms/contentBlock";
import { twMerge } from "tailwind-merge";
import { StoryblokAsset } from "../../../lib";

export interface ConversionPanelProps extends SbBlokData {
  component?: "conversionPanel";
  body?: ContentBlockBlok[];
  variant?: "light" | "dark";
  pattern?: 'square';
  backgroundImage?: StoryblokAsset;
  showBackgroundStrip?: boolean;
  fullWidth?: boolean;
}

export const ConversionPanel: FC<{ blok: ConversionPanelProps }> = ({
  blok,
}) => {
  const { body, variant, pattern, backgroundImage, showBackgroundStrip, fullWidth = false } =
    blok;
console.log(pattern, "conversion panel")
  return (
    <div
      className={twMerge(
        "relative",
        fullWidth && 'bg-(--color-cream-100)',
        backgroundImage ? "section-padding-xl" : "section-padding-xl-left-right"
      )}
    >
      <div
        {...storyblokEditable(blok)}
        className={twMerge(
          "z-2 relative overflow-hidden w-full mx-auto max-w-360 rounded-md flex flex-col md:items-center text-center",
          variant === "dark" || backgroundImage?.filename
            ? "bg-(--surface-accent-background) [&_*:not(button):not(button_*)]:text-white! section-padding-xl-top-bottom md:px-12 px-4"
            : "bg-(--surface-background)",
             fullWidth && 'bg-(--color-cream-100)',
        )}
        style={
          backgroundImage?.filename
            ? {
                backgroundImage: `url(${backgroundImage.filename})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {backgroundImage?.filename && (
          <div className="absolute inset-0 bg-black/60" />
        )}
        {(pattern === 'square' || pattern) && (
          <div className="pattern-grid pattern-white opacity-10" />
        )}
        <div className="relative z-10">
          {body?.[0] && <ContentBlock blok={body[0]} />}
        </div>
      </div>
      {showBackgroundStrip && (
        <div className="absolute inset-x-0 z-1 bottom-0 h-1/2 bg-(--surface-accent-background)" />
      )}
    </div>
  );
};
