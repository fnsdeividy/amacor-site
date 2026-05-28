import { describe, it, expect } from 'vitest';
import { filterBySubstring, filterProviders } from '../../utils/filters';
import type { Provider, ProviderFilters } from '../../types/provider';

describe('filterBySubstring', () => {
  const items = [
    { id: '1', label: 'Consulta Cardiologia' },
    { id: '2', label: 'Exame de Sangue' },
    { id: '3', label: 'Consulta Dermatologia' },
    { id: '4', label: 'Fisioterapia' },
  ];

  it('returns all items when search query is empty', () => {
    const result = filterBySubstring(items, '', (item) => item.label);
    expect(result).toHaveLength(4);
  });

  it('returns all items when search query is whitespace', () => {
    const result = filterBySubstring(items, '   ', (item) => item.label);
    expect(result).toHaveLength(4);
  });

  it('filters by case-insensitive substring', () => {
    const result = filterBySubstring(items, 'consulta', (item) => item.label);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
  });

  it('matches partial substrings', () => {
    const result = filterBySubstring(items, 'sang', (item) => item.label);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns empty array when no items match', () => {
    const result = filterBySubstring(items, 'xyz', (item) => item.label);
    expect(result).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    const result = filterBySubstring(items, 'FISIOTERAPIA', (item) => item.label);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });
});

describe('filterProviders', () => {
  const makeProvider = (overrides: Partial<Provider> = {}): Provider => ({
    id: 'prov-001',
    name: 'Hospital São Lucas',
    type: 'Hospital',
    specialties: ['Clínica médica', 'Cardiologia'],
    address: {
      street: 'Rua Vergueiro',
      number: '1200',
      neighborhood: 'Liberdade',
      city: 'São Paulo',
      state: 'SP',
      cep: '01504001',
    },
    coordinates: { lat: -23.5631, lng: -46.6366 },
    phone: '(11) 3105-1234',
    operatingHours: { weekdays: '24 horas' },
    acceptedPlans: ['Exclusivo I', 'Exclusivo II'],
    ...overrides,
  });

  const providers: Provider[] = [
    makeProvider({ id: '1', name: 'Hospital São Lucas', type: 'Hospital', specialties: ['Cardiologia', 'Urgência'] }),
    makeProvider({ id: '2', name: 'Clínica Vida Plena', type: 'Clínica', specialties: ['Ginecologia'], acceptedPlans: ['Empresarial'] }),
    makeProvider({ id: '3', name: 'Lab Diagnóstico', type: 'Laboratório', specialties: ['Exames'], address: { street: 'Rua A', number: '1', neighborhood: 'Moema', city: 'São Paulo', state: 'SP', cep: '04000000' } }),
    makeProvider({ id: '4', name: 'Consultório Dr. Silva', type: 'Consultório', specialties: ['Dermatologia'], address: { street: 'Rua B', number: '2', neighborhood: 'Centro', city: 'Campinas', state: 'SP', cep: '13000000' }, coordinates: { lat: -22.9064, lng: -47.0616 } }),
  ];

  it('returns all providers when no filters are applied', () => {
    const result = filterProviders(providers, {});
    expect(result).toHaveLength(4);
  });

  it('filters by search query (name match)', () => {
    const result = filterProviders(providers, { searchQuery: 'Hospital' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by search query (specialty match)', () => {
    const result = filterProviders(providers, { searchQuery: 'ginecologia' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by search query (city match)', () => {
    const result = filterProviders(providers, { searchQuery: 'campinas' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('filters by specialty', () => {
    const result = filterProviders(providers, { specialty: 'Cardiologia' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by plan', () => {
    const result = filterProviders(providers, { plan: 'Empresarial' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by provider type', () => {
    const result = filterProviders(providers, { providerType: 'Laboratório' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by city', () => {
    const result = filterProviders(providers, { city: 'Campinas' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('filters by neighborhood', () => {
    const result = filterProviders(providers, { neighborhood: 'Moema' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by radius from user location', () => {
    // Provider 4 is in Campinas (~90km from São Paulo center)
    const filters: ProviderFilters = {
      userLocation: { lat: -23.5505, lng: -46.6333 },
      radiusKm: 5,
    };
    const result = filterProviders(providers, filters);
    // Only providers within 5km of São Paulo center
    expect(result.length).toBeLessThan(4);
    expect(result.every((p) => p.address.city === 'São Paulo')).toBe(true);
  });

  it('combines multiple filters (AND logic)', () => {
    const result = filterProviders(providers, {
      city: 'São Paulo',
      providerType: 'Hospital',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
