import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useProviderSearch } from './useProviderSearch';
import type { Provider } from '../types/provider';

function createProvider(overrides: Partial<Provider> = {}): Provider {
  return {
    id: '1',
    name: 'Provider A',
    type: 'Clínica',
    specialties: ['Cardiologia'],
    address: {
      street: 'Rua Teste',
      number: '100',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      cep: '01001000',
    },
    coordinates: { lat: -23.55, lng: -46.63 },
    phone: '(11) 1234-5678',
    operatingHours: { weekdays: '08:00 - 18:00' },
    acceptedPlans: ['Exclusivo II'],
    ...overrides,
  };
}

const mockProviders: Provider[] = [
  createProvider({ id: '1', name: 'Clínica Beta', specialties: ['Cardiologia'], address: { street: 'Rua A', number: '1', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP', cep: '01001000' }, coordinates: { lat: -23.55, lng: -46.63 } }),
  createProvider({ id: '2', name: 'Hospital Alpha', type: 'Hospital', specialties: ['Ortopedia'], address: { street: 'Rua B', number: '2', neighborhood: 'Jardins', city: 'Campinas', state: 'SP', cep: '13001000' }, coordinates: { lat: -22.90, lng: -47.06 } }),
  createProvider({ id: '3', name: 'Lab Gamma', type: 'Laboratório', specialties: ['Exames'], address: { street: 'Rua C', number: '3', neighborhood: 'Alphaville', city: 'Barueri', state: 'SP', cep: '06454000' }, coordinates: { lat: -23.50, lng: -46.85 }, acceptedPlans: ['Empresarial'] }),
];

describe('useProviderSearch', () => {
  it('returns all providers when no filters are applied', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    expect(result.current.totalResults).toBe(3);
    expect(result.current.results).toHaveLength(3);
  });

  it('defaults to alphabetical sort when no user location', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    expect(result.current.sortBy).toBe('alphabetical');
    expect(result.current.results[0].name).toBe('Clínica Beta');
    expect(result.current.results[1].name).toBe('Hospital Alpha');
    expect(result.current.results[2].name).toBe('Lab Gamma');
  });

  it('defaults to proximity sort when user location is provided', () => {
    const { result } = renderHook(() =>
      useProviderSearch({
        providers: mockProviders,
        userLocation: { lat: -23.55, lng: -46.63 },
      })
    );

    expect(result.current.sortBy).toBe('proximity');
  });

  it('filters by specialty', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setFilters({ specialty: 'Cardiologia' });
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.results[0].id).toBe('1');
  });

  it('filters by plan', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setFilters({ plan: 'Empresarial' });
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.results[0].id).toBe('3');
  });

  it('filters by provider type', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setFilters({ providerType: 'Hospital' });
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.results[0].id).toBe('2');
  });

  it('filters by city', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setFilters({ city: 'Campinas' });
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.results[0].id).toBe('2');
  });

  it('resets to page 1 when filters change', () => {
    // Create enough providers to have multiple pages
    const manyProviders = Array.from({ length: 25 }, (_, i) =>
      createProvider({ id: String(i), name: `Provider ${String(i).padStart(2, '0')}` })
    );

    const { result } = renderHook(() =>
      useProviderSearch({ providers: manyProviders })
    );

    // Go to page 2
    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    // Apply a filter — should reset to page 1
    act(() => {
      result.current.setFilters({ specialty: 'Cardiologia' });
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('changes sort option', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setSortBy('city');
    });

    expect(result.current.sortBy).toBe('city');
    // Barueri < Campinas < São Paulo
    expect(result.current.results[0].address.city).toBe('Barueri');
    expect(result.current.results[1].address.city).toBe('Campinas');
    expect(result.current.results[2].address.city).toBe('São Paulo');
  });

  it('paginates results correctly with 20 items per page', () => {
    const manyProviders = Array.from({ length: 45 }, (_, i) =>
      createProvider({ id: String(i), name: `Provider ${String(i).padStart(2, '0')}` })
    );

    const { result } = renderHook(() =>
      useProviderSearch({ providers: manyProviders })
    );

    expect(result.current.totalResults).toBe(45);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.results).toHaveLength(20);
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.results).toHaveLength(5);
  });

  it('returns empty results when no providers match filters', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setFilters({ specialty: 'Telemedicina' });
    });

    expect(result.current.totalResults).toBe(0);
    expect(result.current.results).toHaveLength(0);
    expect(result.current.totalPages).toBe(0);
  });

  it('combines multiple filters (AND logic)', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setFilters({ city: 'São Paulo', specialty: 'Cardiologia' });
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.results[0].id).toBe('1');
  });

  it('falls back to alphabetical sort when proximity is selected but no user location', () => {
    const { result } = renderHook(() =>
      useProviderSearch({ providers: mockProviders })
    );

    act(() => {
      result.current.setSortBy('proximity');
    });

    // Without user location, proximity falls back to alphabetical
    expect(result.current.results[0].name).toBe('Clínica Beta');
    expect(result.current.results[1].name).toBe('Hospital Alpha');
    expect(result.current.results[2].name).toBe('Lab Gamma');
  });
});
