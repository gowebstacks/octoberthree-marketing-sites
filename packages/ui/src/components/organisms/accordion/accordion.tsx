"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { twMerge } from "tailwind-merge";
import type { SbBlokData } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react";
import { Button, Icon } from "../../atoms";
import { RichTextContent } from "../../../types/storyblok";
import { RichText } from "../../molecules/richText/richText";

type StoryblokImage = {
  id: string;
  filename: string;
  alt?: string;
};
export type AccordionItem = {
  _uid: string;
  label: string;
  body: RichTextContent;
  cta?: {
    label: string;
    href: string;
  };
  icon?: StoryblokImage;
};

export interface AccordionItemProps extends SbBlokData {
  items: AccordionItem[];
  colorMode?: "light" | "dark";
  className?: string;
}

export function AccordionItem({
  items,
  colorMode = "light",
  className,
  ...blok
}: AccordionItemProps) {
  console.log(items, "test blok in accordion");

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={twMerge("w-full", className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item._uid}
          value={item._uid}
          {...storyblokEditable(item)}
          className="group relative border-b border-(--stroke-secondary) flex flex-col gap-(--gaps-16-12-12) p-(--gaps-24-18-18)"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className="
                group flex w-full items-center justify-between gap-3 text-left
                transition-colors

                text-neutral-600

                data-[state=open]:text-(--text-headings-dark)
              "
            >
              <div className="flex items-center gap-4">
                {item?.icon?.filename && (
                  <span
                    className="
      shrink-0 transition-opacity
      opacity-50
      group-data-[state=open]:opacity-100
    "
                  >
                    <img
                      src={item.icon.filename}
                      alt={item.icon.alt || ""}
                      className="h-6 w-6 object-contain"
                    />
                  </span>
                )}

                <span className="text-display-xl">{item.label}</span>
              </div>

              <div
                className="
                cursor-pointer
    flex items-center justify-center rounded-sm p-(--padding-8-6-6) 
    transition-colors               
    bg-transparent 
                
    group-data-[state=open]:bg-(--surface-button-active)
    group-data-[state=open]:text-(--icon-on-accent)
  "
                aria-hidden
              >
                <Icon
                  size={24}
                  className="text-neutral-600 group-data-[state=open]:hidden"
                  icon="plus"
                />
                <Icon
                  size={24}
                  className="text-(--icon-button) hidden group-data-[state=open]:block"
                  icon="minus"
                />
              </div>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <div
            className="
    absolute bottom-0 left-0
    w-0
    border-b-2 border-(--stroke-secondary-button-hover)
    transition-all duration-300
    group-data-[state=open]:w-[60%]
  "
          />
          <AccordionPrimitive.Content
            className="
              overflow-hidden
              data-[state=open]:animate-accordion-down
              data-[state=closed]:animate-accordion-up
            "
          >
            <div
              {...storyblokEditable(item as any)}
              data-blok-field="content"
              className=" text-(--text-body-dark) text-sm flex flex-col gap-(--gaps-16-12-12)"
            >
              <RichText doc={item.body} />

              {/* {item.cta && (
                <Button
                  mode="link"
                  label={item.cta.label}
                  href={item.cta.href}
                  className="w-fit"
                />
              )} */}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
