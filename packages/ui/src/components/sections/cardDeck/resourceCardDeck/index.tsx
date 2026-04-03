"use client";

import type { FC } from "react";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";

import {
  ContentBlock,
  ContentBlockBlok,
  ResourceCard,
  ResourceCardProps,
} from "../../../organisms";
import { Pagination } from "../../../molecules";
import { buildRelMap } from "../../../../utils";
import { Button, Icon } from "../../../atoms";

export interface ResourceCardDeckBlok extends SbBlokData {
  content?: ContentBlockBlok[];
  resources?: ResourceCardProps[];
  htmlId?: string;
}

interface Props extends ResourceCardDeckBlok {
  rels?: any[];
}

const ITEMS_PER_PAGE = 1000;

export const ResourceCardDeck: FC<Props> = ({
  content,
  resources,
  htmlId,
  rels = [],
  ...blok
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const relMap = useMemo(() => buildRelMap(rels), [rels]);

  const tagNameMap = useMemo(() => {
    const map: Record<string, string> = {};

    if (!resources) return map;

    for (const r of resources as any[]) {
      const tags = r?.tags || [];

      for (const tag of tags) {
        const resolved = typeof tag === "string" ? relMap[tag] : tag;

        const name =
          resolved?.name ||
          resolved?.title ||
          resolved?.label ||
          resolved?.slug;

        if (name) {
          map[name] = name;
        }
      }
    }

    return map;
  }, [resources, relMap]);

  const filterOptions = useMemo(() => {
    const keys = Object.keys(tagNameMap);
    return keys.length ? ["all", ...keys] : ["all"];
  }, [tagNameMap]);

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    if (activeFilter === "all") return resources;

    return (resources as any[]).filter((r) => {
      const tags = r?.tags || [];

      for (const tag of tags) {
        const resolved = typeof tag === "string" ? relMap[tag] : tag;

        const name =
          resolved?.name ||
          resolved?.title ||
          resolved?.label ||
          resolved?.slug;

        if (name === activeFilter) return true;
      }

      return false;
    });
  }, [resources, activeFilter, relMap]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const visibleFilters = useMemo(() => {
    if (showAllFilters) return filterOptions;
    return filterOptions.slice(0, 5);
  }, [filterOptions, showAllFilters]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setActiveFilter("all");
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!resources) {
      
      return;
    }

    resources.forEach((r: any, i: number) => {

      (r?.tags || []).forEach((tag: any, j: number) => {
        const resolved = typeof tag === "string" ? relMap[tag] : tag;
      });
    });
  }, [resources, rels, relMap]);

  return (
    <div
      {...storyblokEditable(blok)}
      id={htmlId}
      className="flex max-w-360 mx-auto flex-col gap-12 sm:gap-16"
    >
      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>
      ) : null}

      {filterOptions.length > 1 ? (
        <div className="border border-(--stroke-secondary) p-4 sm:px-8 sm:py-4.5 lg:py-8 flex flex-col-reverse lg:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-3">
            {visibleFilters.map((option) => {
              const isActive = activeFilter === option;

              const label =
                option === "all"
                  ? "All"
                  : option.charAt(0).toUpperCase() + option.slice(1);

              return (
                <Button
                  key={option}
                  trailingIcon="None"
                  tone="secondary"
                  onClick={() => setActiveFilter(option)}
                  className={
                    isActive
                      ? " border-(--stroke-secondary-button-hover) ring-4 ring-(--stroke-secondary-button-hover)"
                      : ""
                  }
                >
                  {label}
                </Button>
              );
            })}

            {filterOptions.length > 5 ? (
              <button
                onClick={() => setShowAllFilters((prev) => !prev)}
                className="px-4 py-2 rounded-md border text-sm border-(--stroke-pagination) bg-white flex items-center gap-2"
              >
                More
                <span
                  className={`transition-transform ${
                    showAllFilters ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-1 border border-(--stroke-primary) rounded-md  bg-white lg:w-[320px] w-full px-1.5 py-1">
            <Icon size={16} color="var(--icon-primary-dark)" icon="search-lg" className="shrink-0" />

            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm w-full bg-transparent h-8"
            />

            <button className="text-xs h-8 px-2 rounded-xs bg-(--surface-search-button) text-white">
              Search
            </button>
          </div>
        </div>
      ) : null}

      {paginatedResources.length ? (
        <div
          className="
          grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] 
          gap-y-(--gaps-56-48-48)
          gap-x-(--gaps-16-12-12)
        "
        >
          {paginatedResources.map((resource) => (
            <ResourceCard key={resource._id} {...resource} />
          ))}
        </div>
      ) : null}

      {/* {totalPages > 1 ? (
        <Pagination totalPages={totalPages} baseUrl={pathname} />
      ) : null} */}
    </div>
  );
};
