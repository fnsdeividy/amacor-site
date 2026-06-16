// Feature: admin-login-beneficiary-auth, Property 10: Validação de intervalos de datas
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Validates: Requirements 7.5, 7.6, 10.8
 *
 * Property 10: Validação de intervalos de datas
 * Para qualquer par de datas (início, fim), a validação de período de filtro deve aceitar
 * se e somente se: fim >= início, ambas as datas estão dentro dos últimos 365 dias,
 * e o intervalo entre início e fim é <= 180 dias. Para consulta CRM (ws_ListaCRMs),
 * o intervalo máximo é 90 dias.
 */

// --- Constants ---
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_DAYS_ADMIN = 180;
const MAX_DAYS_CRM = 90;
const MAX_DAYS_HISTORY = 365;

// --- Validation result interface ---
interface DateValidationResult {
  valid: boolean;
  erro?: string;
}

/**
 * Pure date range validation for admin filters.
 * Rules:
 * - fim >= inicio
 * - Both dates within last 365 days from referenceDate
 * - Interval between inicio and fim <= 180 days
 */
function validateDateRangeAdmin(
  inicio: Date,
  fim: Date,
  referenceDate: Date = new Date()
): DateValidationResult {
  // fim must be >= inicio
  if (fim.getTime() < inicio.getTime()) {
    return { valid: false, erro: 'Data final deve ser igual ou posterior à data inicial' };
  }

  // Both dates must be within last 365 days
  const oldestAllowed = new Date(referenceDate.getTime() - MAX_DAYS_HISTORY * MS_PER_DAY);

  if (inicio.getTime() < oldestAllowed.getTime()) {
    return { valid: false, erro: 'Data inicial deve estar dentro dos últimos 365 dias' };
  }

  if (fim.getTime() < oldestAllowed.getTime()) {
    return { valid: false, erro: 'Data final deve estar dentro dos últimos 365 dias' };
  }

  // Both dates must not be in the future
  if (inicio.getTime() > referenceDate.getTime()) {
    return { valid: false, erro: 'Data inicial não pode ser futura' };
  }

  if (fim.getTime() > referenceDate.getTime()) {
    return { valid: false, erro: 'Data final não pode ser futura' };
  }

  // Interval must be <= 180 days
  const intervalDays = Math.floor((fim.getTime() - inicio.getTime()) / MS_PER_DAY);
  if (intervalDays > MAX_DAYS_ADMIN) {
    return { valid: false, erro: 'Intervalo máximo permitido é de 180 dias' };
  }

  return { valid: true };
}

/**
 * Pure date range validation for CRM queries (ws_ListaCRMs).
 * Rules:
 * - fim >= inicio
 * - Both dates within last 365 days from referenceDate
 * - Interval between inicio and fim <= 90 days
 */
function validateDateRangeCRM(
  inicio: Date,
  fim: Date,
  referenceDate: Date = new Date()
): DateValidationResult {
  // fim must be >= inicio
  if (fim.getTime() < inicio.getTime()) {
    return { valid: false, erro: 'Data final deve ser igual ou posterior à data inicial' };
  }

  // Both dates must be within last 365 days
  const oldestAllowed = new Date(referenceDate.getTime() - MAX_DAYS_HISTORY * MS_PER_DAY);

  if (inicio.getTime() < oldestAllowed.getTime()) {
    return { valid: false, erro: 'Data inicial deve estar dentro dos últimos 365 dias' };
  }

  if (fim.getTime() < oldestAllowed.getTime()) {
    return { valid: false, erro: 'Data final deve estar dentro dos últimos 365 dias' };
  }

  // Both dates must not be in the future
  if (inicio.getTime() > referenceDate.getTime()) {
    return { valid: false, erro: 'Data inicial não pode ser futura' };
  }

  if (fim.getTime() > referenceDate.getTime()) {
    return { valid: false, erro: 'Data final não pode ser futura' };
  }

  // Interval must be <= 90 days
  const intervalDays = Math.floor((fim.getTime() - inicio.getTime()) / MS_PER_DAY);
  if (intervalDays > MAX_DAYS_CRM) {
    return { valid: false, erro: 'Intervalo máximo permitido é de 90 dias para consulta CRM' };
  }

  return { valid: true };
}

// --- Helper to check if a date pair should be accepted ---
function shouldAcceptAdmin(inicio: Date, fim: Date, referenceDate: Date): boolean {
  const oldestAllowed = new Date(referenceDate.getTime() - MAX_DAYS_HISTORY * MS_PER_DAY);
  const intervalDays = Math.floor((fim.getTime() - inicio.getTime()) / MS_PER_DAY);

  return (
    fim.getTime() >= inicio.getTime() &&
    inicio.getTime() >= oldestAllowed.getTime() &&
    fim.getTime() >= oldestAllowed.getTime() &&
    inicio.getTime() <= referenceDate.getTime() &&
    fim.getTime() <= referenceDate.getTime() &&
    intervalDays <= MAX_DAYS_ADMIN
  );
}

function shouldAcceptCRM(inicio: Date, fim: Date, referenceDate: Date): boolean {
  const oldestAllowed = new Date(referenceDate.getTime() - MAX_DAYS_HISTORY * MS_PER_DAY);
  const intervalDays = Math.floor((fim.getTime() - inicio.getTime()) / MS_PER_DAY);

  return (
    fim.getTime() >= inicio.getTime() &&
    inicio.getTime() >= oldestAllowed.getTime() &&
    fim.getTime() >= oldestAllowed.getTime() &&
    inicio.getTime() <= referenceDate.getTime() &&
    fim.getTime() <= referenceDate.getTime() &&
    intervalDays <= MAX_DAYS_CRM
  );
}

// --- Arbitraries ---

