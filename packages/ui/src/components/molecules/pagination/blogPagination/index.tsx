import { FC } from "react";
import { Button } from "../../../atoms";

// Custom pagination component with page numbers
export const BlogPagination: FC<{
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  }> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    // Generate array of page numbers to display
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      // Always show first page
      pages.push(1);
  
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
  
      // Handle edge cases
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
      }
  
      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pages.push('…');
      }
  
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pages.push('…');
      }
  
      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
  
      return pages;
    };
  
    return (
      <div className="flex w-full items-center justify-between gap-4  md:gap-8">
        <Button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          mode="link"
          size="sm"
          leadingIcon={{icon : 'arrow-leftt'}}
          disabled={currentPage === 1}
        >
          <span >Back</span>
        </Button>
  
        <div className="flex items-center gap-3 md:flex!">
          <span className="text-sm font-medium text-(--text-link) md:hidden">
            Page {currentPage} of {totalPages}
          </span>
  
          <div className="hidden items-center gap-3 md:flex!">
            {getPageNumbers().map((page, index) => {
              // Skip rendering ellipsis as a separate element
              if (page === '…') {
                return (
                  <span key={index} className="px-1 text-sm text-gray-500">
                    …
                  </span>
                );
              }
  
              return (
                <button
                  key={index}
                  className={`flex focus:focus-primary size-10 cursor-pointer items-center justify-center rounded-md border text-md font-semibold transition-all ${
                    page === currentPage
                      ? 'border-(--stroke-secondary-button-hover) bg-(--surface-pagination) text-button-secondary'
                      : 'border-(--stroke-pagination) text-body hover:bg-(--surface-pagination) '
                  }`}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
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
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          mode="link"
          tone="primary"
          size="sm"
          trailingIcon={{icon : 'arrow-right'}}
          disabled={currentPage === totalPages}
        >
          <span>Next</span>
        </Button>
      </div>
    );
  };
