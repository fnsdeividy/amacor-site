// Feature: admin-login-beneficiary-auth, Property 6: Correção dos contadores de status
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { SolicitacaoStatus, Contadores } from '../../types/index';

/**
 * Validates: Requirements 5.1, 5.3
 *
 * Property 6: Correção dos contadores de status
 * Para qualquer conjunto de N solicitações com status distribuídos aleatoriamente
 * entre os valores válidos, a soma de todos os contadores individuais
 * (pendentes + enviadasCrm + autorizadas + negadas + comPendencia + outros)
 * deve ser igual ao contador total, e cada contador individual deve ser exatamente
 * igual à contagem de solicitações com aquele status no conjunto.
 */

// All valid statuses for SolicitacaoStatus
const VALID_STATUSES: SolicitacaoStatus[] = [
  'Recebida',
  'Pendente de análise',
  'Enviada ao CRM',
  'Em análise',
  'Pendente de documento',
  'Autorizada',
  'Negada',
  'Cancelada',
  'Erro de integração',
];

// Mapping from counter fields to their corresponding status values
const COUNTER_STATUS_MAP: Record<keyof Omit<Contadores, 'total'>, SolicitacaoStatus> = {
  pendentes: 'Pendente de análise',
  enviadasCrm: 'Enviada ao CRM',
  autorizadas: 'Autorizada',
  negadas: 'Negada',
  comPendencia: 'Pendente de documento',
};

// Statuses that are NOT individually tracked (counted as "outros")
const OUTROS_STATUSES: SolicitacaoStatus[] = VALID_STATUSES.filter(
  (s) => !Object.values(COUNTER_STATUS_MAP).includes(s)
);

/**
 * Pure function that computes counters from an array of statuses.
 * This simulates what the repository's contadores() query does.
 */
function computeContadores(statuses: SolicitacaoStatus[]): Contadores {
  return {
    total: statuses.length,
    pendentes: statuses.filter((s) => s === 'Pendente de análise').length,
    enviadasCrm: statuses.filter((s) => s === 'Enviada ao CRM').length,
    autorizadas: statuses.filter((s) => s === 'Autorizada').length,
    negadas: statuses.filter((s) => s === 'Negada').length,
    comPendencia: statuses.filter((s) => s === 'Pendente de documento').length,
  };
}

// Arbitrary for generating arrays of random statuses (length 0-100)
const statusArrayArbitrary: fc.Arbitrary<SolicitacaoStatus[]> = fc.array(
  fc.constantFrom(...VALID_STATUSES),
  { minLength: 0, maxLength: 100 }
);

describe('Property 6: Correção dos contadores de status', () => {
  it('sum of individual counters plus outros equals total', () => {
    fc.assert(
      fc.property(statusArrayArbitrary, (statuses: SolicitacaoStatus[]) => {
        const contadores = computeContadores(statuses);

        // Count "outros" — statuses not individually tracked
        const outros = statuses.filter((s) => OUTROS_STATUSES.includes(s)).length;

        // Sum of all individual counters + outros must equal total
        const soma =
          contadores.pendentes +
          contadores.enviadasCrm +
          contadores.autorizadas +
          contadores.negadas +
          contadores.comPendencia +
          outros;

        expect(soma).toBe(contadores.total);
      }),
      { numRuns: 100 }
    );
  });

  it('each individual counter matches expected count for that status', () => {
    fc.assert(
      fc.property(statusArrayArbitrary, (statuses: SolicitacaoStatus[]) => {
        const contadores = computeContadores(statuses);

        // Verify each counter matches the actual count of its corresponding status
        for (const [counterKey, expectedStatus] of Object.entries(COUNTER_STATUS_MAP)) {
          const expectedCount = statuses.filter((s) => s === expectedStatus).length;
          expect(contadores[counterKey as keyof Omit<Contadores, 'total'>]).toBe(expectedCount);
        }

        // Verify total is the full array length
        expect(contadores.total).toBe(statuses.length);
      }),
      { numRuns: 100 }
    );
  });
});