// Fixed reference date for deterministic tests
const REFERENCE_DATE = new Date('2025-06-15T12:00:00Z');

// Generate dates within a wide range (some valid, some not)
const dateArbitrary = fc.date({
  min: new Date('2023-01-01T00:00:00Z'),
  max: new Date('2026-01-01T00:00:00Z'),
});

// Generate a pair of dates that are guaranteed to be valid for admin (for targeted testing)
const validAdminDatePairArbitrary = fc.tuple(
  fc.integer({ min: 0, max: MAX_DAYS_HISTORY }),
  fc.integer({ min: 0, max: MAX_DAYS_ADMIN })
).map(([startOffset, interval]) => {
  // startOffset: days back from reference for inicio
  // interval: days between inicio and fim (capped at MAX_DAYS_ADMIN)
  const actualStartOffset = Math.min(startOffset, MAX_DAYS_HISTORY);
  const inicio = new Date(REFERENCE_DATE.getTime() - actualStartOffset * MS_PER_DAY);
  // Ensure fim doesn't exceed reference date
  const maxInterval = Math.min(interval, Math.floor((REFERENCE_DATE.getTime() - inicio.getTime()) / MS_PER_DAY));
  const actualInterval = Math.max(0, maxInterval);
  const fim = new Date(inicio.getTime() + actualInterval * MS_PER_DAY);
  return { inicio, fim };
});

// Generate a pair of dates that are guaranteed to be valid for CRM
const validCrmDatePairArbitrary = fc.tuple(
  fc.integer({ min: 0, max: MAX_DAYS_HISTORY }),
  fc.integer({ min: 0, max: MAX_DAYS_CRM })
).map(([startOffset, interval]) => {
  const actualStartOffset = Math.min(startOffset, MAX_DAYS_HISTORY);
  const inicio = new Date(REFERENCE_DATE.getTime() - actualStartOffset * MS_PER_DAY);
  const maxInterval = Math.min(interval, Math.floor((REFERENCE_DATE.getTime() - inicio.getTime()) / MS_PER_DAY));
  const actualInterval = Math.max(0, maxInterval);
  const fim = new Date(inicio.getTime() + actualInterval * MS_PER_DAY);
  return { inicio, fim };
});

describe('Property 10: Validação de intervalos de datas', () => {
  it('admin filter: accepts if and only if fim >= inicio, both within 365 days, interval <= 180 days', () => {
    fc.assert(
      fc.property(
        dateArbitrary,
        dateArbitrary,
        (inicio, fim) => {
          const result = validateDateRangeAdmin(inicio, fim, REFERENCE_DATE);
          const expected = shouldAcceptAdmin(inicio, fim, REFERENCE_DATE);

          expect(result.valid).toBe(expected);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('CRM query: accepts if and only if fim >= inicio, both within 365 days, interval <= 90 days', () => {
    fc.assert(
      fc.property(
        dateArbitrary,
        dateArbitrary,
        (inicio, fim) => {
          const result = validateDateRangeCRM(inicio, fim, REFERENCE_DATE);
          const expected = shouldAcceptCRM(inicio, fim, REFERENCE_DATE);

          expect(result.valid).toBe(expected);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('admin filter: all valid date pairs are accepted', () => {
    fc.assert(
      fc.property(
        validAdminDatePairArbitrary,
        ({ inicio, fim }) => {
          const result = validateDateRangeAdmin(inicio, fim, REFERENCE_DATE);
          expect(result.valid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('CRM query: all valid date pairs are accepted', () => {
    fc.assert(
      fc.property(
        validCrmDatePairArbitrary,
        ({ inicio, fim }) => {
          const result = validateDateRangeCRM(inicio, fim, REFERENCE_DATE);
          expect(result.valid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects when fim < inicio for both admin and CRM', () => {
    fc.assert(
      fc.property(
        dateArbitrary,
        fc.integer({ min: 1, max: 1000 }),
        (fim, daysBefore) => {
          // Create inicio that is after fim
          const inicio = new Date(fim.getTime() + daysBefore * MS_PER_DAY);

          const adminResult = validateDateRangeAdmin(inicio, fim, REFERENCE_DATE);
          const crmResult = validateDateRangeCRM(inicio, fim, REFERENCE_DATE);

          expect(adminResult.valid).toBe(false);
          expect(crmResult.valid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('CRM max interval is stricter than admin (90 < 180)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 91, max: 180 }),
        (intervalDays) => {
          // Create a date pair where interval is between 91 and 180 days
          // This should pass admin validation but fail CRM validation
          const inicio = new Date(REFERENCE_DATE.getTime() - 300 * MS_PER_DAY);
          const fim = new Date(inicio.getTime() + intervalDays * MS_PER_DAY);

          // Only test if both dates are within bounds
          if (fim.getTime() <= REFERENCE_DATE.getTime()) {
            const adminResult = validateDateRangeAdmin(inicio, fim, REFERENCE_DATE);
            const crmResult = validateDateRangeCRM(inicio, fim, REFERENCE_DATE);

            expect(adminResult.valid).toBe(true);
            expect(crmResult.valid).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects dates older than 365 days from reference', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 366, max: 730 }),
        fc.integer({ min: 0, max: 90 }),
        (daysBack, interval) => {
          // Create inicio that is beyond 365 days
          const inicio = new Date(REFERENCE_DATE.getTime() - daysBack * MS_PER_DAY);
          const fim = new Date(inicio.getTime() + interval * MS_PER_DAY);

          const adminResult = validateDateRangeAdmin(inicio, fim, REFERENCE_DATE);
          const crmResult = validateDateRangeCRM(inicio, fim, REFERENCE_DATE);

          expect(adminResult.valid).toBe(false);
          expect(crmResult.valid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
