import React, { forwardRef, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { Icon } from "../icon";

const HeadingTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
type HeadingTag = (typeof HeadingTags)[number];

export const headingVariants = cva(
  "relative font-medium text-(--text-headings)",
  {
    variants: {
      size: {
        "2xs": "text-display-2xs",
        xs: "text-display-xs",
        sm: "text-display-sm",
        md: "text-display-md",
        lg: "text-display-lg",
        xl: "text-display-xl",
        "2xl": "text-display-2xl",
        "3xl": "text-display-3xl",
        "4xl": "text-display-4xl",
        "5xl": "text-display-5xl",
        "6xl": "text-display-6xl",
        "7xl": "text-display-7xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      fontFamily: {
        display: "font-heading-display",
        accent: "font-heading-accent",
        body: "font-body",
        eyebrow: "font-eyebrow",
      },
      textTransform: {
        none: "normal-case",
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },
    },
    defaultVariants: {
      size: "3xl",
      weight: "medium",
      fontFamily: "display",
    },
  }
);

export interface HeadingBlok extends SbBlokData {
  heading?: string;
  as?: HeadingTag;
  headingSize?:
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  fontFamily?: "display" | "accent" | "body" | "eyebrow";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}

export interface HeadingProps
  extends
    React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  blok?: HeadingBlok;
  as?: HeadingTag;
  heading?: string;
  headingSize?: HeadingBlok["headingSize"];
  children?: React.ReactNode;
  icon?: string;
  iconColor?: "primary" | "secondary" | "tertiary";
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      blok,
      as,
      size,
      weight,
      headingSize,
      fontFamily,
      textTransform,
      className = "",
      heading,
      children,
      icon,
      iconColor,
      ...rest
    },
    ref: Ref<HTMLHeadingElement>
  ) => {
    const HeadingComponent = blok?.as || as || "h2";

    if (!HeadingTags.includes(HeadingComponent)) {
      console.error(
        `Heading: 'as' prop must be one of ${HeadingTags.join(", ")}`
      );
      return null;
    }
    const finalSize = blok?.headingSize || headingSize || size;
    const finalWeight = blok?.weight || weight;
    const finalFontFamily = blok?.fontFamily || fontFamily;
    const finalText = blok?.heading || heading || children;
    const finalIconColor = blok?.iconColor || iconColor;

    const finalIcon = blok?.icon || icon;
    return (
      <HeadingComponent
        ref={ref}
        className={`${headingVariants({
          size: finalSize,
          weight: finalWeight,
          fontFamily: finalFontFamily,
          textTransform,
        })} ${className}`}
        {...rest}
        {...(blok ? storyblokEditable(blok) : {})}
      >
        <span className="flex gap-2 items-center">
          {finalIcon && (
            <Icon
              size={32}
              color={
                finalIconColor === "primary"
                  ? "var(--illustration-dark)"
                  : iconColor === "secondary"
                    ? "var(--switchback-icon-color)"
                    : iconColor === "tertiary"
                      ? "var(--color-tertiary)"
                      : "var(--switchback-icon-color)"
              }
              icon={finalIcon as string}
            />
          )}
          {finalText}
        </span>
      </HeadingComponent>
    );
  }
);

Heading.displayName = "Heading";
