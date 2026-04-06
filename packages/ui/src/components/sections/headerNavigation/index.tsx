"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StoryblokGlobalNavigation } from "../../../types/storyblok";
import { useStoryblokSiteSettings } from "../../../hooks/useStoryblokSiteSettings";
import useWindowScrolledPast from "../../../lib/utils/hooks/useWindowScrolledPast";
import { closeDesktopMenu, closeMobileMenu } from "./store";
import { AnnouncementBar } from "./components/announcementBar";
import { Icon, Link } from "../../atoms";
import CTABar from "../../modules/ctaBar";
import Hamburger from "./components/hamburger";
import Navigation from "./components/navigation";
import MobileNavigation from "./components/mobile";
import Image from "next/image";
import { storyblokLoader } from "../../../utils/storyblokImageLoader";

export interface HeaderNavigationProps {
  headerNavigation: StoryblokGlobalNavigation | null;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  headerNavigation,
}) => {
  return (
    <header className="w-full transition-all duration-300 ease-in-out bg-(--surface-navbar) relative z-10">
      {headerNavigation?.announcement && (
        <AnnouncementBar
          announcement={headerNavigation.announcement}
          announcementLink={headerNavigation.announcementLink?.[0]}
        />
      )}

      <nav
        className="
          relative
          flex
          max-w-(--widths-1440-834-375)
          mx-auto
          py-(--gaps-32-24-24)
          px-(--padding-side-sectional-80-64-16)
          items-center
        "
      >
        <div className="h-full lg:basis-auto lg:shrink-0 lg:grow-0 flex items-center text-black!">
          {headerNavigation?.logo?.filename ? (
            <Link href={"/"} aria-label="Home">
              <Image
              loader={storyblokLoader}
                src={headerNavigation?.logo?.filename}
                className="max-h-13.75 w-fit min-w-26.5  max-w-49"
                width={193}
                height={55}
                alt="logo"
              />
            </Link>
          ) : 'Logo Placeholder'
        }
       
        </div>

        {headerNavigation?.menuItems && (
          <div
            className="
              hidden
              xl:absolute xl:left-1/2 xl:top-1/2
              xl:-translate-x-1/2 xl:-translate-y-1/2
              xl:flex
              transition-colors duration-300 ease-in-out
            "
          >
            <Navigation menuItems={headerNavigation.menuItems} />
          </div>
        )}

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:block lg:hidden">
            <Icon icon="search-md" />
          </div>

          {headerNavigation?.ctaBar && (
            <div className="hidden sm:flex items-center gap-4 xl:gap-6">
              {headerNavigation.ctaBar.map((ctaGroup, index) => (
                <CTABar key={index} buttons={ctaGroup.buttons} />
              ))}
            </div>
          )}

          <div className="xl:hidden text-heading">
            <Hamburger />
          </div>
        </div>
      </nav>

      {headerNavigation?.menuItems && (
        <MobileNavigation
          menuItems={headerNavigation.menuItems}
          ctaBar={headerNavigation?.ctaBar}
        />
      )}
    </header>
  );
};

export default HeaderNavigation;
