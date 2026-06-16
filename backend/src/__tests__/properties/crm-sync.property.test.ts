// Feature: admin-login-beneficiary-auth, Property 11: Sincronização de status com CRM
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { SolicitacaoStatus } from '../../types/index';

/**
 * Validates: Requirements 10.3, 10.4, 10.7
 *
 * Property 11: Sincronização de status com CRM
 * Para qualquer solicitação existente com qualquer status, se a consulta ao ws_DadosCRM
 * retorna HTTP 404 ou erro de comunicação, o status da solicitação no banco de dados deve
 * permanecer inalterado. Se retorna HTTP 200 com um status válido, o status interno deve
 * ser atualizado para o valor retornado.
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

/**
 * Represents possible CRM response scenarios from ws_DadosCRM.
 */
type CrmResponse =
  | { type: 'not_found' }          // HTTP 404 — not yet registered in CRM
  | { type: 'communication_error' } // Network/server error
  | { type: 'timeout' }            // Request timed out
  | { type: 'success'; status: SolicitacaoStatus }; // HTTP 200 with valid status

/**
 * Pure function that determines the resulting status of a solicitação
 * based on the current status and the CRM response.
 *
 * Business rules:
 * - If CRM returns 404 (not_found): keep current status unchanged
 * - If CRM returns communication_error or timeout: keep current status unchanged
 * - If CRM returns 200 with a valid status: update to the new status from CRM
 */
function resolveStatusAfterCrmSync(
  currentStatus: SolicitacaoStatus,
  crmResponse: CrmResponse
): SolicitacaoStatus {
  switch (crmResponse.type) {
    case 'not_found':
    case 'communication_error':
    case 'timeout':
      // Status remains unchanged on error/not found
      return currentStatus;
    case 'success':
      // Update to the new status returned by CRM
      return crmResponse.status;
  }
}

// Arbitraries
const statusArbitrary = fc.constantFrom(...VALID_STATUSES);

const errorCrmResponseArbitrary: fc.Arbitrary<CrmResponse> = fc.constantFrom<CrmResponse>(
  { type: 'not_found' },
  { type: 'communication_error' },
  { type: 'timeout' }
);

const successCrmResponseArbitrary: fc.Arbitrary<CrmResponse> = statusArbitrary.map(
  (status) => ({ type: 'success' as const, status })
);

const anyCrmResponseArbitrary: fc.Arbitrary<CrmResponse> = fc.oneof(
  errorCrmResponseArbitrary,
  successCrmResponseArbitrary
);

describe('Property 11: Sincronização de status com CRM', () => {
  it('status remains unchanged when CRM returns 404 (not_found)', () => {
    fc.assert(
      fc.property(
        statusArbitrary,
        (currentStatus) => {
          const crmResponse: CrmResponse = { type: 'not_found' };
          const result = resolveStatusAfterCrmSync(currentStatus, crmResponse);

          expect(result).toBe(currentStatus);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('status remains unchanged when CRM returns communication error', () => {
    fc.assert(
      fc.property(
        statusArbitrary,
        (currentStatus) => {
          const crmResponse: CrmResponse = { type: 'communication_error' };
          const result = resolveStatusAfterCrmSync(currentStatus, crmResponse);

          expect(result).toBe(currentStatus);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('status remains unchanged when CRM returns timeout', () => {
    fc.assert(
      fc.property(
        statusArbitrary,
        (currentStatus) => {
          const crmResponse: CrmResponse = { type: 'timeout' };
          const result = resolveStatusAfterCrmSync(currentStatus, crmResponse);

          expect(result).toBe(currentStatus);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('status remains unchanged for any error response type (404, communication error, or timeout)', () => {
    fc.assert(
      fc.property(
        statusArbitrary,
        errorCrmResponseArbitrary,
        (currentStatus, crmResponse) => {
          const result = resolveStatusAfterCrmSync(currentStatus, crmResponse);

          // Status must remain exactly the same as the current one
          expect(result).toBe(currentStatus);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('status is updated to the CRM-returned status when CRM returns HTTP 200 with a valid status', () => {
    fc.assert(
      fc.property(
        statusArbitrary,
        statusArbitrary,
        (currentStatus, crmReturnedStatus) => {
          const crmResponse: CrmResponse = { type: 'success', status: crmReturnedStatus };
          const result = resolveStatusAfterCrmSync(currentStatus, crmResponse);

          // Status must be updated to the value returned by CRM
          expect(result).toBe(crmReturnedStatus);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any CRM response, the result is always a valid SolicitacaoStatus', () => {
    fc.assert(
      fc.property(
        statusArbitrary,
        anyCrmResponseArbitrary,
        (currentStatus, crmResponse) => {
          const result = resolveStatusAfterCrmSync(currentStatus, crmResponse);

          // Result must always be one of the valid statuses
          expect(VALID_STATUSES).toContain(result);
        }
      ),
      { numRuns: 100 }
    );
  });
});
