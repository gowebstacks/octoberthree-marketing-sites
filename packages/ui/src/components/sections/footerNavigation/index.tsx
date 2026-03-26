"use client";

import { usePathname } from "next/navigation";

import { useStoryblokSiteSettings } from "../../../hooks/useStoryblokSiteSettings";
import {
  StoryblokFooterColumn,
  StoryblokFooterLegalLink,
  StoryblokFooterLink,
  StoryblokFooterLinkGroup,
} from "../../../hooks/useStoryblokFooter";
import { Badge, Link } from "../../atoms";
import { Image } from "../../molecules";

export interface FooterNavigationProps {
  footerNavigation?: any | null;
}

const renderStoryblokRichText = (content: any) => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return content.map((block, index) => (
      <span key={index}>
        {block.content?.map((textNode: any, textIndex: number) => (
          <span key={textIndex}>{textNode.text}</span>
        ))}
      </span>
    ));
  }

  return <span>{content}</span>;
};

const getLinkHref = (link: any) => {
  if (!link) return "#";

  if (link.linkType === "external" && link.externalUrl) {
    return link.externalUrl;
  }

  if (link.linkType === "internal" && link.internalLink?.cached_url) {
    return `/${link.internalLink.cached_url}`;
  }

  return "#";
};

export const FooterNavigation: React.FC<FooterNavigationProps> = ({
  footerNavigation,
}) => {
  const { siteSettings } = useStoryblokSiteSettings();
  const footerData = footerNavigation;

  const pathname = usePathname();
  const pathLang = pathname?.split("/")[1];
  const currentLang = pathLang === "fr" || pathLang === "de" ? pathLang : "en";
  const homeHref = currentLang === "en" ? "/" : `/${currentLang}`;

  return (
    <footer className="overflow-hidden relative bg-(--surface-accent-background) section-padding-xl-left-right py-10">
      <div className="max-w-(--widths-1440-834-375) mx-auto">
        <nav className="mb-16 lg:mb-20" aria-label="Global">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 items-center sm:items-start">
            {footerData?.logo?.asset?.url && (
              <div className="flex flex-col gap-6 w-55 sm:w-61 lg:w-69 shrink-0">
                <Link href={homeHref}>
                  <Image
                    asset={footerData.logo.asset}
                    alt={footerData.logo.alt || "Footer logo"}
                    noFill
                    objectContain
                    unsetMaxWidth
                  />
                </Link>
              </div>
            )}

            <div className="flex flex-1 flex-wrap gap-12 sm:gap-16">
              {footerData?.columns?.map((column: StoryblokFooterColumn) => (
                <div
                  key={column._uid}
                  className="flex flex-col gap-8 min-w-40"
                >
                  {column?.groups?.map((group: StoryblokFooterLinkGroup) => (
                    <div key={group._uid} className="flex flex-col gap-4">
                      {group.groupTitle && (
                        <h3 className="text-sm font-medium text-(--text-headings)">
                          {group.groupTitle}
                        </h3>
                      )}

                      {group?.links?.map((link: StoryblokFooterLink) => (
                        <Link
                          key={link._uid}
                          href={getLinkHref(link.link)}
                          className="flex items-center gap-3 text-sm cursor-pointer text-(--text-body-dark)"
                        >
                          <span>{link.label}</span>
                          {link.badge && <Badge label={link.badge} />}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="w-full h-px bg-(--stroke-secondary) mb-6" />

        <div className="text-mono-xs text-(--text-body-dark) uppercase flex gap-6 sm:gap-11.5 items-center flex-col sm:flex-row">
          {footerData?.bottomSection?.[0]?.copyrightText ? (
            renderStoryblokRichText(
              footerData.bottomSection[0].copyrightText
            )
          ) : (
            <span>
              © {new Date().getFullYear()}{" "}
              {siteSettings?.siteName || "WEBSTACKS 2025"}
            </span>
          )}

          {footerData?.bottomSection?.[0]?.legalLinks?.map(
            (link: StoryblokFooterLegalLink) => (
              <Link key={link._uid} href={getLinkHref(link.link)}>
                <span className="text-mono-xs text-(--text-body-dark) uppercase">
                  {link.label}
                </span>
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
};