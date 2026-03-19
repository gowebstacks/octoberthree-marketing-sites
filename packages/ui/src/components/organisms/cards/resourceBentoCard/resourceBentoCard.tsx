import type { FC } from "react";
import { getResourceRoute, RESOURCE_TYPE_LABELS } from "../../../../lib";
import { Button, Heading, Link } from "../../../atoms";
import { extractPlainText, ResourceCardProps } from "../../resourceCard";
import { Image } from "../../../molecules";
import { formatDate } from "../../../../utils/date";
import { twMerge } from "tailwind-merge";
import { RichText } from "../../../molecules/richText/richText";
import { storyblokEditable } from "@storyblok/react";

export interface ResourceBentoCardProps extends ResourceCardProps {
  size?: "sm" | "md" | "lg";
}

export const ResourceBentoCard: FC<ResourceBentoCardProps> = ({
  size = "md",
  ...props
}) => {
  const {
    _type,
    title,
    excerpt,
    body,
    featuredImage,
    seo,
    slug,
    publishDate,
    resourceType,
  } = props;

  const resourceSlug = seo?.slug?.current || slug?.current || "";
  const resourceUrl = `${getResourceRoute(_type)}/${resourceSlug}`;
  const badgeLabel = RESOURCE_TYPE_LABELS[_type] || "Article";

  // Determine mobile styles based on the size prop
  // On mobile, we want md behavior regardless of the size prop
  const getMobileStyles = () => {
    // For mobile, always use md styles
    // For larger screens, use the actual size prop
    return {
      container:
        "flex flex-col gap-(--scale-24) p-(--scale-24) md:flex-row! md:gap-4 md:p-4",
      image: "aspect-video md:w-[140px] md:h-full md:aspect-auto",
      content: "",
      titleSize: "text-display-2xl mb-4 md:text-display-xl md:mb-2",
      excerptVisibility: "line-clamp-4 mb-6 md:hidden",
    };
  };

  // Define responsive styles based on screen size
  const getResponsiveStyles = () => {
    // Base mobile styles (always use md-like layout)
    const baseStyles = {
      container: "flex flex-col gap-(--scale-24) p-(--scale-24)",
      image: "aspect-video",
      titleSize: "text-display-2xl mb-4",
      excerptVisibility: "line-clamp-4 mb-6",
    };

    // Add responsive overrides based on size prop
    const responsiveOverrides = {
      sm: {
        container: "md:flex-row! md:gap-4 md:p-4 md:items-center",
        image: "md:w-[140px] md:h-full md:aspect-auto shrink-0",
        titleSize: "md:text-display-xl md:mb-2",
        excerptVisibility: "md:hidden",
      },
      md: {
        container: "md:flex-col md:gap-(--scale-24) md:p-(--scale-24) ",
        image: "md:aspect-video",
        titleSize: "md:text-display-2xl md:mb-4",
        excerptVisibility: "md:line-clamp-4 md:mb-6",
      },
      lg: {
        container: "md:flex-col md:gap-6 md:p-6",
        image: "md:aspect-video",
        titleSize: "md:text-display-2xl md:mb-4",
        excerptVisibility: "md:line-clamp-4 md:mb-6",
      },
    };

    return {
      container: twMerge(
        baseStyles.container,
        responsiveOverrides[size].container
      ),
      image: twMerge(baseStyles.image, responsiveOverrides[size].image),
      titleSize: twMerge(
        baseStyles.titleSize,
        responsiveOverrides[size].titleSize
      ),
      excerptVisibility: twMerge(
        baseStyles.excerptVisibility,
        responsiveOverrides[size].excerptVisibility
      ),
    };
  };

  const styles = getResponsiveStyles();

  return (
    <Link
      href={resourceUrl}
      {...storyblokEditable(props)}
      className={twMerge(
        "group relative overflow-hidden border border-(--stroke-secondary)",
        "transition-all duration-200 max-h[580px] h-full hover:shadow-lg bg-(--surface-card)",
        styles.container
      )}
    >
      {featuredImage && (
        <div className={twMerge("relative overflow-hidden", styles.image)}>
          <Image
            asset={{ url: featuredImage.filename }}
            {...featuredImage}
            alt={featuredImage?.alt || title || "Resource"}
            className="h-full w-full [&>img]:object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex dark items-center gap-2 text-sm font-medium mb-2 text-(--text-eyebrow-date)">
          {publishDate && (
            <>
              <span>{formatDate(publishDate)}</span>
              <span>|</span>
            </>
          )}
          <span className="text-accent">
            {_type?.toUpperCase() || resourceType.toUpperCase()}
          </span>
        </div>

        {title && (
          <Heading as="h3" className={styles.titleSize} heading={title} />
        )}

        {body && (
          <p
            className={twMerge(
              "text-(--text-body-dark)",
              styles.excerptVisibility
            )}
          >
            <RichText doc={body} />
          </p>
        )}

        <Button mode="link" label="Learn more" className="w-fit" />
      </div>
    </Link>
  );
};
