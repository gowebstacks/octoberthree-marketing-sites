"use client";

import { Content } from "@radix-ui/react-accordion";
import type { FC } from "react";
import { useState } from "react";

import type {
  StoryblokMenuSection,
  StoryblokNavigationInnerItem,
} from "../../../../../../types/storyblok";

import NavItem from "../../navItem";
import { Button, Link, Icon } from "../../../../../atoms";
import { getLinkHref } from "../../../../../../utils/getLinkHref";

interface AccordionContentProps {
  menuSection: StoryblokMenuSection[];
}

const AccordionContent: FC<AccordionContentProps> = ({ menuSection }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(menuSection.map((section) => [section._uid, true]))
  );
  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Content
      className="
        flex flex-col gap-4 overflow-hidden
        data-[state=closed]:animate-(--animate-accordion-slide-up)
        data-[state=open]:animate-(--animate-accordion-slide-down)
      "
    >
      <div className="flex flex-col gap-8 py-(--scale-24) px-4 sm:px-16">
        {menuSection.map((section) => {
          const isOpen = openSections[section._uid];

          return (
            <div key={section._uid} className="flex flex-col gap-4">
              {/* Section title (NOW CLICKABLE + ICON) */}
              <button
                onClick={() => toggleSection(section._uid)}
                className="flex w-full items-center justify-between text-sm text-white rounded-sm px-3 py-2 bg-(--surface-accent-background)"
              >
                <span>{section.title}</span>
                <Icon
                  icon="chevron-down"
                  size={18}
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Section content (TOGGLE) */}
              {isOpen && (
                <div className="flex flex-col gap-1">
                  {section.items.map((item: StoryblokNavigationInnerItem) => (
                    <Link
                      key={item._uid}
                      href={getLinkHref(item.link)}
                      className="flex items-center justify-between text-xs max-w-[337px] transition-all hover:border-[#E8E0D8] rounded-sm px-6 py-1 hover:bg-[#F6F3EF] border border-transparent"
                    >
                      <span>{item.label}</span>

                      <Icon icon="chevron-right" size={14} />
                    </Link>
                  ))}

                  {Array.isArray(section.ctaLink) &&
                  section.ctaLink.length > 0 ? (
                    <div className="flex gap-3 mt-4">
                      {section.ctaLink.map((item) => (
                        <Button
                          key={item._uid}
                          label={item.label}
                          tone={item.tone}
                          leadingIcon={item.leadingIcon}
                          url={item.url as any}
                          className="px-4! py-2! h-10!"
                        />
                      ))}
                    </div>
                  ) : null}

                  {section.bottomLinks?.length ? (
                    <div className="mb-6 mt-2 flex flex-col gap-2">
                      {section.bottomLinks.map((item) => (
                        <Button
                          key={item._uid}
                          label={item.label}
                          mode="link"
                          trailingIcon={
                            item.icon ? { icon: item.icon } : undefined
                          }
                          link={item.link as any}
                          className="[&>span]:text-[14px]! [&_svg]:w-4 [&_svg]:h-4 justify-start! items-left!"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Content>
  );
};

export default AccordionContent;
