import { twMerge } from "tailwind-merge";

import type {
  ComponentPropsWithoutRef,
  ElementType,
  FC,
  ReactNode,
} from "react";
import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";
import { getBackgroundImagePositionClass } from "../../../utils/getBgImagePositionClass";

type PaddingVariants = {
  top?:
    | 0
    | 2
    | 4
    | 6
    | 8
    | 12
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 44
    | 48
    | 56
    | 64
    | 72
    | 80
    | 96
    | 112
    | 128
    | 144
    | 160
    | 176
    | 192;
  bottom?:
    | 0
    | 2
    | 4
    | 6
    | 8
    | 12
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 44
    | 48
    | 56
    | 64
    | 72
    | 80
    | 96
    | 112
    | 128
    | 144
    | 160
    | 176
    | 192;
};
interface ResponsivePadding {
  default?: PaddingVariants;
  sm?: PaddingVariants;
  md?: PaddingVariants;
  lg?: PaddingVariants;
  xl?: PaddingVariants;
  xxl?: PaddingVariants;
}

type PaddingProps = keyof ResponsivePadding;
type ThemeProps = "light" | "dark" | "sugar" | "bright";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /**
   * An optional alternative HTML element type to render the section with.
   */
  as?: ElementType;
  /**
   * A unique identifier for the section.
   */
  id?: string;
  /**
   * Theme for the section - light, dark, or sugar
   */
  theme?: ThemeProps;
  prevTheme?: ThemeProps;
  nextTheme?: ThemeProps;
  responsivePadding?: ResponsivePadding;
  /**
   * Background gradient for the section
   */
  bgGradient?: string;
  /**
   * Whether to use inverse gradient
   */
  inverseGradient?: boolean;
  /**
   * Optional background image
   */
  backgroundImage?: any;
  backgroundImagePosition?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  /**
   * Minimum height for the section
   */
  minHeight?: "none" | "sm" | "md" | "lg";
  /**
   * The content to be rendered inside the section.
   */
  children: ReactNode;
  isFirstSection?: boolean;
  sectionType?: string;
  gradient?: string;
}

export const Section: FC<SectionProps> = ({
  as,
  id,
  children,
  responsivePadding,
  theme = "light",
  prevTheme,
  nextTheme,
  bgGradient,
  inverseGradient,
  backgroundImage,
  backgroundImagePosition='center',
  minHeight,
  className,
  isFirstSection,
  sectionType,

  ...rest
}) => {
  const Component = as || "section";

  const getMinHeightClass = () => {
    switch (minHeight) {
      case "sm":
        return "min-h-96"; // 384px / 24rem
      case "md":
        return "min-h-[32rem]"; // 512px / 32rem
      case "lg":
        return "min-h-[40rem]"; // 640px / 40rem
      case "none":
      default:
        return "";
    }
  };

  const getThemeClasses = (currentTheme?: ThemeProps) => {
    // Use semantic token for background
    if (currentTheme === "light") {
      return "bg-(--surface-background)";
    }
    // Default to semantic surface background token
    return "bg-background";
  };

  const getPaddingClass = () => {
    const classNames: string[] = [];

    if (responsivePadding)
      Object.keys(responsivePadding).map((key) => {
        const topPadding = responsivePadding[key as PaddingProps]?.top;
        const bottomPadding = responsivePadding[key as PaddingProps]?.bottom;
        let breakpoint = `${key}:`;
        if (key === "default") breakpoint = "";

        if (key === "xxl") breakpoint = "2xl:";

        if (topPadding)
          classNames.push(`${breakpoint}pt-${Math.round(topPadding / 4)}`);
        if (bottomPadding)
          classNames.push(`${breakpoint}pb-${Math.round(bottomPadding / 4)}`);

        return;
      });

    return classNames.join(" ");
  };


  return (
    <Component
      id={id}
      className={twMerge(
        theme === "dark" && "dark",
        "relative scroll-mt-16 text-body ",
        sectionType === "hero" || sectionType === "testimonialSlider"
          ? "px-(--scale-16) sm:px-(--scale-18) lg:px-(--scale-24)"
          : sectionType === "conversionPanel"
            ? ""
            : "section-padding-xl-left-right",
        getThemeClasses(theme),
        getPaddingClass(),
        getMinHeightClass(),
        className,
        "overflow-visible"
      )}
      {...rest}
      {...storyblokEditable}
    >
      {bgGradient && (
        <div className={twMerge("soft-gradient", bgGradient)}></div>
      )}

      <div className="relative z-2">
        {/** Background Image */}
        {backgroundImage?.filename && (
          <div className="absolute inset-0 z-11 overflow-hidden rounded-sm max-w-360 mx-auto">
            <Image
              loader={storyblokLoader}
              src={backgroundImage.filename}
              alt="section-background-image"
              fill
              priority
              className={twMerge(
                "object-cover",
                getBackgroundImagePositionClass(backgroundImagePosition)
              )}
            />

            <div className="absolute inset-0 z-20 bg-black/60" />
          </div>
        )}

        {children}
      </div>
    </Component>
  );
};
