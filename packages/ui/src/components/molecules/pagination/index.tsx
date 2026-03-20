'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import type { FC } from 'react'
import { Button } from '../../atoms';

interface PaginationProps {
  totalPages: number;
  baseUrl?: string;
}

const Pagination:FC<PaginationProps> = ({ totalPages, baseUrl }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter();
  const searchParam = useSearchParams();

  useEffect(() => {
    setCurrentPage(Number(searchParam.get('page')) || 1)
  }, [searchParam]);

  const handlePage = (page: number) => {
    setCurrentPage(page)
    router.push(`${baseUrl || '/'}?page=${page}`, { scroll: false })
  }

  return (
    <div className="flex w-full items-center justify-between gap-4 md:gap-8">
      <Button
        mode="link"
        size="sm"
        leadingIcon="chevron-left"
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
          {Array(totalPages).fill(null).map((_, index) => (
            <button
              key={`page-item-${index + 1}`}
              className={twMerge(
                'flex focus:focus-primary focus:border-3 focus:bg-transparent size-10 cursor-pointer items-center justify-center rounded-md border text-md font-semibold transition-all',
                index + 1 === currentPage
                  ? 'border-(--stroke-secondary-button-hover) bg-(--surface-pagination) text-button-secondary'
                  : 'border-(--stroke-pagination) text-body hover:bg-(--surface-pagination)'
              )}
              onClick={() => handlePage(index + 1)}
              aria-current={index + 1 === currentPage ? 'page' : undefined}
            >
              <span className="text-(--text-link) text-sm font-medium mt-0.5">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button
        mode="link"
        tone="primary"
        size="sm"
        trailingIcon="chevron-right"
        disabled={currentPage === totalPages}
        onClick={() => handlePage(currentPage + 1)}
      >
        <span>Next</span>
      </Button>
    </div>
  )
}

export default Pagination;
