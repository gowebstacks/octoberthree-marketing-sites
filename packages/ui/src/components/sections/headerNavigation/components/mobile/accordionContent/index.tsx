import { Content } from "@radix-ui/react-accordion";
import type { FC } from "react";

import type {
  StoryblokMenuSection,
  StoryblokNavigationInnerItem,
  StoryblokNavigationSpotlightCard,
} from "../../../../../../types/storyblok";

import NavItem from "../../navItem";
import FeaturedCard from "../../featuredCard";
import { Link } from "../../../../../atoms";
import { getLinkHref } from "../../../../../../utils/getLinkHref";

interface AccordionContentProps {
  menuSection: StoryblokMenuSection[];
  spotlightCard?: StoryblokNavigationSpotlightCard;
}

const AccordionContent: FC<AccordionContentProps> = ({
  menuSection,
  spotlightCard,
}) => (
  <Content
    className="
      flex flex-col gap-4 overflow-hidden
      data-[state=closed]:animate-(--animate-accordion-slide-up)
      data-[state=open]:animate-(--animate-accordion-slide-down)
    "
    style={{
      background: "var(--surface-background)",
   
    }}
  >
    <div className="flex flex-col gap-8 p-(--scale-16)  sm:p-8  md:p-12">
      {menuSection.map((section) => (
        <div key={section._uid} className="flex flex-col gap-4">
          {/* Section title */}
          <span className="text-mono-sm  text-(--text-headings) uppercase tracking-wide ">
            {section.title} 
          </span>

          {/* Section items */}
          <div className="flex flex-wrap gap-4  sm:gap-14 items-center">
            {section.items.map((menuItem: StoryblokNavigationInnerItem) => (
              <NavItem key={menuItem._uid} {...menuItem} isMobile />
            ))}

            {section.ctaLink && (
              <Link
                href={getLinkHref(section.ctaLink)}
                className="cursor-pointer text-xs font-medium text-(--text-link-active)"
              >
                {section.ctaLink.label}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  </Content>
);

export default AccordionContent;
