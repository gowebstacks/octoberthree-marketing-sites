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


export interface ResourceCardDeckBlok extends SbBlokData {
  content?: ContentBlockBlok[];
  resources?: ResourceCardProps[];
  htmlId?: string;
}

const ITEMS_PER_PAGE = 6;

export const ResourceCardDeck: FC<ResourceCardDeckBlok> = ({
  content,
  resources,
  htmlId,
  ...blok
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    if (activeFilter === "all") return resources;
    return resources.filter((r: any) =>
  (r.tags || []).includes(activeFilter)
);
  }, [resources, activeFilter]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const filterOptions = useMemo(() => {
  if (!resources) return [];
  const tags = resources
    .flatMap((r: any) => r.tags || [])
    .filter(Boolean);

  const uniqueTags = Array.from(new Set(tags));

  return ["all", ...uniqueTags];
}, [resources]);

  const visibleFilters = useMemo(() => {
    if (showAllFilters) return filterOptions;
    return filterOptions.slice(0, 5);
  }, [filterOptions, showAllFilters]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setActiveFilter("all");
    }
  }, [currentPage, totalPages]);

  return (
    <div
      {...storyblokEditable(blok)}
      id={htmlId}
      className="flex max-w-(--widths-1440-834-375) mx-auto flex-col gap-12 sm:gap-16"
    >
      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>
      ) : null}

      {filterOptions.length > 1 ? (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-3">
            {visibleFilters.map((option) => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`px-4 py-2 rounded-md border text-sm ${
                  activeFilter === option
                    ? "bg-(--surface-pagination) border-(--stroke-secondary-button-hover)"
                    : "border-(--stroke-pagination) bg-white"
                }`}
              >
                {option}
              </button>
            ))}

            {filterOptions.length > 5 ? (
              <button
                onClick={() => setShowAllFilters((prev) => !prev)}
                className="px-4 py-2 rounded-md border text-sm border-(--stroke-pagination) bg-white flex items-center gap-2"
              >
                More
                <span className={`transition-transform ${showAllFilters ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2 border rounded-md px-4 py-2 w-full sm:w-[320px] bg-white">
            <input
              type="text"
              placeholder="type your question"
              className="outline-none text-sm w-full bg-transparent"
            />
            <button className="text-sm font-medium px-3 py-1 rounded bg-(--surface-pagination)">
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

      {totalPages > 1 ? <Pagination totalPages={totalPages} baseUrl={pathname} /> : null}
    </div>
  );
};