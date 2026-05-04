"use client";

import type { FC } from "react";
import { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { twMerge } from "tailwind-merge";

export interface ResourceCardDeckBlok extends SbBlokData {
  content?: ContentBlockBlok[];
  resources?: ResourceCardProps[];
  htmlId?: string;
}

interface Props extends ResourceCardDeckBlok {
  rels?: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}

export const ResourceCardDeck: FC<Props> = ({
  content,
  resources,
  htmlId,
  rels = [],
  pagination,
  ...blok
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [input, setInput] = useState(currentSearch);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const relMap = useMemo(() => buildRelMap(rels), [rels]);
  const showFilters =
    pathname.includes("/articles") ||
    pathname.includes("/resources") ||
    pathname.includes("/insights");

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
          resolved?.tagName ||
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

    return (resources as any[]).filter((r) => {
      const matchesFilter =
        activeFilter === "all" ||
        (r?.tags || []).some((tag: any) => {
          const resolved = typeof tag === "string" ? relMap[tag] : tag;

          const name =
            resolved?.name ||
            resolved?.title ||
            resolved?.label ||
            resolved?.tagName ||
            resolved?.slug;

          return name === activeFilter;
        });

      return matchesFilter;
    });
  }, [resources, activeFilter, relMap]);

  const visibleFilters = useMemo(() => {
    if (showAllFilters) return filterOptions;
    return filterOptions.slice(0, 5);
  }, [filterOptions, showAllFilters]);

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
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (input) {
      params.set("search", input);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };
  useEffect(() => setInput(currentSearch), [currentSearch]);
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

      {showFilters && (
        <div className="border items-start border-(--stroke-secondary) p-4 sm:px-8 sm:py-4.5 lg:py-8 flex flex-col-reverse lg:flex-row gap-4 justify-between">
          <div className="flex flex-1 flex-wrap gap-3">
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
                  className={twMerge(
                    isActive
                      ? " border-(--stroke-secondary-button-hover) ring-4 ring-(--stroke-secondary-button-hover)"
                      : "",
                    "h-10!"
                  )}
                >
                  {label}
                </Button>
              );
            })}

            {filterOptions.length > 5 ? (
              <button
                onClick={() => setShowAllFilters((prev) => !prev)}
                className="px-4 py-2 cursor-pointer rounded-md border text-sm border-(--stroke-pagination) bg-white flex items-center gap-2 h-10!"
              >
               { 
                  showAllFilters ? 'Less' : 'More'
                }
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

          <div className="flex  items-center gap-1 border border-(--stroke-primary) rounded-md  bg-white w-full lg:w-[320px]!  px-1.5 py-1 h-10">
            <Icon
              size={16}
              color="var(--icon-primary-dark)"
              icon="search-lg"
              className="shrink-0"
            />

            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm w-full bg-transparent h-8"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              onClick={handleSearch}
              className="text-xs cursor-pointer h-8 px-2 rounded-xs bg-(--surface-search-button) text-white"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {filteredResources?.length ? (
        <div
          className={twMerge(
            showFilters
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-(--gaps-16-12-12)"
              : "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-(--gaps-16-12-12)"
          )}
        >
          {filteredResources?.map((resource) => (
            <ResourceCard key={resource._id} {...resource} />
          ))}
        </div>
      ) : null}

      {pagination?.totalPages && pagination.totalPages > 1 ? (
        <Pagination totalPages={pagination.totalPages} baseUrl={pathname} />
      ) : null}
    </div>
  );
};
