import { describe, it, expect } from 'vitest';
import { haversineDistance, filterProvidersByRadius, sortProvidersByDistance } from '../../utils/distance';
import type { Provider } from '../../types/provider';

describe('haversineDistance', () => {
  it('returns 0 for the same point', () => {
    const distance = haversineDistance(-23.5505, -46.6333, -23.5505, -46.6333);
    expect(distance).toBe(0);
  });

  it('calculates distance between São Paulo and Rio de Janeiro (~360 km)', () => {
    // São Paulo: -23.5505, -46.6333
    // Rio de Janeiro: -22.9068, -43.1729
    const distance = haversineDistance(-23.5505, -46.6333, -22.9068, -43.1729);
    expect(distance).toBeGreaterThan(350);
    expect(distance).toBeLessThan(380);
  });

  it('calculates short distances accurately', () => {
    // Two points ~1km apart in São Paulo
    const distance = haversineDistance(-23.5505, -46.6333, -23.5595, -46.6333);
    expect(distance).toBeGreaterThan(0.9);
    expect(distance).toBeLessThan(1.1);
  });

  it('is symmetric (distance A->B equals B->A)', () => {
    const d1 = haversineDistance(-23.5505, -46.6333, -22.9068, -43.1729);
    const d2 = haversineDistance(-22.9068, -43.1729, -23.5505, -46.6333);
    expect(d1).toBeCloseTo(d2, 10);
  });
});

describe('filterProvidersByRadius', () => {
  const makeProvider = (id: string, lat: number, lng: number): Provider => ({
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
  });

  const center = { lat: -23.5505, lng: -46.6333 };

  it('includes providers within radius', () => {
    const providers = [
      makeProvider('1', -23.5510, -46.6340), // very close (~0.1 km)
    ];
    const result = filterProvidersByRadius(providers, center.lat, center.lng, 10);
    expect(result).toHaveLength(1);
  });

  it('excludes providers beyond radius', () => {
    const providers = [
      makeProvider('1', -22.9068, -43.1729), // Rio de Janeiro (~360 km)
    ];
    const result = filterProvidersByRadius(providers, center.lat, center.lng, 10);
    expect(result).toHaveLength(0);
  });

  it('uses default radius of 10km', () => {
    const providers = [
      makeProvider('1', -23.5510, -46.6340), // ~0.1 km
      makeProvider('2', -23.6500, -46.7000), // ~12 km
    ];
    const result = filterProvidersByRadius(providers, center.lat, center.lng);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('sortProvidersByDistance', () => {
  const makeProvider = (id: string, lat: number, lng: number): Provider => ({
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
  });

  it('sorts providers by proximity (nearest first)', () => {
    const providers = [
      makeProvider('far', -22.9068, -43.1729),    // Rio (~360 km)
      makeProvider('close', -23.5510, -46.6340),  // ~0.1 km
      makeProvider('mid', -23.6000, -46.7000),    // ~8 km
    ];

    const sorted = sortProvidersByDistance(providers, -23.5505, -46.6333);
    expect(sorted[0].id).toBe('close');
    expect(sorted[1].id).toBe('mid');
    expect(sorted[2].id).toBe('far');
  });

  it('does not mutate the original array', () => {
    const providers = [
      makeProvider('far', -22.9068, -43.1729),
      makeProvider('close', -23.5510, -46.6340),
    ];
    const original = [...providers];
    sortProvidersByDistance(providers, -23.5505, -46.6333);
    expect(providers).toEqual(original);
  });
});
