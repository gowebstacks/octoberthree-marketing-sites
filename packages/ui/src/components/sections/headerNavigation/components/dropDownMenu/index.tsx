"use client";

import { FC } from "react";
import { StoryblokNavigationMenuItem } from "../../../../../types/storyblok";
import { getLinkHref } from "../../../../../utils/getLinkHref";
import { Button, Icon, Link } from "../../../../atoms";
import CTABar from "../../../../modules/ctaBar";
import { twMerge } from "tailwind-merge";

const RIGHT_COUNT = 4;

const DropDownMenu: FC<StoryblokNavigationMenuItem> = ({ menuSection }) => {
  if (!menuSection?.length) return null;

  const section = menuSection[0];

  const items = section.items || [];
  const leftItems = items.slice(0, RIGHT_COUNT);
  const rightItems = items.slice(RIGHT_COUNT);

  return (
    <div
      className={twMerge(
        "rounded-sm bg-white shadow-md p-6",
        rightItems.length > 0 ? "w-152" : ""
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-mono-sm whitespace-nowrap uppercase tracking-wide text-(--text-nav-item-dark) mr-8">
          {section.title}
        </p>

        {Array.isArray(section.ctaLink) && section.ctaLink.length > 0 ? (
          <div className="flex gap-3">
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
      </div>

      <div
        className={twMerge(
          "grid  gap-x-4 gap-y-4 min-w-68 py-6 border-t border-b border-(--color-cream-50---p-background)",
          rightItems.length > 0 ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        <div className="flex flex-col gap-1 ">
          {leftItems.map((item) => (
            <Link
              key={item._uid}
              href={getLinkHref(item.link)}
              className="flex group items-center justify-between text-xs transition-all hover:border-[#E8E0D8] rounded-sm px-6 py-1 hover:bg-[#F6F3EF] border border-transparent"
            >
              <span className="flex-1">{item.label}</span>

              <Icon
                icon="chevron-right"
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </div>

        {rightItems.length > 0 ? (
          <div className="flex flex-col gap-1 ">
            {rightItems.map((item) => (
              <Link
                key={item._uid}
                href={getLinkHref(item.link)}
                className="flex group items-center justify-between text-xs transition-all hover:border-[#E8E0D8] rounded-sm px-6 py-1 hover:bg-[#F6F3EF] border border-transparent"
              >
                <span className="flex-1">{item.label}</span>

                <Icon
                  icon="chevron-right"
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>

      {section.bottomLinks?.length ? (
        <div className=" mt-4 flex flex-col gap-2">
          {section.bottomLinks.map((item) => (
            <Button
              key={item._uid}
              label={item.label}
              mode="link"
              trailingIcon={item.icon}
              link={item.link as any}
              className="[&>span]:text-[14px]! [&_svg]:w-4 [&_svg]:h-4"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default DropDownMenu;
