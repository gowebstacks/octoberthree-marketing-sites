"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { twMerge } from "tailwind-merge";
import type { SbBlokData } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react";
import { Button, Icon } from "../../atoms";
import { RichTextContent } from "../../../types/storyblok";
import { RichText } from "../../molecules/richText/richText";
import { useEffect, useMemo, useState } from "react";

type StoryblokImage = {
  id: string;
  filename: string;
  alt?: string;
};

export type AccordionItemType = {
  _uid: string;
  label: string;
  body: RichTextContent;
  icon?: StoryblokImage;
  button?: any[];
};

export interface AccordionItemProps extends SbBlokData {
  items: AccordionItemType[];
  colorMode?: "light" | "dark";
  className?: string;
}

function extractText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (node.text) return node.text;
  if (node.content) return extractText(node.content);
  return "";
}

function getReadingDuration(text: string) {
  if (!text) return 4000;
  const words = text.trim().split(/\s+/).length;
  const wpm = 220;
  const ms = (words / wpm) * 60000;
  return ms < 3000 ? 3000 : ms;
}

export function AccordionItem({
  items,
  colorMode = "light",
  className,
  ...blok
}: AccordionItemProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const durations = useMemo(
    () =>
      items.map((item) =>
        item?.body ? getReadingDuration(extractText(item.body)) : 4000
      ),
    [items]
  );

  const value =
    activeIndex !== null && items[activeIndex]
      ? items[activeIndex]._uid
      : "";

  useEffect(() => {
    if (activeIndex === null || !items.length) return;
    const timeout = setTimeout(() => {
      setActiveIndex((prev) =>
        prev === null ? 0 : (prev + 1) % items.length
      );
    }, durations[activeIndex] || 4000);
    return () => clearTimeout(timeout);
  }, [activeIndex, durations, items.length]);

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      value={value}
      onValueChange={(val) => {
        if (!val) {
          setActiveIndex(null);
          return;
        }
        const index = items.findIndex((i) => i._uid === val);
        if (index !== -1) setActiveIndex(index);
      }}
      className={twMerge("w-full", className)}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const duration = durations[index] || 4000;

        return (
          <AccordionPrimitive.Item
            key={item._uid}
            value={item._uid}
            {...storyblokEditable(item)}
            className="group relative border-b border-(--stroke-secondary) flex flex-col gap-(--gaps-16-12-12) p-(--gaps-24-18-18)"
          >
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger
                className="group flex w-full items-center justify-between gap-3 text-left transition-colors text-neutral-600 data-[state=open]:text-(--text-headings-dark)"
              >
                <div className="flex items-center gap-4">
                  {item?.icon?.filename && (
                    <span className="shrink-0 transition-opacity opacity-50 group-data-[state=open]:opacity-100">
                      <img
                        src={item.icon.filename}
                        alt={item.icon.alt || ""}
                        className="h-6 w-6 object-contain"
                        loading="lazy"
                      />
                    </span>
                  )}
                  <span className="text-display-xl">{item.label}</span>
                </div>

                <div className="flex items-center justify-center rounded-sm p-(--padding-8-6-6) transition-colors bg-transparent group-data-[state=open]:bg-(--surface-button-active)">
                  <Icon
                    size={24}
                    className="text-neutral-600 group-data-[state=open]:hidden"
                    icon="plus"
                  />
                  <Icon
                    size={24}
                    className="hidden group-data-[state=open]:block"
                    icon="minus"
                  />
                </div>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>

            <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
              {isActive && activeIndex !== null && (
                <div
                  key={activeIndex}
                  className="h-full bg-(--stroke-secondary-button-hover) origin-left"
                  style={{
                    animation: `progressBar ${duration}ms linear forwards`,
                  }}
                />
              )}
            </div>

            <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:accordion-down data-[state=closed]:accordion-up">
              <div
                {...storyblokEditable(item as any)}
                data-blok-field="content"
                className="text-(--text-body-dark) text-sm flex flex-col gap-(--gaps-16-12-12)"
              >
                <RichText doc={item.body} />
              </div>

              {item.button?.[0] && (
                <div className="mt-8">
                  <Button {...item.button[0]} mode="link" />
                </div>
              )}
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
      })}

      <style jsx>{`
        @keyframes progressBar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </AccordionPrimitive.Root>
  );
}