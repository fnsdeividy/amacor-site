/**
 * Property 3: Distance-based provider filtering
 *
 * Feature: amacor-website, Property 3: Distance-based provider filtering
 *
 * Validates: Requirements 7.3
 *
 * For any center point (lat, lng) and set of providers with coordinates,
 * the radius filter function SHALL return only providers whose Haversine
 * distance from the center point is less than or equal to the specified
 * radius, and SHALL exclude all providers beyond that radius.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { haversineDistance, filterProvidersByRadius } from '../../utils/distance';
import type { Provider } from '../../types/provider';

/**
 * Arbitrary for valid latitude values [-90, 90]
 */
const latArb = fc.double({ min: -90, max: 90, noNaN: true, noDefaultInfinity: true });

/**
 * Arbitrary for valid longitude values [-180, 180]
 */
const lngArb = fc.double({ min: -180, max: 180, noNaN: true, noDefaultInfinity: true });

/**
 * Arbitrary for a radius in km (positive, reasonable range)
 */
const radiusArb = fc.double({ min: 0.1, max: 100, noNaN: true, noDefaultInfinity: true });

/**
 * Creates a minimal Provider object with given coordinates.
 */
function makeProvider(id: string, lat: number, lng: number): Provider {
  return {
    id,
    name: `Provider ${id}`,
    type: 'Clínica',
    specialties: ['Clínica médica'],
    address: {
      street: 'Rua Test',
      number: '100',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      cep: '01000000',
    },
    coordinates: { lat, lng },
    phone: '(11) 3000-0000',
    operatingHours: { weekdays: '08:00-18:00' },
    acceptedPlans: ['Exclusivo I'],
  };
}

/**
 * Arbitrary for a provider with random coordinates.
 */
const providerArb = fc.tuple(latArb, lngArb, fc.uuid()).map(([lat, lng, id]) =>
  makeProvider(id, lat, lng)
);

/**
 * Arbitrary for a list of providers (1 to 20 providers).
 */
const providersArb = fc.array(providerArb, { minLength: 1, maxLength: 20 });

describe('Property 3: Distance-based provider filtering', () => {
  it('filterProvidersByRadius returns ONLY providers within the specified radius (no false positives)', () => {
    fc.assert(
      fc.property(
        latArb,
        lngArb,
        providersArb,
        radiusArb,
        (centerLat, centerLng, providers, radius) => {
          const result = filterProvidersByRadius(providers, centerLat, centerLng, radius);

          // Every provider in the result must be within the radius
          for (const provider of result) {
            const distance = haversineDistance(
              centerLat,
              centerLng,
              provider.coordinates!.lat,
              provider.coordinates!.lng
            );
            expect(distance).toBeLessThanOrEqual(radius);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('filterProvidersByRadius includes ALL providers within the specified radius (no false negatives)', () => {
    fc.assert(
      fc.property(
        latArb,
        lngArb,
        providersArb,
        radiusArb,
        (centerLat, centerLng, providers, radius) => {
          const result = filterProvidersByRadius(providers, centerLat, centerLng, radius);

          // Every provider that is within the radius must be in the result
          for (const provider of providers) {
            const distance = haversineDistance(
              centerLat,
              centerLng,
              provider.coordinates!.lat,
              provider.coordinates!.lng
            );
            if (distance <= radius) {
              expect(result).toContainEqual(provider);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('filterProvidersByRadius result is a subset of the input providers', () => {
    fc.assert(
      fc.property(
        latArb,
        lngArb,
        providersArb,
        radiusArb,
        (centerLat, centerLng, providers, radius) => {
          const result = filterProvidersByRadius(providers, centerLat, centerLng, radius);

          // Result must be a subset of the original providers
          expect(result.length).toBeLessThanOrEqual(providers.length);
          for (const provider of result) {
            expect(providers).toContainEqual(provider);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
