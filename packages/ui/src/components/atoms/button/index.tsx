"use client";

import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useState } from "react";
import { storyblokEditable } from "@storyblok/react";

import { buttonStyles } from "./Button.styles";

import Icon from "../icon/icon";

import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import type { SbBlokData } from "@storyblok/react";
import { getLinkData, LinkFragment } from "../link";
import parseUrl, { ensureLeadingSlash } from "../../../utils/parseUrl";
import { FormModal } from "../../molecules/formModal";
import { getLinkHref } from "../../../utils/getLinkHref";

type NativeButtonProps = ComponentPropsWithoutRef<"button"> &
  ComponentPropsWithoutRef<"a">;

export type ButtonProps = NativeButtonProps & {
  className?: string;
  label?: string;
  children?: ReactNode;
  link?: string | LinkFragment;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  // New props for mode and tone
  mode?: "filled" | "link" | "nav";
  tone?: "primary" | "secondary";
  background?: "light" | "dark";
  // Keep variant for backward compatibility
  variant?: "primary" | "secondary" | "link";
  leadingIcon?: string;
  trailingIcon?: string;
  fullWidth?: boolean;
  // Force component to render as an anchor
  asLink?: boolean;
  // Storyblok specific props
  linkType?: "internal" | "external" | "popup" | "anchor";
  internalLink?: {
    id: string;
    url: string;
    linktype: string;
    fieldtype: string;
    cached_url: string;
  };
  url?: string | LinkFragment;
  externalUrl?: string;
  anchorLinkId?: string;
  popupform?: string;
  openInNewTab?: boolean;
  iconColor?: string;
} & SbBlokData;

