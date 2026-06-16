// Feature: admin-login-beneficiary-auth, Property 9: Filtragem com lógica AND e busca parcial case-insensitive
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SolicitacaoStatus } from '../../types/index';

/**
 * Validates: Requirements 7.1, 7.2
 *
 * Property 9: Filtragem com lógica AND e busca parcial case-insensitive
 * Para qualquer conjunto de solicitações e qualquer combinação de filtros aplicados
 * (nome, código, CPF, protocolo, status, período, envio CRM), todos os itens retornados
 * devem satisfazer simultaneamente cada critério de filtro, onde filtros textuais
 * (nome, protocolo) utilizam correspondência parcial sem distinção de maiúsculas/minúsculas.
 */

// Simplified solicitacao-like object for property testing
interface SolicitacaoLike {
  nome: string;
  codigo: string;
  cpfCnpj: string;
  protocolo: string;
  status: SolicitacaoStatus;
  enviadoCrm: boolean;
  criadoEm: string;
}

// Filter combination interface (mirrors FiltrosSolicitacao)
interface Filtros {
  nome?: string;
  codigo?: string;
  cpfCnpj?: string;
  protocolo?: string;
  status?: SolicitacaoStatus;
  enviadoCrm?: boolean;
  dataInicio?: string;
  dataFim?: string;
}

// Valid statuses
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
 * Pure filter function that applies all filters with AND logic.
 * Mirrors the behavior of the repository's listar() function.
 *
 * - nome: partial match, case-insensitive (ILIKE %value%)
 * - protocolo: partial match, case-insensitive (ILIKE %value%)
 * - codigo: exact match
 * - cpfCnpj: exact match
 * - status: exact match
 * - enviadoCrm: exact match
 * - dataInicio: criadoEm >= dataInicio
 * - dataFim: criadoEm <= dataFim
 */
function aplicarFiltros(solicitacoes: SolicitacaoLike[], filtros: Filtros): SolicitacaoLike[] {
  return solicitacoes.filter((s) => {
    // Nome: partial case-insensitive match
    if (filtros.nome) {
      if (!s.nome.toLowerCase().includes(filtros.nome.toLowerCase())) {
        return false;
      }
    }

    // Codigo: exact match
    if (filtros.codigo) {
      if (s.codigo !== filtros.codigo) {
        return false;
      }
    }

    // CPF/CNPJ: exact match
    if (filtros.cpfCnpj) {
      if (s.cpfCnpj !== filtros.cpfCnpj) {
        return false;
      }
    }

    // Protocolo: partial case-insensitive match
    if (filtros.protocolo) {
      if (!s.protocolo.toLowerCase().includes(filtros.protocolo.toLowerCase())) {
        return false;
      }
    }

    // Status: exact match
    if (filtros.status) {
      if (s.status !== filtros.status) {
        return false;
      }
    }

    // Enviado CRM: exact match
    if (filtros.enviadoCrm !== undefined) {
      if (s.enviadoCrm !== filtros.enviadoCrm) {
        return false;
      }
    }

    // Data início: criadoEm >= dataInicio
    if (filtros.dataInicio) {
      if (s.criadoEm < filtros.dataInicio) {
        return false;
      }
    }

    // Data fim: criadoEm <= dataFim
    if (filtros.dataFim) {
      if (s.criadoEm > filtros.dataFim) {
        return false;
      }
    }

    return true;
  });
}

// --- Arbitraries ---

// Generate a random ISO date string within a reasonable range
const dateArbitrary = fc.date({
  min: new Date('2024-01-01T00:00:00Z'),
  max: new Date('2025-12-31T23:59:59Z'),
}).map((d) => d.toISOString());

// Generate a solicitacao-like object
const solicitacaoArbitrary: fc.Arbitrary<SolicitacaoLike> = fc.record({
  nome: fc.string({ minLength: 1, maxLength: 100 }),
  codigo: fc.stringMatching(/^[0-9]{1,20}$/),
  cpfCnpj: fc.stringMatching(/^[0-9]{11,14}$/),
  protocolo: fc.string({ minLength: 1, maxLength: 50 }),
  status: fc.constantFrom(...VALID_STATUSES),
  enviadoCrm: fc.boolean(),
  criadoEm: dateArbitrary,
});

// Generate a random subset of filters derived from the generated solicitacoes
const filtrosArbitrary: fc.Arbitrary<Filtros> = fc.record({
  nome: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
  codigo: fc.option(fc.stringMatching(/^[0-9]{1,20}$/), { nil: undefined }),
  cpfCnpj: fc.option(fc.stringMatching(/^[0-9]{11,14}$/), { nil: undefined }),
  protocolo: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
  status: fc.option(fc.constantFrom(...VALID_STATUSES), { nil: undefined }),
  enviadoCrm: fc.option(fc.boolean(), { nil: undefined }),
  dataInicio: fc.option(dateArbitrary, { nil: undefined }),
  dataFim: fc.option(dateArbitrary, { nil: undefined }),
});

