import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  calculateTotalPages,
  calculateStartIndex,
  calculateEndIndex,
  DEFAULT_PAGE_SIZE,
} from '../utils/pagination';

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  startIndex: number;
  endIndex: number;
}

/**
 * Generic pagination hook.
 * Computes pagination state and provides navigation functions.
 *
 * @param totalItems - Total number of items to paginate
 * @param itemsPerPage - Number of items per page (default: 20)
 * @returns Pagination state and navigation helpers
 */
export function usePagination(
  totalItems: number,
  itemsPerPage: number = DEFAULT_PAGE_SIZE
): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => calculateTotalPages(totalItems, itemsPerPage),
    [totalItems, itemsPerPage]
  );

  // Reset to page 1 when totalItems changes
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.min(Math.max(1, page), Math.max(1, totalPages));
      setCurrentPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.max(1, totalPages)));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const startIndex = useMemo(
    () => calculateStartIndex(currentPage, itemsPerPage),
    [currentPage, itemsPerPage]
  );

  const endIndex = useMemo(
    () => calculateEndIndex(currentPage, totalItems, itemsPerPage),
    [currentPage, totalItems, itemsPerPage]
  );

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
  };
}