const Button: FC<ButtonProps> = ({
  className,
  label,
  children,
  link,
  mode,
  tone,
  background,
  variant, // Keep for backward compatibility
  size,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  asLink = false,
  // Storyblok specific props
  linkType,
  internalLink,
  externalUrl,
  anchorLinkId,
  popupform,
  openInNewTab,
  iconColor,
  ...props
}) => {
  // Extract data from nested structure that StoryblokComponent provides
  const actualBlok = (props as any)?.blok || props;

  // Use Storyblok props if available, otherwise use direct props
  const actualLabel = label || actualBlok?.label || children;
  const actualLinkType = linkType || actualBlok?.linkType;
  const actualInternalLink = internalLink || actualBlok?.internalLink;
  const actualExternalUrl = externalUrl || actualBlok?.externalUrl;
  const actualAnchorLinkId = anchorLinkId || actualBlok?.anchorLinkId;
  const actualpopupform = popupform || actualBlok?.popupform;
  const actualOpenInNewTab =
    openInNewTab !== undefined ? openInNewTab : actualBlok?.openInNewTab;
  const actualMode = mode || actualBlok?.mode || "filled";
  const actualTone = tone || actualBlok?.tone || "primary";
  const actualTrailingIcon =
    trailingIcon ||
    actualBlok?.trailingIcon ||
    (actualTone === "secondary" ? "arrow-up-right" : undefined);

  const actualLeadingIcon = leadingIcon || actualBlok?.leadingIcon;
  // Build link from Storyblok data if available
  let finalLink = link;

  if (
    props.url &&
    typeof props.url !== "string" &&
    "cached_url" in props.url &&
    props.url.cached_url !== ""
  ) {
    finalLink = props.url;
  }
  if (
    !finalLink &&
    actualLinkType === "internal" &&
    actualInternalLink?.cached_url
  ) {
    console.log("no final link", internalLink);
    finalLink = `/${actualInternalLink.cached_url}`;
  } else if (!finalLink && actualLinkType === "external" && actualExternalUrl) {
    finalLink = actualExternalUrl;
  } else if (!finalLink && actualLinkType === "anchor" && actualAnchorLinkId) {
    finalLink = `#${actualAnchorLinkId}`;
  } else if (!finalLink && actualLinkType === "popup") {
    finalLink = {
      linkType: "popup",
      popupform: actualpopupform,
      label: actualLabel,
    };
  }

  // Get the raw link data without modification
  const rawLinkData = getLinkData(finalLink);

  // Only add leading slash for internal URLs, not for external URLs or anchor links
  let url = rawLinkData;


  if (actualLinkType === "internal" && actualInternalLink?.cached_url) {
    url = getLinkHref({
      linkType: "internal",
      internalLink: actualInternalLink,
    });
  }

  if (
    props.url &&
    typeof props.url !== "string" &&
    (props.url as any).linktype === "story" &&
    "cached_url" in props.url &&
     props.url.cached_url !== ""
  ) {
    url = getLinkHref({
      linkType: "internal",
      internalLink: finalLink,
    });
  }

  // Check if it's an anchor link (starts with # or TEST#)
  const extendedLink = finalLink as any; // Type assertion for extended properties
  const isAnchorLink =
    typeof finalLink !== "string" && extendedLink?.linkType === "anchor";
  const isExternalUrl =
    typeof finalLink !== "string" && extendedLink?.linkType === "external";

  if (
    isAnchorLink &&
    typeof finalLink !== "string" &&
    extendedLink?.anchorLinkId
  ) {
    // Handle anchor links properly - just use #anchorId without TEST prefix
    url = `#${extendedLink.anchorLinkId}`;
  } else if (
    url &&
    !isExternalUrl &&
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("#") &&
    !url.startsWith("tel:") &&
    !url.startsWith("mailto:")
  ) {
    url = ensureLeadingSlash(url);
  }

  const finalOpenInNewTab =
    actualOpenInNewTab ||
    (finalLink && typeof finalLink !== "string"
      ? !!extendedLink.openInNewTab
      : false);
  const { as, ...urlProps } = parseUrl(url || "", finalOpenInNewTab);

  // Determine the component type based on the presence of a link
  // If parseUrl returns 'a' or Link, use 'a' (for proper anchor rendering)
  // Otherwise, if asLink is true, force 'a', else use 'button'
  const isPopup =
    actualLinkType === "popup" ||
    (typeof finalLink !== "string" && (finalLink as any)?.linkType === "popup");
  const Component = isPopup
    ? "button"
    : as === "a" || as === Link || (asLink && urlProps.href)
      ? "a"
      : "button";

  // Map old variant to new mode if variant is provided but mode is not
  const derivedMode =
    actualMode ||
    (variant === "primary" || variant === "secondary"
      ? "filled"
      : variant === "link"
        ? "link"
        : variant === "nav"
          ? "nav"
          : undefined);

  // Map old variant to new tone if variant is provided but tone is not
  const derivedTone =
    actualTone || (variant === "secondary" ? "secondary" : "primary");

  const ButtonContent = () => {
    // Determine if we should show the automatic arrow icon for link buttons (both primary and secondary)
    const shouldShowAutoArrow =
      ((derivedMode === "link" &&
        (derivedTone === "primary" || derivedTone === "secondary")) ||
        variant === "link") &&
      !actualTrailingIcon &&
      !actualLeadingIcon;

    return (
      <>
        {actualLeadingIcon &&
          actualLeadingIcon !== "None" &&
          mode !== "nav" && (
            <span>
              <Icon
                color={iconColor}
                size={20}
                icon={actualLeadingIcon}
                aria-hidden={true}
              />
            </span>
          )}
        <span className="mt-0.5 lg:mt-0">{actualLabel || children}</span>
        {actualTrailingIcon &&
          actualTrailingIcon !== "None" &&
          mode !== "nav" && (
            <span>
              <Icon
                color={iconColor}
                size={20}
                icon={actualTrailingIcon}
                aria-hidden={true}
              />
            </span>
          )}
        {actualTrailingIcon &&
          actualTrailingIcon !== "None" &&
          mode === "nav" && (
            <span>
              <Icon
                color={iconColor}
                size={20}
                icon={"chevron-down"}
                aria-hidden={true}
              />
            </span>
          )}
        {shouldShowAutoArrow && (
          <span>
            <Icon
              color={iconColor}
              size={20}
              icon="arrow-up-right"
              spriteType="ui"
              aria-hidden={true}
            />
          </span>
        )}
      </>
    );
  };

  const [openPopup, setOpenPopup] = useState(false);

  const handleClick = (e: any) => {
 

    // Call user's onClick first if provided
    if (props.onClick) {
      props.onClick(e);
    }

    // Then handle internal logic
    if (isPopup) {
      e?.preventDefault?.();
      setOpenPopup(true);
    } else if (
      isAnchorLink &&
      typeof finalLink !== "string" &&
      extendedLink?.anchorLinkId
    ) {
      // Handle smooth scrolling for anchor links
      e?.preventDefault?.();
      const targetElement = document.getElementById(extendedLink.anchorLinkId);
      if (targetElement) {
        // Account for fixed header height (64px = 16 * 4px in Tailwind)
        const headerOffset = 64;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <Component
        {...storyblokEditable(actualBlok)}
        className={twMerge(
          buttonStyles({
            mode: derivedMode,
            tone: derivedTone,
            variant, // Keep for backward compatibility
            fullWidth,
            size,
            background: background ? background : "light",
          }),
          "group",
          "h-10 lg:h-13",
          className
        )}
        // Spread user props first so our controlled props take precedence
        {...props}
        {...(!isPopup && urlProps.href ? { href: urlProps.href } : {})}
        target={!isPopup ? (urlProps as any)?.target : undefined}
        rel={!isPopup ? (urlProps as any)?.rel : undefined}
        onClick={handleClick}
        // Ensure button semantics for popup
        {...(isPopup ? { role: "button", type: "button" } : {})}
      >
        <span className="flex gap-2 items-center  text-sm">
          {ButtonContent()}
        </span>
      </Component>

      {/* Popup Form Modal */}
      {isPopup && (
        <FormModal
          isOpen={openPopup}
          onClose={() => setOpenPopup(false)}
          formId={
            typeof finalLink !== "string"
              ? (finalLink as any)?.popupform?.formId
              : undefined
          }
          title={
            typeof finalLink !== "string" ? extendedLink?.label : undefined
          }
        />
      )}
    </>
  );
};

export default Button;
