/**
 * Pagination utility functions for calculating page-related values.
 * Default page size is 20 items (used by Provider Network page).
 */

export const DEFAULT_PAGE_SIZE = 20;

export interface PaginationResult {
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Calculates the total number of pages for a given item count and page size.
 */
export function calculateTotalPages(totalItems: number, pageSize: number = DEFAULT_PAGE_SIZE): number {
  if (totalItems <= 0) return 0;
  return Math.ceil(totalItems / pageSize);
}

/**
 * Calculates the start index (0-based) for a given page number.
 * Page numbers are 1-based.
 */
export function calculateStartIndex(page: number, pageSize: number = DEFAULT_PAGE_SIZE): number {
  return (page - 1) * pageSize;
}

/**
 * Calculates the end index (exclusive) for a given page number and total items.
 * Page numbers are 1-based.
 */
export function calculateEndIndex(page: number, totalItems: number, pageSize: number = DEFAULT_PAGE_SIZE): number {
  return Math.min(page * pageSize, totalItems);
}

/**
 * Calculates all pagination values for a given page, total items, and page size.
 */
export function calculatePagination(
  page: number,
  totalItems: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): PaginationResult {
  return {
    totalPages: calculateTotalPages(totalItems, pageSize),
    startIndex: calculateStartIndex(page, pageSize),
    endIndex: calculateEndIndex(page, totalItems, pageSize),
  };
}