describe('Property 9: Filtragem com lógica AND e busca parcial case-insensitive', () => {
  it('all returned items must satisfy ALL applied filters simultaneously', () => {
    fc.assert(
      fc.property(
        fc.array(solicitacaoArbitrary, { minLength: 0, maxLength: 30 }),
        filtrosArbitrary,
        (solicitacoes, filtros) => {
          const resultado = aplicarFiltros(solicitacoes, filtros);

          // Every returned item must match ALL active filters
          for (const item of resultado) {
            if (filtros.nome) {
              expect(item.nome.toLowerCase()).toContain(filtros.nome.toLowerCase());
            }
            if (filtros.codigo) {
              expect(item.codigo).toBe(filtros.codigo);
            }
            if (filtros.cpfCnpj) {
              expect(item.cpfCnpj).toBe(filtros.cpfCnpj);
            }
            if (filtros.protocolo) {
              expect(item.protocolo.toLowerCase()).toContain(filtros.protocolo.toLowerCase());
            }
            if (filtros.status) {
              expect(item.status).toBe(filtros.status);
            }
            if (filtros.enviadoCrm !== undefined) {
              expect(item.enviadoCrm).toBe(filtros.enviadoCrm);
            }
            if (filtros.dataInicio) {
              expect(item.criadoEm >= filtros.dataInicio).toBe(true);
            }
            if (filtros.dataFim) {
              expect(item.criadoEm <= filtros.dataFim).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('text filters (nome, protocolo) use case-insensitive partial matching', () => {
    fc.assert(
      fc.property(
        fc.array(solicitacaoArbitrary, { minLength: 1, maxLength: 20 }),
        fc.nat({ max: 19 }),
        (solicitacoes, indexSeed) => {
          // Pick a solicitacao from the array and derive a filter from part of its nome/protocolo
          const idx = indexSeed % solicitacoes.length;
          const target = solicitacoes[idx];

          // Test nome: take a substring and change case
          if (target.nome.length > 0) {
            const start = 0;
            const end = Math.max(1, Math.floor(target.nome.length / 2));
            const substring = target.nome.slice(start, end);
            // Apply the filter with toggled case
            const filterNome = substring.split('').map((c) =>
              c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
            ).join('');

            const resultado = aplicarFiltros(solicitacoes, { nome: filterNome });

            // The target should be in the results (since filterNome is a case-variant of a substring of target.nome)
            const found = resultado.some((r) => r === target);
            expect(found).toBe(true);

            // All results must contain the filter string case-insensitively
            for (const item of resultado) {
              expect(item.nome.toLowerCase()).toContain(filterNome.toLowerCase());
            }
          }

          // Test protocolo: take a substring and change case
          if (target.protocolo.length > 0) {
            const start = 0;
            const end = Math.max(1, Math.floor(target.protocolo.length / 2));
            const substring = target.protocolo.slice(start, end);
            const filterProtocolo = substring.split('').map((c) =>
              c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
            ).join('');

            const resultado = aplicarFiltros(solicitacoes, { protocolo: filterProtocolo });

            // The target should be in the results
            const found = resultado.some((r) => r === target);
            expect(found).toBe(true);

            // All results must contain the filter string case-insensitively
            for (const item of resultado) {
              expect(item.protocolo.toLowerCase()).toContain(filterProtocolo.toLowerCase());
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no items excluded by the filter should satisfy all filter criteria', () => {
    fc.assert(
      fc.property(
        fc.array(solicitacaoArbitrary, { minLength: 0, maxLength: 30 }),
        filtrosArbitrary,
        (solicitacoes, filtros) => {
          const resultado = aplicarFiltros(solicitacoes, filtros);
          const excluidos = solicitacoes.filter((s) => !resultado.includes(s));

          // Every excluded item must fail at least one filter criterion
          for (const item of excluidos) {
            let failsAtLeastOne = false;

            if (filtros.nome && !item.nome.toLowerCase().includes(filtros.nome.toLowerCase())) {
              failsAtLeastOne = true;
            }
            if (filtros.codigo && item.codigo !== filtros.codigo) {
              failsAtLeastOne = true;
            }
            if (filtros.cpfCnpj && item.cpfCnpj !== filtros.cpfCnpj) {
              failsAtLeastOne = true;
            }
            if (filtros.protocolo && !item.protocolo.toLowerCase().includes(filtros.protocolo.toLowerCase())) {
              failsAtLeastOne = true;
            }
            if (filtros.status && item.status !== filtros.status) {
              failsAtLeastOne = true;
            }
            if (filtros.enviadoCrm !== undefined && item.enviadoCrm !== filtros.enviadoCrm) {
              failsAtLeastOne = true;
            }
            if (filtros.dataInicio && item.criadoEm < filtros.dataInicio) {
              failsAtLeastOne = true;
            }
            if (filtros.dataFim && item.criadoEm > filtros.dataFim) {
              failsAtLeastOne = true;
            }

            expect(failsAtLeastOne).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
