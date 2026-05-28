import { useState, useMemo, useCallback } from 'react';
import type { Provider, ProviderFilters, SortOption } from '../types/provider';
import { filterProviders } from '../utils/filters';
import {
  sortProvidersByDistance,
  sortProvidersByName,
  sortProvidersBySpecialty,
  sortProvidersByCity,
  sortProvidersByNeighborhood,
} from '../utils/distance';
import { usePagination } from './usePagination';
import { DEFAULT_PAGE_SIZE } from '../utils/pagination';

export interface UseProviderSearchOptions {
  providers: Provider[];
  userLocation?: { lat: number; lng: number } | null;
}

export interface UseProviderSearchReturn {
  results: Provider[];
  totalResults: number;
  filters: ProviderFilters;
  setFilters: (filters: Partial<ProviderFilters>) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

/**
 * Combines multi-criteria filtering, sorting (5 options), distance calculation,
 * and pagination for the Provider Network page.
 *
 * Default sort: alphabetical when no user location, proximity when user location is available.
 * When filters change, resets to page 1.
 */
export function useProviderSearch(options: UseProviderSearchOptions): UseProviderSearchReturn {
  const { providers, userLocation } = options;

  // Default sort depends on whether user location is available
  const defaultSort: SortOption = userLocation ? 'proximity' : 'alphabetical';

  const [filters, setFiltersState] = useState<ProviderFilters>({});
  const [sortBy, setSortByState] = useState<SortOption>(defaultSort);

  // Apply multi-criteria filtering
  const filteredProviders = useMemo(
    () => filterProviders(providers, filters),
    [providers, filters]
  );

  // Apply sorting to filtered results
  const sortedProviders = useMemo(() => {
    switch (sortBy) {
      case 'proximity':
        if (userLocation) {
          return sortProvidersByDistance(filteredProviders, userLocation.lat, userLocation.lng);
        }
        // Fallback to alphabetical if no user location
        return sortProvidersByName(filteredProviders);
      case 'alphabetical':
        return sortProvidersByName(filteredProviders);
      case 'specialty':
        return sortProvidersBySpecialty(filteredProviders);
      case 'city':
        return sortProvidersByCity(filteredProviders);
      case 'neighborhood':
        return sortProvidersByNeighborhood(filteredProviders);
      default:
        return filteredProviders;
    }
  }, [filteredProviders, sortBy, userLocation]);

  // Pagination (20 items per page)
  const totalResults = sortedProviders.length;
  const pagination = usePagination(totalResults, DEFAULT_PAGE_SIZE);

  // Paginated results
  const results = useMemo(
    () => sortedProviders.slice(pagination.startIndex, pagination.endIndex),
    [sortedProviders, pagination.startIndex, pagination.endIndex]
  );

  // When filters change, reset to page 1
  const setFilters = useCallback(
    (newFilters: Partial<ProviderFilters>) => {
      setFiltersState((prev) => ({ ...prev, ...newFilters }));
      pagination.goToPage(1);
    },
    [pagination]
  );

  const setSortBy = useCallback(
    (sort: SortOption) => {
      setSortByState(sort);
      pagination.goToPage(1);
    },
    [pagination]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      pagination.goToPage(page);
    },
    [pagination]
  );

  return {
    results,
    totalResults,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    currentPage: pagination.currentPage,
    setCurrentPage,
    totalPages: pagination.totalPages,
  };
}
