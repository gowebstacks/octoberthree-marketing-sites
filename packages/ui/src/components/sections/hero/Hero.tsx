import type { FC } from "react";
import Image from "next/image";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import { twMerge } from "tailwind-merge";
import { ContentBlock, type ContentBlockBlok } from "../../organisms";
import { Video, type VideoBlok } from "../../modules";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";
import { StoryblokAsset } from "../../../lib";
export interface HeroBlok extends SbBlokData {
  body?: ContentBlockBlok[];
  heroImage?: { filename: string; alt?: string };
  video?: VideoBlok[];
  theme?: "primary" | "secondary" | "tertiary";
  pattern?: 'square';
  logoPopout?: StoryblokAsset;
  reverse?: boolean;
}
export const Hero: FC<{ blok: HeroBlok }> = ({ blok }) => {
  const hasImage = Boolean(blok.heroImage?.filename);
  const hasVideo = Boolean(blok.video?.length);
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
      
      {blok.pattern === 'square' && (
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
          hasImage || hasVideo ? "grid-cols-1 lg:grid-cols-[57%_43%]" : ""
        )}
      >
        
        <div
          className={twMerge(
            'z-12 relative',
            hasImage || hasVideo
              ? "px-4 py-12 sm:px-(--scale-80) sm:py-(--scale-72) lg:py-(--scale-96)"
              : "section-padding-xl sm:px-(--scale-80) sm:py-(--scale-120)",
            blok.reverse && "lg:order-2"
          )}
        >
          
          {blok.body?.map((nestedBlok) => (
            <ContentBlock
              key={nestedBlok._uid}
              blok={{
                ...nestedBlok,
                mode: blok.theme === "primary" ? "dark" : "light",
              }}
            />
          ))}
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
                  classname: "h-full min-h-full aspect-auto",
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
            {blok.logoPopout?.filename && (
              <div
                className={twMerge(
                  "absolute bottom-[15%] z-20 flex h-22.5 items-center overflow-hidden bg-(--surface-button) p-3 md:h-37.5",
                  blok.reverse
                    ? "left-px rounded-[0_999px_999px_0]"
                    : " rounded-[999px_0_0_999px]",
                  hasVideo ? "right-px" : "right-0"
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
        )}
      </div>
    </div>
  );
};
