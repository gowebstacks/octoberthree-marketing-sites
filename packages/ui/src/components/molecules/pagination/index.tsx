"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { twMerge } from "tailwind-merge";

import type { FC } from "react";
import { Button } from "../../atoms";

interface PaginationProps {
  totalPages: number;
  baseUrl?: string;
}

const Pagination: FC<PaginationProps> = ({ totalPages, baseUrl }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const searchParam = useSearchParams();

  useEffect(() => {
    setCurrentPage(Number(searchParam.get("page")) || 1);
  }, [searchParam]);

 const handlePage = (page: number) => {
  const params = new URLSearchParams(searchParam.toString());

  params.set("page", String(page));

  router.push(`${baseUrl || '/'}?${params.toString()}`, {
    scroll: false,
  });
};

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = 4;
    }

    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };
  useEffect(() => {
  const nextPage = currentPage + 1;

  if (nextPage <= totalPages) {
    router.prefetch(`${baseUrl || '/'}?page=${nextPage}`);
  }
}, [currentPage, totalPages, router, baseUrl]);
  return (
    <div className="flex w-full items-center justify-between gap-4 md:gap-8">
      <Button
        mode="link"
        size="sm"
        leadingIcon={{icon : "chevron-left"}}
        disabled={currentPage === 1}
        onClick={() => handlePage(currentPage - 1)}
      >
        <span>Back</span>
      </Button>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-(--text-link) md:hidden">
          Page {currentPage} of {totalPages}
        </span>

        <div className="hidden items-center gap-3 md:flex!">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={`page-${page}`}
                className={twMerge(
                  "flex focus:focus-primary size-10 cursor-pointer items-center justify-center rounded-md border text-md font-semibold transition-all",
                  page === currentPage
                    ? "border-(--stroke-secondary-button-hover) bg-(--surface-pagination) text-button-secondary"
                    : "border-(--stroke-pagination) text-body hover:bg-(--surface-pagination)"
                )}
                onClick={() => handlePage(page as number)}
                aria-current={page === currentPage ? "page" : undefined}
                
              >
                <span className="text-(--text-link) text-sm font-medium mt-0.5">
                  {page}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        mode="link"
        tone="primary"
        size="sm"
        trailingIcon={{icon : "chevron-right"}}
        disabled={currentPage === totalPages}
        onClick={() => handlePage(currentPage + 1)}
      >
        <span>Next</span>
      </Button>
    </div>
  );
};

export default Pagination;
