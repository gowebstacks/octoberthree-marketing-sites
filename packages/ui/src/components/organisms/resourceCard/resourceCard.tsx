import type { FC } from "react";
import { getResourceRoute, RESOURCE_TYPE_LABELS } from "../../../lib";
import { Button, Heading, Link } from "../../atoms";
import { SbBlokData, storyblokEditable } from "@storyblok/react";
import { RichText } from "../../molecules/richText/richText";
import { RichTextContent } from "../../../types/storyblok";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";

// Universal resource type that handles blogs, case studies, webinars, and press releases
export interface ResourceCardProps extends SbBlokData {
  _id: string;
  _type: "blogPost" | "caseStudy" | "webinar" | "pressRelease";
  title: string;
  excerpt?: string;
  body?: RichTextContent;
  featuredImage?: any; // all resource types use featuredImage
  seo?: {
    slug?: {
      current?: string;
    };
  };
  slug?: {
    // case studies use slug directly
    current?: string;
  };
  publishedDate?: string;
  publishedAt?: string; // case studies and press releases use publishedAt
  readTime?: number;
  author?: any;
  topics?: Array<{ name: string }>;
  companyName?: string; // case studies have companyName
  location?: string; // press releases have location
  showBadge?: boolean; // optional badge to show content type
  [key: string]: any;
  // Tocheck if it is used in resource carousel
  carousel?: boolean;
  mode: "dark" | "light";
}

// Helper function to extract plain text from portable text body
export const extractPlainText = (body: any[]): string => {
  if (!body || !Array.isArray(body)) return "";

  let text = "";

  const extractFromBlock = (block: any): string => {
    if (!block) return "";

    // Handle text blocks
    if (block._type === "block" && block.children) {
      return block.children
        .filter(
          (child: any) =>
            child._type === "span" && typeof child.text === "string"
        )
        .map((child: any) => child.text)
        .join("");
    }

    return "";
  };

  for (const block of body) {
    const blockText = extractFromBlock(block);
    if (blockText) {
      text += blockText + " ";
      // Stop if we have enough characters
      if (text.length >= 140) break;
    }
  }

  return text.trim().substring(0, 140);
};

export const ResourceCard: FC<ResourceCardProps> = (props) => {
  const {
    _type,
    title,
    excerpt,
    body,
    featuredImage,
    seo,
    slug,
    publishedDate,
    publishedAt,
    readTime,
    author,
    topics,
    companyName,
    showBadge = false,
    carousel = false,
    mode='light',
  } = props;

  // Use featuredImage for all resource types
  const displayImage = featuredImage;

  // Determine slug based on resource type
  const resourceSlug = seo?.slug?.current || slug?.current || "";

  // Determine published date based on resource type
  const displayDate = publishedDate || publishedAt;

  // Get the first topic or default based on type
  const category =
    _type === "caseStudy"
      ? companyName?.toUpperCase() || "CASE STUDY"
      : topics?.[0]?.name?.toUpperCase() || "BLOG";

  // Get badge label from centralized constants
  const badgeLabel = RESOURCE_TYPE_LABELS[_type] || "Article";

  const resourceUrl = `${getResourceRoute(_type)}/${resourceSlug}`;

  console.log(props, "inside resource card")
  return (
    <Link
      href={resourceUrl}
      {...storyblokEditable(props)}
      className={twMerge(
        "group cursor-pointer relative flex h-full flex-col overflow-hidden transition-all duration-200 bg-(--surface-card) hover:bg-(--surface-card-hover) border border-(--stroke-card)",
        !displayImage &&
          (mode === "light"
            ? "border-t-[8px] border-t-(--color-orange-300)"
            : "border-t-[8px] border-t-(--surface-accent-background)")
      )}
    >
      <div className={twMerge(carousel ? "max-w-100" : "")}>
        {/* Featured Image */}
        {displayImage && (
          <div
            className={twMerge(
              "relative h-24.25 flex justify-center items-center overflow-hidden p-8",
              mode === "light"
                ? "bg-(--color-orange-300) group-hover:bg-(--illustration-primary)"
                : "bg-(--surface-accent-background) group-hover:bg-(--text-blog-cta-card)"
            )}
          >
            <Image
            loader={storyblokLoader}
              src={displayImage.filename}
              alt={displayImage?.alt || title || "Resource"}
              className="object-cover h-full"
              width={250}
              height={10}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col grow p-(--padding-24-18-18)">
          {/* Category */}
          <span className="text-xs font-medium text-(--text-link) uppercase tracking-wide mb-2">
            {category}
          </span>

          {/* Title */}
          {title && (
            <Heading
              as="h3"
              size="lg"
              weight="bold"
              heading={title}
              className="text-display-xl text-(--text-headings-dark) mb-2 group-hover:text-link-hover transition-colors duration-200 font-serif"
            ></Heading>
          )}

          {/* Description */}
          {body && (
            <div className="text-sm text-(--text-body-dark) line-clamdiv-4 grow mb-4">
              <RichText doc={body} />
            </div>
          )}

          {/* Learn More Link */}
          <Button
            className="w-fit group-hover:text-(--text-link-hover)"
            mode="link"
            label="Learn more"
          />
        </div>
      </div>
    </Link>
  );
};