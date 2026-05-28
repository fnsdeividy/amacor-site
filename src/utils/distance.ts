import type { Provider } from '../types/provider';

/**
 * Earth's radius in kilometers.
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Converts degrees to radians.
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates the Haversine distance between two geographic points.
 * Returns the distance in kilometers.
 *
 * @param lat1 - Latitude of point 1 in degrees
 * @param lng1 - Longitude of point 1 in degrees
 * @param lat2 - Latitude of point 2 in degrees
 * @param lng2 - Longitude of point 2 in degrees
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates the distance from a center point to a provider.
 * Returns the distance in kilometers.
 */
export function distanceToProvider(
  centerLat: number,
  centerLng: number,
  provider: Provider
): number {
  return haversineDistance(
    centerLat,
    centerLng,
    provider.coordinates.lat,
    provider.coordinates.lng
  );
}

/**
 * Filters providers within a given radius from a center point.
 *
 * @param providers - Array of providers to filter
 * @param centerLat - Latitude of the center point
 * @param centerLng - Longitude of the center point
 * @param radiusKm - Maximum distance in kilometers (default: 10)
 * @returns Array of providers within the specified radius
 */
export function filterProvidersByRadius(
  providers: Provider[],
  centerLat: number,
  centerLng: number,
  radiusKm: number = 10
): Provider[] {
  return providers.filter((provider) => {
    const distance = haversineDistance(
      centerLat,
      centerLng,
      provider.coordinates.lat,
      provider.coordinates.lng
    );
    return distance <= radiusKm;
  });
}

/**
 * Sorts providers by distance from a center point (nearest first).
 *
 * @param providers - Array of providers to sort
 * @param centerLat - Latitude of the center point
 * @param centerLng - Longitude of the center point
 * @returns New array of providers sorted by proximity
 */
export function sortProvidersByDistance(
  providers: Provider[],
  centerLat: number,
  centerLng: number
): Provider[] {
  return [...providers].sort((a, b) => {
    const distA = haversineDistance(centerLat, centerLng, a.coordinates.lat, a.coordinates.lng);
    const distB = haversineDistance(centerLat, centerLng, b.coordinates.lat, b.coordinates.lng);
    return distA - distB;
  });
}

/**
 * Sorts providers alphabetically by name (A-Z).
 *
 * @param providers - Array of providers to sort
 * @returns New array of providers sorted alphabetically by name
 */
export function sortProvidersByName(providers: Provider[]): Provider[] {
  return [...providers].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sorts providers alphabetically by their first specialty.
 *
 * @param providers - Array of providers to sort
 * @returns New array of providers sorted by first specialty alphabetically
 */
export function sortProvidersBySpecialty(providers: Provider[]): Provider[] {
  return [...providers].sort((a, b) => {
    const specA = a.specialties.length > 0 ? a.specialties[0] : '';
    const specB = b.specialties.length > 0 ? b.specialties[0] : '';
    return specA.localeCompare(specB);
  });
}

/**
 * Sorts providers alphabetically by city.
 *
 * @param providers - Array of providers to sort
 * @returns New array of providers sorted by city alphabetically
 */
export function sortProvidersByCity(providers: Provider[]): Provider[] {
  return [...providers].sort((a, b) =>
    a.address.city.localeCompare(b.address.city)
  );
}

/**
 * Sorts providers alphabetically by neighborhood.
 *
 * @param providers - Array of providers to sort
 * @returns New array of providers sorted by neighborhood alphabetically
 */
export function sortProvidersByNeighborhood(providers: Provider[]): Provider[] {
  return [...providers].sort((a, b) =>
    a.address.neighborhood.localeCompare(b.address.neighborhood)
  );
}
