"use client";

import { Item, Root, Trigger } from "@radix-ui/react-accordion";
import { useEffect, type FC } from "react";
import { usePathname } from "next/navigation";

import type {
  StoryblokNavigationMenuItem,
  StoryblokMenuSection,
} from "../../../../../types/storyblok";

import { Button, Icon, Link } from "../../../../atoms";
import AccordionContent from "./accordionContent";
import { closeMobileMenu, toggleMobileMenu } from "../../store";
import MainMobileAccordion from "./mainMobileAccordion";
import { CTABar } from "../../../../molecules";
import { CTABarProps } from "../../../../modules/ctaBar";

interface MobileNavigationProps {
  menuItems?: StoryblokNavigationMenuItem[];
  ctaBar?: CTABarProps[];
}

interface MobileNavAccordionProps {
  item: StoryblokNavigationMenuItem;
}

const hasSections = (sections?: StoryblokMenuSection[]) =>
  Boolean(sections && sections.length > 0);

const MobileNavAccordion: FC<MobileNavAccordionProps> = ({ item }) =>
  hasSections(item.menuSection) ? (
    <div className="relative w-full 
border-b border-(--color-navy-primary-300)">
      <Trigger className="group flex w-full cursor-pointer items-center justify-between gap-2 py-6 px-(--scale-16) sm:px-(--scale-64)! text-heading transition-colors hover:text-headline-hover">
        <span className="text-sm text-(--text-nav-item)">
          {item.label || item.link?.label}
        </span>
        <Icon
          icon="chevron-down"
          size={22}
          className="transition-transform group-data-[state=open]:rotate-180"
        />
      </Trigger>

      <AccordionContent menuSection={item.menuSection!} />
    </div>
  ) : (
    <Link
      href={item.link as any}
      onClick={() => toggleMobileMenu()}
      className="border-b border-(--color-navy-primary-300) flex w-full items-center justify-between px-(--scale-16) py-6 sm:px-(--scale-64)! text-sm text-(--text-nav-item) transition-colors hover:text-headline-hover"
    >
      <span>{item.label || item.link?.label}</span>
    </Link>
  );

const MobileNavigation: FC<MobileNavigationProps> = ({ menuItems, ctaBar }) => {
  const pathname = usePathname();

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <MainMobileAccordion>
      <Root
        type="single"
        collapsible
        className="w-full border-t border-(--stroke-primary) bg-(--surface-background)"
      >
        <div className="flex flex-col gap-24">
          {/* Main navigation */}
          <div className="flex flex-col bg-(--surface-background)">
            {menuItems?.map((mainItem) => (
              <Item
                key={mainItem._uid}
                value={mainItem.label || mainItem.link?.label || ""}
                className="relative w-full"
              >
                <MobileNavAccordion item={mainItem} />
              </Item>
            ))}
          </div>

         {
          ctaBar &&
          <div className="px-(--scale-16) pb-8">
             {ctaBar?.map((ctaGroup, index) => (
            <CTABar key={index} buttons={ctaGroup.buttons} />
          ))}
          </div>
         }
        </div>
      </Root>
    </MainMobileAccordion>
  );
};

export default MobileNavigation;
