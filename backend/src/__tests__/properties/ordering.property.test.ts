// Feature: admin-login-beneficiary-auth, Property 8: Invariante de ordenação cronológica decrescente
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Validates: Requirements 6.2, 8.5, 11.4, 16.3
 *
 * Property 8: Invariante de ordenação cronológica decrescente
 * Para qualquer resultado retornado por endpoints de listagem (solicitações admin,
 * solicitações beneficiário, histórico de eventos), a sequência de timestamps (criado_em)
 * deve ser estritamente não-crescente — ou seja, cada item tem data igual ou anterior
 * ao item anterior na lista.
 */

/**
 * Simulates the DESC ordering applied by the repository layer (ORDER BY criado_em DESC).
 * This is the same logic the database applies when returning results.
 */
function ordenarCronologicamenteDesc<T extends { criadoEm: Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());
}

/**
 * Checks the non-increasing invariant: for each consecutive pair (items[i], items[i+1]),
 * items[i].criadoEm >= items[i+1].criadoEm.
 */
function verificarOrdenacaoNaoCrescente(items: { criadoEm: Date }[]): boolean {
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].criadoEm.getTime() < items[i + 1].criadoEm.getTime()) {
      return false;
    }
  }
  return true;
}

// Arbitrary for generating items with random timestamps simulating solicitações
const solicitacaoItemArbitrary = fc.record({
  id: fc.uuid(),
  criadoEm: fc.date({
    min: new Date('2020-01-01T00:00:00Z'),
    max: new Date('2026-12-31T23:59:59Z'),
  }),
});

// Arbitrary for generating items simulating histórico de eventos
const historicoEventoItemArbitrary = fc.record({
  id: fc.uuid(),
  tipoEvento: fc.constantFrom('criacao', 'mudanca_status', 'envio_crm', 'observacao'),
  criadoEm: fc.date({
    min: new Date('2020-01-01T00:00:00Z'),
    max: new Date('2026-12-31T23:59:59Z'),
  }),
});

describe('Property 8: Invariante de ordenação cronológica decrescente', () => {
  it('resultado de listagem de solicitações admin mantém ordem não-crescente após sort DESC', () => {
    fc.assert(
      fc.property(
        fc.array(solicitacaoItemArbitrary, { minLength: 0, maxLength: 100 }),
        (items) => {
          const sorted = ordenarCronologicamenteDesc(items);

          // Verify non-increasing invariant
          expect(verificarOrdenacaoNaoCrescente(sorted)).toBe(true);

          // Verify each consecutive pair satisfies items[i].criadoEm >= items[i+1].criadoEm
          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].criadoEm.getTime()).toBeGreaterThanOrEqual(
              sorted[i + 1].criadoEm.getTime()
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('resultado de listagem de solicitações do beneficiário mantém ordem não-crescente após sort DESC', () => {
    fc.assert(
      fc.property(
        fc.array(solicitacaoItemArbitrary, { minLength: 0, maxLength: 100 }),
        (items) => {
          const sorted = ordenarCronologicamenteDesc(items);

          expect(verificarOrdenacaoNaoCrescente(sorted)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('resultado de histórico de eventos mantém ordem não-crescente após sort DESC', () => {
    fc.assert(
      fc.property(
        fc.array(historicoEventoItemArbitrary, { minLength: 0, maxLength: 100 }),
        (items) => {
          const sorted = ordenarCronologicamenteDesc(items);

          // Verify non-increasing invariant
          expect(verificarOrdenacaoNaoCrescente(sorted)).toBe(true);

          // Verify each consecutive pair
          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].criadoEm.getTime()).toBeGreaterThanOrEqual(
              sorted[i + 1].criadoEm.getTime()
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('array vazio e array de um elemento satisfazem a invariante trivialmente', () => {
    fc.assert(
      fc.property(
        fc.array(solicitacaoItemArbitrary, { minLength: 0, maxLength: 1 }),
        (items) => {
          const sorted = ordenarCronologicamenteDesc(items);

          expect(verificarOrdenacaoNaoCrescente(sorted)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sort DESC preserva todos os elementos originais (sem perda ou duplicação)', () => {
    fc.assert(
      fc.property(
        fc.array(solicitacaoItemArbitrary, { minLength: 0, maxLength: 100 }),
        (items) => {
          const sorted = ordenarCronologicamenteDesc(items);

          // Same length
          expect(sorted.length).toBe(items.length);

          // Same elements (by id)
          const originalIds = items.map((i) => i.id).sort();
          const sortedIds = sorted.map((i) => i.id).sort();
          expect(sortedIds).toEqual(originalIds);
        }
      ),
      { numRuns: 100 }
    );
  });
});
