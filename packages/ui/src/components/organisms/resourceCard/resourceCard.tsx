import type { FC } from "react";
import { getResourceRoute, RESOURCE_TYPE_LABELS } from "../../../lib";
import { Button, Heading, Link } from "../../atoms";
import { SbBlokData, storyblokEditable } from "@storyblok/react";
import { RichText } from "../../molecules/richText/richText";
import { RichTextContent } from "../../../types/storyblok";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";


type ResourceUIType =
  | "article"
  | "caseStudy"
  | "webinar"
  | "pressRelease";

export interface ResourceCardProps extends SbBlokData {
  _id: string;
  type: ResourceUIType;
  title: string;
  excerpt?: string;
  body?: RichTextContent;
  featuredImage?: any; // all resource types use featuredImage
  link: SbBlokData;
  seo?: {
    slug?: {
      current?: string;
    };
  };
  slug?: {
    // case studies use slug directly
    current?: string;
  };
  tags: string[];
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
  labelLink?: string
}
const getFirstValidParagraph = (body?: RichTextContent) => {
  const content = body?.content;
  if (!Array.isArray(content)) return null;

  for (const block of content) {
    if (block.type !== "paragraph") continue;

    const children = block.content || [];

    const hasText = children.some(
      (child: any) =>
        child.type === "text" && child.text?.trim().length > 0
    );

    if (hasText) {
      return {
        ...body,
        content: [block], // keep full doc shape, just replace content
      };
    }
  }

  return null;
};

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
    type,
    title,
    excerpt,
    body,
    featuredImage,
    link,
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
    linkLabel
  } = props;

  // Use featuredImage for all resource types
  const displayImage = featuredImage;

  // Determine slug based on resource type
  const resourceSlug = seo?.slug?.current || slug?.current || "";

  // Determine published date based on resource type
  const displayDate = publishedDate || publishedAt;

  // Get the first topic or default based on type
  const category =
    type === "caseStudy"
      ?  "CASE STUDY"
      : type === "article" ? "Article"
      : type === "webinar" ? "Webinar" 
      : type === "pressRelease" ?  "Press Release" : "Article"

  // Get badge label from centralized constants
  const badgeLabel = RESOURCE_TYPE_LABELS[type] || "Article";

  const resourceUrl = link  || `${getResourceRoute(type)}/${resourceSlug}`;
    const firstParagraph = getFirstValidParagraph(body);

  return (
    <Link
      href={resourceUrl}
      {...storyblokEditable(props)}
      className={twMerge(
        "group hover:shadow-lg cursor-pointer relative flex h-full flex-col overflow-hidden transition-all duration-200 bg-(--surface-card) hover:bg-(--surface-card-hover) border border-(--stroke-card) rounded-sm",
       
      )}
    >
      <div className={twMerge('flex flex-col',carousel ? "max-w-100" : "",  !displayImage.filename &&
          (mode === "light"
            ? "border-t-8 border-t-orange-300"
            : "border-t-8 border-t-(--surface-accent-background)"))}>
        {/* Featured Image */}
        {displayImage.filename && (
          <div
            className={twMerge(
              "relative  flex justify-center items-center overflow-hidden h-35",
              mode === "light"
                ? "bg-orange-300 group-hover:bg-(--illustration-primary)"
                : "bg-(--surface-accent-background) group-hover:bg-(--text-blog-cta-card)"
            )}
          >
            <Image
            loader={storyblokLoader}
              src={displayImage.filename}
              alt={displayImage?.alt || title || "Resource"}
              className="object-cover h-24.25 w-full"
              fill
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col p-(--padding-24-18-18)  h-full">
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
            <div className="text-sm text-(--text-body-dark) line-clamp-4 mb-4">
              <RichText doc={firstParagraph} />
            </div>
          )}

          {/* Learn More Link */}
         {
          resourceUrl.url &&
           <Button
            className="w-fit group-hover:text-(--text-link-hover) mt-auto"
            mode="link"
            label={linkLabel || "Read more"}
          />
         }
        </div>
      </div>
    </Link>
  );
};