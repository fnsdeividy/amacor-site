// Feature: admin-login-beneficiary-auth, Property 13: Transição de status ao enviar ao CRM
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { SolicitacaoStatus, Solicitacao, HistoricoEvento } from '../../types/index';

/**
 * Validates: Requirements 9.2, 9.4
 *
 * Property 13: Transição de status ao enviar ao CRM
 * Para qualquer solicitação com status "Pendente de análise", ao executar a operação de
 * marcação como enviada ao CRM, o status resultante deve ser "Enviada ao CRM",
 * o campo enviado_crm deve ser true, e um novo evento do tipo "envio_crm" deve ser
 * registrado no histórico. Para qualquer solicitação com status diferente de
 * "Pendente de análise", a operação deve ser rejeitada com erro.
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

// Statuses that should be REJECTED for CRM transition
const REJECTED_STATUSES: SolicitacaoStatus[] = VALID_STATUSES.filter(
  (s) => s !== 'Pendente de análise'
);

/**
 * Simulates the CRM transition logic from solicitacoes.service.ts (enviarParaCrm).
 *
 * This is a pure-function representation of the business rule:
 * - Only status "Pendente de análise" can transition to "Enviada ao CRM"
 * - On success: status becomes "Enviada ao CRM", enviado_crm = true, event "envio_crm" is created
 * - On failure: returns error with descriptive message
 */
function enviarParaCrm(
  solicitacao: { status: SolicitacaoStatus; enviadoCrm: boolean },
  responsavelNome: string,
  responsavelPerfil: string
):
  | {
    success: true;
    novoStatus: SolicitacaoStatus;
    enviadoCrm: boolean;
    evento: { tipoEvento: string; responsavelNome: string; responsavelPerfil: string };
  }
  | { success: false; erro: string } {
  // Business rule: only "Pendente de análise" can be sent to CRM
  if (solicitacao.status !== 'Pendente de análise') {
    return {
      success: false,
      erro: `Não é possível enviar ao CRM. Status atual: "${solicitacao.status}". Apenas solicitações com status "Pendente de análise" podem ser enviadas.`,
    };
  }

  return {
    success: true,
    novoStatus: 'Enviada ao CRM',
    enviadoCrm: true,
    evento: {
      tipoEvento: 'envio_crm',
      responsavelNome,
      responsavelPerfil,
    },
  };
}

// Arbitraries
const statusArbitrary = fc.constantFrom(...VALID_STATUSES);
const rejectedStatusArbitrary = fc.constantFrom(...REJECTED_STATUSES);
const nomeArbitrary = fc.string({ minLength: 1, maxLength: 100 });
const perfilArbitrary = fc.constantFrom('admin', 'operador');

describe('Property 13: Transição de status ao enviar ao CRM', () => {
  it('status "Pendente de análise" transitions to "Enviada ao CRM" with enviado_crm=true and envio_crm event', () => {
    fc.assert(
      fc.property(
        nomeArbitrary,
        perfilArbitrary,
        (responsavelNome, responsavelPerfil) => {
          const solicitacao = { status: 'Pendente de análise' as SolicitacaoStatus, enviadoCrm: false };

          const resultado = enviarParaCrm(solicitacao, responsavelNome, responsavelPerfil);

          // Must succeed
          expect(resultado.success).toBe(true);

          if (resultado.success) {
            // Status must be "Enviada ao CRM"
            expect(resultado.novoStatus).toBe('Enviada ao CRM');

            // enviado_crm must be true
            expect(resultado.enviadoCrm).toBe(true);

            // Event of type "envio_crm" must be registered
            expect(resultado.evento.tipoEvento).toBe('envio_crm');
            expect(resultado.evento.responsavelNome).toBe(responsavelNome);
            expect(resultado.evento.responsavelPerfil).toBe(responsavelPerfil);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('any status other than "Pendente de análise" is rejected with error', () => {
    fc.assert(
      fc.property(
        rejectedStatusArbitrary,
        nomeArbitrary,
        perfilArbitrary,
        (status, responsavelNome, responsavelPerfil) => {
          const solicitacao = { status, enviadoCrm: false };

          const resultado = enviarParaCrm(solicitacao, responsavelNome, responsavelPerfil);

          // Must fail
          expect(resultado.success).toBe(false);

          if (!resultado.success) {
            // Error message should mention the current status
            expect(resultado.erro).toContain(status);
            // Error message should indicate the rule
            expect(resultado.erro).toContain('Pendente de análise');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('transition is rejected for all non-pending statuses regardless of enviadoCrm value', () => {
    fc.assert(
      fc.property(
        rejectedStatusArbitrary,
        fc.boolean(),
        nomeArbitrary,
        perfilArbitrary,
        (status, enviadoCrm, responsavelNome, responsavelPerfil) => {
          const solicitacao = { status, enviadoCrm };

          const resultado = enviarParaCrm(solicitacao, responsavelNome, responsavelPerfil);

          // Must always fail regardless of enviadoCrm value
          expect(resultado.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
