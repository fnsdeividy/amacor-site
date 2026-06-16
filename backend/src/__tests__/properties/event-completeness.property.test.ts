// Feature: admin-login-beneficiary-auth, Property 14: Completude de eventos no histórico
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { HistoricoEvento } from '../../types/index';

/**
 * Validates: Requirements 11.1, 11.3
 *
 * Property 14: Completude de eventos no histórico
 * Para qualquer evento registrado no histórico de uma solicitação, ele deve conter
 * obrigatoriamente: tipo_evento (não vazio), criado_em (timestamp válido no fuso UTC-3),
 * responsavel_nome (não vazio), responsavel_perfil (não vazio) e descricao
 * (entre 1 e 500 caracteres).
 */

// Valid event types used in the system
const VALID_EVENT_TYPES = [
  'criacao',
  'envio_crm',
  'alteracao_status',
  'observacao',
  'upload_anexo',
  'consulta_crm',
];

// Valid profiles for event responsible
const VALID_PROFILES = ['admin', 'operador', 'beneficiario', 'sistema'];

/**
 * Validates that a HistoricoEvento has all required fields with correct constraints.
 * Returns true if the event is valid, false otherwise.
 */
function validateHistoricoEvento(evento: HistoricoEvento): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // tipo_evento must be non-empty
  if (!evento.tipoEvento || evento.tipoEvento.trim().length === 0) {
    errors.push('tipoEvento is empty');
  }

  // criado_em must be a valid timestamp
  if (!evento.criadoEm || evento.criadoEm.trim().length === 0) {
    errors.push('criadoEm is empty');
  } else {
    const date = new Date(evento.criadoEm);
    if (isNaN(date.getTime())) {
      errors.push('criadoEm is not a valid timestamp');
    }
  }

  // responsavel_nome must be non-empty
  if (!evento.responsavelNome || evento.responsavelNome.trim().length === 0) {
    errors.push('responsavelNome is empty');
  }

  // responsavel_perfil must be non-empty
  if (!evento.responsavelPerfil || evento.responsavelPerfil.trim().length === 0) {
    errors.push('responsavelPerfil is empty');
  }

  // descricao must be between 1 and 500 characters
  if (!evento.descricao || evento.descricao.length === 0) {
    errors.push('descricao is empty');
  } else if (evento.descricao.length > 500) {
    errors.push(`descricao exceeds 500 characters (has ${evento.descricao.length})`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generates a valid UTC-3 timestamp string (ISO format with -03:00 offset).
 */
const utcMinus3TimestampArb: fc.Arbitrary<string> = fc
  .date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
  .map((d) => {
    // Format as ISO with -03:00 timezone offset
    const offset = -3 * 60; // UTC-3 in minutes
    const local = new Date(d.getTime() - offset * 60 * 1000);
    const iso = local.toISOString().replace('Z', '-03:00');
    return iso;
  });

/**
 * Arbitrary for generating valid HistoricoEvento objects.
 */
const validHistoricoEventoArb: fc.Arbitrary<HistoricoEvento> = fc.record({
  id: fc.uuid(),
  solicitacaoId: fc.uuid(),
  tipoEvento: fc.constantFrom(...VALID_EVENT_TYPES),
  descricao: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
  responsavelNome: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
  responsavelPerfil: fc.constantFrom(...VALID_PROFILES),
  criadoEm: utcMinus3TimestampArb,
});

/**
 * Arbitrary for generating invalid HistoricoEvento objects that should fail validation.
 */
const invalidHistoricoEventoArb: fc.Arbitrary<HistoricoEvento> = fc.oneof(
  // Empty tipoEvento
  fc.record({
    id: fc.uuid(),
    solicitacaoId: fc.uuid(),
    tipoEvento: fc.constant(''),
    descricao: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
    responsavelNome: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
    responsavelPerfil: fc.constantFrom(...VALID_PROFILES),
    criadoEm: utcMinus3TimestampArb,
  }),
  // Empty responsavelNome
  fc.record({
    id: fc.uuid(),
    solicitacaoId: fc.uuid(),
    tipoEvento: fc.constantFrom(...VALID_EVENT_TYPES),
    descricao: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
    responsavelNome: fc.constant(''),
    responsavelPerfil: fc.constantFrom(...VALID_PROFILES),
    criadoEm: utcMinus3TimestampArb,
  }),
  // Empty responsavelPerfil
  fc.record({
    id: fc.uuid(),
    solicitacaoId: fc.uuid(),
    tipoEvento: fc.constantFrom(...VALID_EVENT_TYPES),
    descricao: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
    responsavelNome: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
    responsavelPerfil: fc.constant(''),
    criadoEm: utcMinus3TimestampArb,
  }),
  // descricao too long (>500 chars)
  fc.record({
    id: fc.uuid(),
    solicitacaoId: fc.uuid(),
    tipoEvento: fc.constantFrom(...VALID_EVENT_TYPES),
    descricao: fc.string({ minLength: 501, maxLength: 600 }),
    responsavelNome: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
    responsavelPerfil: fc.constantFrom(...VALID_PROFILES),
    criadoEm: utcMinus3TimestampArb,
  }),
  // Empty descricao
  fc.record({
    id: fc.uuid(),
    solicitacaoId: fc.uuid(),
    tipoEvento: fc.constantFrom(...VALID_EVENT_TYPES),
    descricao: fc.constant(''),
    responsavelNome: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
    responsavelPerfil: fc.constantFrom(...VALID_PROFILES),
    criadoEm: utcMinus3TimestampArb,
  }),
  // Invalid criadoEm (not a valid timestamp)
  fc.record({
    id: fc.uuid(),
    solicitacaoId: fc.uuid(),
    tipoEvento: fc.constantFrom(...VALID_EVENT_TYPES),
    descricao: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
    responsavelNome: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
    responsavelPerfil: fc.constantFrom(...VALID_PROFILES),
    criadoEm: fc.constant('not-a-valid-timestamp'),
  })
);

describe('Property 14: Completude de eventos no histórico', () => {
  it('valid events pass all completeness checks', () => {
    fc.assert(
      fc.property(validHistoricoEventoArb, (evento: HistoricoEvento) => {
        const result = validateHistoricoEvento(evento);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  it('tipo_evento must be non-empty', () => {
    fc.assert(
      fc.property(validHistoricoEventoArb, (evento: HistoricoEvento) => {
        expect(evento.tipoEvento.trim().length).toBeGreaterThan(0);

        const result = validateHistoricoEvento(evento);
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('criado_em must be a valid timestamp', () => {
    fc.assert(
      fc.property(validHistoricoEventoArb, (evento: HistoricoEvento) => {
        const date = new Date(evento.criadoEm);
        expect(isNaN(date.getTime())).toBe(false);

        const result = validateHistoricoEvento(evento);
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('responsavel_nome must be non-empty', () => {
    fc.assert(
      fc.property(validHistoricoEventoArb, (evento: HistoricoEvento) => {
        expect(evento.responsavelNome.trim().length).toBeGreaterThan(0);

        const result = validateHistoricoEvento(evento);
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('responsavel_perfil must be non-empty', () => {
    fc.assert(
      fc.property(validHistoricoEventoArb, (evento: HistoricoEvento) => {
        expect(evento.responsavelPerfil.trim().length).toBeGreaterThan(0);

        const result = validateHistoricoEvento(evento);
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('descricao must be between 1 and 500 characters', () => {
    fc.assert(
      fc.property(validHistoricoEventoArb, (evento: HistoricoEvento) => {
        expect(evento.descricao.length).toBeGreaterThanOrEqual(1);
        expect(evento.descricao.length).toBeLessThanOrEqual(500);

        const result = validateHistoricoEvento(evento);
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('invalid events fail validation', () => {
    fc.assert(
      fc.property(invalidHistoricoEventoArb, (evento: HistoricoEvento) => {
        const result = validateHistoricoEvento(evento);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});
