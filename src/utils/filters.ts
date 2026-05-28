import type { Provider, ProviderFilters, Specialty, PlanType, ProviderType } from '../types/provider';
import { haversineDistance } from './distance';

/**
 * Generic case-insensitive substring filter.
 * Used for accordion search on waiting periods pages.
 *
 * @param items - Array of items to filter
 * @param searchQuery - The search string to match
 * @param getText - Function to extract the text to search from each item
 * @returns Filtered array containing only items whose text includes the search query
 */
export function filterBySubstring<T>(
  items: T[],
  searchQuery: string,
  getText: (item: T) => string
): T[] {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return items;
  }

  const normalizedQuery = searchQuery.toLowerCase().trim();

  return items.filter((item) => {
    const text = getText(item).toLowerCase();
    return text.includes(normalizedQuery);
  });
}

/**
 * Filters providers based on multiple criteria.
 * All active filters are applied as AND conditions.
 *
 * @param providers - Array of providers to filter
 * @param filters - Filter criteria to apply
 * @returns Filtered array of providers matching all active criteria
 */
export function filterProviders(
  providers: Provider[],
  filters: ProviderFilters
): Provider[] {
  let result = [...providers];

  // Filter by search query (matches name, specialty, or address)
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const query = filters.searchQuery.toLowerCase().trim();
    result = result.filter((provider) => {
      const nameMatch = provider.name.toLowerCase().includes(query);
      const specialtyMatch = provider.specialties.some((s) =>
        s.toLowerCase().includes(query)
      );
      const cityMatch = provider.address.city.toLowerCase().includes(query);
      const neighborhoodMatch = provider.address.neighborhood.toLowerCase().includes(query);
      return nameMatch || specialtyMatch || cityMatch || neighborhoodMatch;
    });
  }

  // Filter by specialty
  if (filters.specialty) {
    const specialty: Specialty = filters.specialty;
    result = result.filter((provider) =>
      provider.specialties.includes(specialty)
    );
  }

  // Filter by plan
  if (filters.plan) {
    const plan: PlanType = filters.plan;
    result = result.filter((provider) =>
      provider.acceptedPlans.includes(plan)
    );
  }

  // Filter by provider type
  if (filters.providerType) {
    const providerType: ProviderType = filters.providerType;
    result = result.filter((provider) => provider.type === providerType);
  }

  // Filter by city
  if (filters.city && filters.city.trim().length > 0) {
    const city = filters.city.toLowerCase().trim();
    result = result.filter((provider) =>
      provider.address.city.toLowerCase().includes(city)
    );
  }

  // Filter by neighborhood
  if (filters.neighborhood && filters.neighborhood.trim().length > 0) {
    const neighborhood = filters.neighborhood.toLowerCase().trim();
    result = result.filter((provider) =>
      provider.address.neighborhood.toLowerCase().includes(neighborhood)
    );
  }

  // Filter by radius from user location
  if (filters.userLocation) {
    const radiusKm = filters.radiusKm ?? 10;
    result = result.filter((provider) => {
      const distance = haversineDistance(
        filters.userLocation!.lat,
        filters.userLocation!.lng,
        provider.coordinates.lat,
        provider.coordinates.lng
      );
      return distance <= radiusKm;
    });
  }

  return result;
}
