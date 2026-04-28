"use client";
import type { FC } from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { twMerge } from "tailwind-merge";

import Image, { ImageFragment } from "../../molecules/image";
import { usePathname } from "next/navigation";

export interface ImageBlok extends SbBlokData {
  image: ImageFragment;
  description?: string;
}

interface ImageProps {
  blok: ImageBlok;
  className?: string;
  patternVariant?: "sm" | "md" | "lg";
}

export const ImageWithDesc: FC<ImageProps> = ({
  blok,
  className,
  patternVariant,
}) => {
  if (!blok?.image?.asset?.url) return null;
  const pathname = usePathname();

  const resourcesRoute = ["/articles", "/insights", "/resources"].some(
    (route) => pathname.startsWith(route)
  );

  return (
    <div
      className={twMerge("w-full overflow-hidden max-w-360 mx-auto", className)}
    >
      <div className="relative w-full">
        <Image
          {...blok.image}
          aspectRatio="16/9"
          objectCover
          unsetMaxWidth
          className={twMerge(
            "w-full",
            resourcesRoute ? "[&>img]:object-contain h-auto aspect-auto!" : ""
          )}
          patternVariant={patternVariant}
          isSquarePattern={!resourcesRoute}
          noFill={resourcesRoute}
          width={100}
          height={100}
        />
      </div>

      {blok.description && (
        <p className="text-rich-image-caption text-(--text-body) mt-(--gaps-16-12-12)">
          {blok.description}
        </p>
      )}
    </div>
  );
};
