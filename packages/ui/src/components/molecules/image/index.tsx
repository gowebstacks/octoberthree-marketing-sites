import NextImage from "next/image";
import { twJoin, twMerge } from "tailwind-merge";

import type { ImageProps as NextImageProps } from "next/image";
import type { FC } from "react";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";

export type ImageFragment = {
  _type?: string;
  alt?: string;
  asset?: {
    _id?: string;
    _ref?: string;
    _type?: "reference";
    url?: string;
    metadata?: {
      dimensions?: {
        aspectRatio?: number;
        height?: number;
        width?: number;
      };
      lqip?: string;
      blurHash?: string;
    };
  };
  caption?: string;
};
export interface ImageProps
  extends
    ImageFragment,
    Pick<
      NextImageProps,
      "height" | "width" | "className" | "priority" | "sizes"
    > {
  /**
   * The `aspectRatio` prop allows you to specify the aspect ratio of the image. The aspect ratio should be provided as a string in the format `"${number}/${number}"`, where the two numbers represent the width and height of the image, respectively.
   */
  aspectRatio?: `${number}/${number}`;
  /**
   * Determines whether the aspect ratio of the image should be unset, allowing the image to fill the container.
   */
  unsetRatio?: boolean;
  /**
   * Determines whether the image should override the default fill behavior and maintain its original aspect ratio.
   */
  noFill?: boolean;
  /**
   * Sets the object-fit property of the image to "cover".
   */
  objectCover?: boolean;
  /**
   * Sets the object-fit property of the image to "contain".
   */
  objectContain?: boolean;
  /**
   * Determines whether the image should have its maximum width unset, allowing it to fill the container.
   */
  unsetMaxWidth?: boolean;

  patternVariant?: "sm" | "md" | "lg";

  isSquarePattern?: boolean;

  patternColor?: "primary" | "secondary" | "tertiary";
}

const Image: FC<ImageProps> = ({
  asset,
  aspectRatio,
  alt,
  caption,
  noFill,
  height,
  width,
  objectCover,
  objectContain,
  className,
  unsetRatio,
  sizes,
  unsetMaxWidth,
  patternVariant,
  isSquarePattern = true,
  patternColor = "secondary",
  ...props
}) => {
  const imgWidth = width || asset?.metadata?.dimensions?.width,
    imgHeight = height || asset?.metadata?.dimensions?.height;

    const patternColorClass = {
      primary: "pattern-primary",
      secondary: "pattern-secondary",
      tertiary: "pattern-tertiary",
    }[patternColor || "secondary"];

  return (
    asset?.url && (
      <picture
        className={twMerge("relative block", className, 'rounded-sm overflow-hidden',)}
        style={{
          aspectRatio: unsetRatio
            ? undefined
            : aspectRatio ||
              asset?.metadata?.dimensions?.aspectRatio ||
              `${width}/${height}`,
        }}
      >
        {isSquarePattern && (
          <div
            className={twMerge(
              patternColorClass,
              patternVariant === "sm"
                ? "pattern-triangle-sm"
                : patternVariant === "md"
                  ? "pattern-triangle-md"
                  : "pattern-triangle"
            )}
          ></div>
        )}
        <NextImage
          loader={storyblokLoader}
          src={asset?.url}
          alt={alt || ""}
          title={caption || ""}
          fill={!noFill}
          width={noFill ? imgWidth : undefined}
          height={noFill ? imgHeight : undefined}
          placeholder={asset?.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={asset?.metadata?.lqip ?? undefined}
          className={twJoin(
            objectCover && "size-full object-cover",
            objectContain && "object-contain"
          )}
          sizes={sizes || "(max-width: 64em) 100vw, 1280px"}
          {...props}
        />
      </picture>
    )
  );
};

export default Image;
