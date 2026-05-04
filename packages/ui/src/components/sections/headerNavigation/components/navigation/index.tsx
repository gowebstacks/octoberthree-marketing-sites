"use client";

import {
  Content,
  Item,
  List,
  Root,
  Trigger,
} from "@radix-ui/react-navigation-menu";
import { Fragment, useEffect, useRef, useState, type FC } from "react";
import { usePathname } from "next/navigation";

import { StoryblokNavigationMenuItem } from "../../../../../types/storyblok";
import DropDownMenu from "../dropDownMenu";
import { Icon } from "../../../../atoms";
import { getLinkHref } from "../../../../../utils/getLinkHref";

interface NavigationProps {
  menuItems?: StoryblokNavigationMenuItem[];
}

const MenuItemWithDropdown: FC<
  StoryblokNavigationMenuItem & {
    onClose: () => void;
  }
> = (item) => {
  const { link, label, menuSection, _uid, onClose } = item;
  const hasDropdown = menuSection && menuSection.length > 0;

  return (
    <Item value={_uid} className="relative">
      <Trigger asChild>
        <button
          className="
            group flex cursor-pointer items-center gap-1.5 
            text-(--text-headings) text-sm
            data-[state=open]:font-medium data-[state=open]:bg-(--color-cream-50---p-background)
            rounded-sm px-3 py-2 hover:bg-(--color-cream-50---p-background)
          "
        >
          {label || link?.label}
          {hasDropdown && (
            <Icon
              icon="chevron-down"
              size={20}
              className="
                mt-0.5 transition-transform duration-200
                group-data-[state=open]:rotate-180
              "
            />
          )}
        </button>
      </Trigger>

      {hasDropdown && (
        <Content
          forceMount
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          className="
      absolute left-0 top-full z-50 mt-4
      pointer-events-auto
      origin-top

      data-[state=open]:opacity-100
      data-[state=open]:translate-y-0

      data-[state=closed]:opacity-0
      data-[state=closed]:-translate-y-2

      transition-all duration-300 ease-in-out
    "
        >
          <div className="absolute inset-x-0 -top-4 h-4" />
          <DropDownMenu {...item} />
        </Content>
      )}
    </Item>
  );
};

const Navigation: FC<NavigationProps> = ({ menuItems }) => {
  const [value, setValue] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setValue("");
  }, [pathname]);
  return (
    <Root
      className="relative w-fit"
      value={value}
      onValueChange={setValue}
      delayDuration={120}
      skipDelayDuration={300}
    >
      <List className="hidden items-center gap-5 xl:flex lg:gap- lg:justify-center">
        {menuItems?.map((item) => (
          <Fragment key={item._uid}>
            {item.menuSection?.length ? (
              <MenuItemWithDropdown {...item} onClose={() => setValue("")} />
            ) : (
              <Item value={item._uid} asChild>
                <a
                  href={getLinkHref(item.link)}
                  className="text-sm rounded-sm px-3 py-2 hover:bg-(--color-cream-50---p-background) font-medium text-(--text-headings) transition-colors hover:text-primary"
                >
                  {item.label || item.link?.label}
                </a>
              </Item>
            )}
          </Fragment>
        ))}
      </List>
    </Root>
  );
};

export default Navigation;
