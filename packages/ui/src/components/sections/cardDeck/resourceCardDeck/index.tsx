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
import { Button, Icon } from "../../../atoms";
import { twMerge } from "tailwind-merge";

export interface ResourceCardDeckBlok extends SbBlokData {
  content?: ContentBlockBlok[];
  resources?: ResourceCardProps[];
  htmlId?: string;
}

interface Props extends ResourceCardDeckBlok {
  rels?: any[];
  categories?: any[];

  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}

export const ResourceCardDeck: FC<Props> = ({
  content,
  resources,
  htmlId,
  pagination,
  categories,
  ...blok
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [input, setInput] = useState(currentSearch);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const activeFilter = searchParams.get("category") || "all";

  const showFilters =
    pathname.includes("/articles") ||
    pathname.includes("/resources") ||
    pathname.includes("/insights");

  const filterOptions = useMemo(() => {
    if (!showFilters || !categories?.length) {
      return [
        {
          label: "All",
          value: "all",
        },
      ];
    }

    return [
      {
        label: "All",
        value: "all",
      },

      ...categories.map((category: any) => ({
        label: category?.content?.name || category?.name || category?.slug,

        value: category?.slug,
      })),
    ];
  }, [categories, showFilters]);

  const visibleFilters = useMemo(() => {
    if (showAllFilters) return filterOptions;

    return filterOptions.slice(0, 5);
  }, [filterOptions, showAllFilters]);

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
              const isActive = activeFilter === option.value;

              return (
                <Button
                  key={option.value}
                  trailingIcon={{ icon: "None" }}
                  tone="secondary"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());

                    if (option.value === "all") {
                      params.delete("category");
                    } else {
                      params.set("category", option.value);
                    }

                    params.set("page", "1");

                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className={twMerge(
                    isActive
                      ? "border-(--stroke-secondary-button-hover) ring-4 ring-(--stroke-secondary-button-hover)"
                      : "",
                    "h-10!"
                  )}
                >
                  {option.label}
                </Button>
              );
            })}

            {filterOptions.length > 5 ? (
              <button
                onClick={() => setShowAllFilters((prev) => !prev)}
                className="px-4 py-2 cursor-pointer rounded-md border text-sm border-(--stroke-pagination) bg-white flex items-center gap-2 h-10!"
              >
                {showAllFilters ? "Less" : "More"}
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

            {input && (
              <button
                onClick={() => {
                  setInput("");

                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  params.set("page", "1");

                  router.push(`${pathname}?${params.toString()}`);
                }}
                className="flex cursor-pointer items-center justify-center w-8 h-8 text-sm text-(--text-secondary) hover:text-(--text-primary)"
                aria-label="Clear search"
              >
                <Icon strokeWidth={2} icon="x"/>
              </button>
            )}

            <button
              onClick={handleSearch}
              className="text-xs cursor-pointer h-8 px-2 rounded-xs bg-(--surface-search-button) text-white"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {resources?.length ? (
        <div
          className={twMerge(
            showFilters
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-(--gaps-16-12-12)"
              : "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-(--gaps-16-12-12)"
          )}
        >
          {resources?.map((resource) => (
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
