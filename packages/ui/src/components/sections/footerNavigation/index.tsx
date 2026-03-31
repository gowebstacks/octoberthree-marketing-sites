"use client";

import { usePathname } from "next/navigation";
import { Icon, Link } from "../../atoms";
import { StoryblokAsset } from "../../../types/storyblok";
import Image from "next/image";
import { getLinkHref } from "../../../utils/getLinkHref";

type StoryblokLinkField = {
  linkType?: "external" | "internal";
  externalUrl?: string;
  internalLink?: {
    cached_url: string;
  };
  cached_url?: string;
};

type StoryblokFooterLink = {
  _uid: string;
  label: string;
  link: StoryblokLinkField;
};

type StoryblokFooterLinkGroup = {
  _uid: string;
  component?: string;
  groupTitle?: string;
  links?: StoryblokFooterLink[];
  address?: string;
  phone?: string;
  cta?: any[];
  socialLinks?: any[];
};

type StoryblokFooterColumn = {
  _uid: string;
  groups?: StoryblokFooterLinkGroup[];
};

type StoryblokFooterLegalLink = {
  _uid: string;
  label: string;
  link: StoryblokLinkField;
};

type StoryblokBottomSection = {
  _uid: string;
  copyrightText?: any;
  legalLinks?: StoryblokFooterLegalLink[];
  brands?: any[];
};

type StoryblokFooterNavigation = {
  footerImage?: StoryblokAsset;
  columns?: StoryblokFooterColumn[];
  bottomSection?: StoryblokBottomSection[];
  siteName?: string;
};

export interface FooterNavigationProps {
  footerNavigation?: StoryblokFooterNavigation | null;
}

const renderRichText = (content: any) => {
  if (!content?.content) return null;
  return content.content.map((p: any, i: number) => (
    <span key={i}>
      {p.content?.map((t: any, j: number) => (
        <span key={j}>{t.text}</span>
      ))}
    </span>
  ));
};

export const FooterNavigation: React.FC<FooterNavigationProps> = ({
  footerNavigation,
}) => {
  const footer = footerNavigation;

  const pathname = usePathname();
  const lang = pathname?.split("/")[1];
  const currentLang = lang === "fr" || lang === "de" ? lang : "en";
  const homeHref = currentLang === "en" ? "/" : `/${currentLang}`;

  const groups = footer?.columns?.[0]?.groups || [];

  const linkGroups = groups.filter((g) => g.component === "footerLinkGroup");

  const contact = groups.find((g) => g.component === "footerContactColumn");

  const bottom = footer?.bottomSection?.[0];

  return (
    <footer className="bg-(--surface-accent-background) section-padding-xl-left-right py-12 text-white">
      <div className="max-w-360 mx-auto">
        <div className="flex flex-col gap-14">
          {footer?.footerImage?.filename && (
            <div className="">
              <Link href={homeHref}>
                <Image
                  src={footer.footerImage.filename}
                  alt="Footer logo"
                  width={233}
                  height={31}
                  className="w-fit max-w-58 max-h-15"
                />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {linkGroups.map((group) => (
              <div key={group._uid} className="flex flex-col gap-6">
                <h3 className="text-md font-medium text-(--text-headings-light)">
                  {group.groupTitle}
                </h3>

                <div className="flex flex-col gap-3">
                  {group.links?.map((link) => (
                    <Link
                      key={link._uid}
                      href={getLinkHref(link.link)}
                      className="text-sm  hover:opacity-90 text-(--color-neutral-100) cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {contact && (
              <div className="flex flex-col gap-6">
                <h3 className="text-md font-medium text-(--text-headings-light)">
                  {contact.groupTitle}
                </h3>

                <div className="flex flex-col gap-3 text-(--color-neutral-100)">
                  {contact.address && (
                    <div>
                      <p className="text-sm whitespace-pre-line ">
                        {contact.address.replace(/\u2028/g, "\n")}
                      </p>
                      {contact.phone && (
                        <p className="text-sm ">
                          {contact.phone.replace("out", "")}
                        </p>
                      )}
                    </div>
                  )}

                  {contact.cta?.[0] && (
                    <Link
                      href={contact.cta[0].externalUrl}
                      className="underline text-sm cursor-pointer"
                    >
                      {contact.cta[0].label}
                    </Link>
                  )}

                  <div className="flex gap-4 mt-3">
                    {contact.socialLinks?.map((s: any) => (
                      <Link
                        key={s._uid}
                        href={`https://${s.url}`}
                        className="hover:opacity-90 cursor-pointer bg-(--surface-background) p-2.5 rounded-sm"
                      >
                        <Icon
                          color="var(--icon-contained-icon)"
                          icon={s.platform}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-(--stroke-secondary) mt-14 mb-6" />

        <div className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center">
          <div className="lg:flex lg:flex-col gap-2 lg:gap-3 sm:hidden flex flex-col-reverse">
            <div className="flex flex-wrap gap-6 text-mono-sm uppercase cursor-pointer">
              {bottom?.legalLinks?.map((link) => (
                <Link key={link._uid} href={getLinkHref(link.link)}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="text-mono-sm uppercase">
              {bottom?.copyrightText?.content?.[0]?.content
                ?.map((t: any) => t.text) 
                .join("")
                .replace("{year}", String(new Date().getFullYear()))}
            </div>
          </div>

          <div className="lg:hidden flex-wrap gap-6 w-full text-mono-sm uppercase cursor-pointer hidden sm:flex justify-between">
            <div className="text-mono-sm uppercase w-full md:w-fit">
              {bottom?.copyrightText?.content?.[0]?.content
                ?.map((t: any) => t.text)
                .join("")
                .replace("{year}", String(new Date().getFullYear()))}
            </div>
            {bottom?.legalLinks?.map((link) => (
              <Link key={link._uid} href={getLinkHref(link.link)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-start gap-8 cursor-pointer">
            {bottom?.brands?.[0]?.footerBrand?.map((brand: any) => (
              <Link key={brand._uid} href={brand.link}>
                <Image
                  height={200}
                  width={300}
                  alt={brand.logo.alt || "brand-logo"}
                  src={brand.logo.filename}
                  className="lg:h-full w-full h-13.5 max-w-48"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
