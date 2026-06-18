import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  sortProvidersByDistance,
  sortProvidersByName,
  sortProvidersBySpecialty,
  sortProvidersByCity,
  sortProvidersByNeighborhood,
  haversineDistance,
} from '../../utils/distance';
import type { Provider, ProviderType, Specialty, PlanType } from '../../types/provider';

/**
 * Feature: amacor-website, Property 4: Provider sorting invariant
 *
 * For any non-empty list of providers and any sort option (alphabetical, proximity,
 * specialty, city, neighborhood), the sort function SHALL return a list where each
 * adjacent pair of elements satisfies the ordering relation for the selected sort criterion.
 *
 * Validates: Requirements 7.8
 */

// Arbitraries for generating Provider objects

const providerTypeArb: fc.Arbitrary<ProviderType> = fc.constantFrom(
  'Hospital',
  'Clínica',
  'Laboratório',
  'Consultório',
  'Pronto-Socorro'
);

const specialtyArb: fc.Arbitrary<Specialty> = fc.constantFrom(
  'Clínica médica',
  'Cardiologia',
  'Dermatologia',
  'Ginecologia',
  'Pediatria',
  'Ortopedia',
  'Oftalmologia',
  'Laboratório',
  'Fisioterapia',
  'Psicologia',
  'Exames',
  'Urgência',
  'Telemedicina'
);

const planTypeArb: fc.Arbitrary<PlanType> = fc.constantFrom(
  'Exclusivo I',
  'Exclusivo II',
  'Empresarial'
);

const providerArb: fc.Arbitrary<Provider> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  type: providerTypeArb,
  specialties: fc.array(specialtyArb, { minLength: 1, maxLength: 4 }),
  address: fc.record({
    street: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
    number: fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 1, maxLength: 5 }),
    neighborhood: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
    city: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
    state: fc.constantFrom('SP', 'RJ', 'MG', 'PR', 'SC'),
    cep: fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 8, maxLength: 8 }),
  }),
  coordinates: fc.record({
    lat: fc.double({ min: -33.75, max: 5.27, noNaN: true, noDefaultInfinity: true }),
    lng: fc.double({ min: -73.99, max: -34.79, noNaN: true, noDefaultInfinity: true }),
  }),
  phone: fc.constant('(11) 3000-0000'),
  operatingHours: fc.record({
    weekdays: fc.constant('08:00-18:00'),
  }),
  acceptedPlans: fc.array(planTypeArb, { minLength: 1, maxLength: 3 }),
});

const providerListArb = fc.array(providerArb, { minLength: 1, maxLength: 20 });

const centerPointArb = fc.record({
  lat: fc.double({ min: -33.75, max: 5.27, noNaN: true, noDefaultInfinity: true }),
  lng: fc.double({ min: -73.99, max: -34.79, noNaN: true, noDefaultInfinity: true }),
});

describe('Property 4: Provider sorting invariant', () => {
  it('alphabetical sort: name[i].localeCompare(name[i+1]) <= 0 for all adjacent pairs', () => {
    fc.assert(
      fc.property(providerListArb, (providers) => {
        const sorted = sortProvidersByName(providers);

        // Verify adjacent pair ordering
        for (let i = 0; i < sorted.length - 1; i++) {
          expect(sorted[i].name.localeCompare(sorted[i + 1].name)).toBeLessThanOrEqual(0);
        }

        // Verify same length (no elements lost or added)
        expect(sorted.length).toBe(providers.length);
      }),
      { numRuns: 100 }
    );
  });

  it('proximity sort: distance[i] <= distance[i+1] for all adjacent pairs', () => {
    fc.assert(
      fc.property(providerListArb, centerPointArb, (providers, center) => {
        const sorted = sortProvidersByDistance(providers, center.lat, center.lng);

        // Verify adjacent pair ordering by distance
        for (let i = 0; i < sorted.length - 1; i++) {
          const distI = haversineDistance(
            center.lat,
            center.lng,
            sorted[i].coordinates!.lat,
            sorted[i].coordinates!.lng
          );
          const distNext = haversineDistance(
            center.lat,
            center.lng,
            sorted[i + 1].coordinates!.lat,
            sorted[i + 1].coordinates!.lng
          );
          expect(distI).toBeLessThanOrEqual(distNext);
        }

        // Verify same length
        expect(sorted.length).toBe(providers.length);
      }),
      { numRuns: 100 }
    );
  });

  it('specialty sort: specialty[i].localeCompare(specialty[i+1]) <= 0 for all adjacent pairs', () => {
    fc.assert(
      fc.property(providerListArb, (providers) => {
        const sorted = sortProvidersBySpecialty(providers);

        // Verify adjacent pair ordering by first specialty
        for (let i = 0; i < sorted.length - 1; i++) {
          const specI = sorted[i].specialties && sorted[i].specialties!.length > 0 ? sorted[i].specialties![0] : '';
          const specNext = sorted[i + 1].specialties && sorted[i + 1].specialties!.length > 0 ? sorted[i + 1].specialties![0] : '';
          expect(specI.localeCompare(specNext)).toBeLessThanOrEqual(0);
        }

        // Verify same length
        expect(sorted.length).toBe(providers.length);
      }),
      { numRuns: 100 }
    );
  });

  it('city sort: city[i].localeCompare(city[i+1]) <= 0 for all adjacent pairs', () => {
    fc.assert(
      fc.property(providerListArb, (providers) => {
        const sorted = sortProvidersByCity(providers);

        // Verify adjacent pair ordering by city
        for (let i = 0; i < sorted.length - 1; i++) {
          expect(
            sorted[i].address.city.localeCompare(sorted[i + 1].address.city)
          ).toBeLessThanOrEqual(0);
        }

        // Verify same length
        expect(sorted.length).toBe(providers.length);
      }),
      { numRuns: 100 }
    );
  });

  it('neighborhood sort: neighborhood[i].localeCompare(neighborhood[i+1]) <= 0 for all adjacent pairs', () => {
    fc.assert(
      fc.property(providerListArb, (providers) => {
        const sorted = sortProvidersByNeighborhood(providers);

        // Verify adjacent pair ordering by neighborhood
        for (let i = 0; i < sorted.length - 1; i++) {
          expect(
            sorted[i].address.neighborhood.localeCompare(sorted[i + 1].address.neighborhood)
          ).toBeLessThanOrEqual(0);
        }

        // Verify same length
        expect(sorted.length).toBe(providers.length);
      }),
      { numRuns: 100 }
    );
  });
});
