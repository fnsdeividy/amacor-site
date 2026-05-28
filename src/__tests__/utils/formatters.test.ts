import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatNumberBR,
  formatDistance,
  formatPhone,
  formatCep,
  formatDate,
  formatWaitingPeriod,
  formatIDSSValue,
} from '../../utils/formatters';

describe('formatNumber', () => {
  it('formats to 2 decimal places by default', () => {
    expect(formatNumber(3.14159)).toBe('3.14');
  });

  it('formats to specified decimal places', () => {
    expect(formatNumber(0.3095, 4)).toBe('0.3095');
    expect(formatNumber(1, 0)).toBe('1');
  });
});

describe('formatNumberBR', () => {
  it('formats using Brazilian locale', () => {
    const result = formatNumberBR(1234.56);
    // Brazilian format uses comma for decimal
    expect(result).toContain(',');
  });
});

describe('formatDistance', () => {
  it('formats distances >= 1km with one decimal', () => {
    const result = formatDistance(2.5);
    expect(result).toContain('km');
  });

  it('formats distances < 1km in meters', () => {
    const result = formatDistance(0.5);
    expect(result).toBe('500 m');
  });

  it('rounds meters to nearest integer', () => {
    const result = formatDistance(0.123);
    expect(result).toBe('123 m');
  });
});

describe('formatPhone', () => {
  it('formats 11-digit mobile number', () => {
    expect(formatPhone('11912345678')).toBe('(11) 91234-5678');
  });

  it('formats 10-digit landline number', () => {
    expect(formatPhone('1131051234')).toBe('(11) 3105-1234');
  });

  it('returns original for non-standard lengths', () => {
    expect(formatPhone('12345')).toBe('12345');
  });
});

describe('formatCep', () => {
  it('formats 8-digit CEP with hyphen', () => {
    expect(formatCep('01504001')).toBe('01504-001');
  });

  it('handles already formatted CEP', () => {
    expect(formatCep('01504-001')).toBe('01504-001');
  });

  it('returns original for non-8-digit strings', () => {
    expect(formatCep('1234')).toBe('1234');
  });
});

describe('formatDate', () => {
  it('formats Date object to DD/MM/YYYY', () => {
    const date = new Date(2025, 0, 15); // January 15, 2025
    expect(formatDate(date)).toBe('15/01/2025');
  });

  it('formats ISO string to DD/MM/YYYY', () => {
    const result = formatDate('2025-06-20T00:00:00.000Z');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe('formatWaitingPeriod', () => {
  it('returns "Sem carência" for 0 days', () => {
    expect(formatWaitingPeriod(0)).toBe('Sem carência');
  });

  it('returns "1 dia" for 1 day', () => {
    expect(formatWaitingPeriod(1)).toBe('1 dia');
  });

  it('returns plural for multiple days', () => {
    expect(formatWaitingPeriod(30)).toBe('30 dias');
    expect(formatWaitingPeriod(180)).toBe('180 dias');
  });
});

describe('formatIDSSValue', () => {
  it('formats to exactly 4 decimal places', () => {
    expect(formatIDSSValue(0.3095)).toBe('0.3095');
    expect(formatIDSSValue(0)).toBe('0.0000');
    expect(formatIDSSValue(0.9208)).toBe('0.9208');
    expect(formatIDSSValue(1)).toBe('1.0000');
  });
});
