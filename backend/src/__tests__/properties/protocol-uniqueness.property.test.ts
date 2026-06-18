// Feature: beneficiary-auth-portal, Property 12: Unicidade de protocolos gerados
// **Validates: Requirements 7.2, 15.1, 15.2**

import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { gerarProtocolo, calcularProximoSequencial, gerarProtocoloUnico } from '../../utils/protocol';

const PROTOCOL_REGEX = /^AMCR-\d{8}-\d{4}$/;

describe('Property 12: Unicidade de protocolos gerados', () => {
  it('todos os protocolos gerados a partir de sequências distintas devem ser únicos entre si', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 1, max: 9999 }), { minLength: 2, maxLength: 50 }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (sequenceNumbers, date) => {
          const protocols = sequenceNumbers.map((seq) => gerarProtocolo(seq, date));

          // All protocols must be distinct
          const uniqueProtocols = new Set(protocols);
          return uniqueProtocols.size === protocols.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('todos os protocolos gerados devem seguir o formato AMCR-YYYYMMDD-NNNN', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9999 }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (sequenceNumber, date) => {
          const protocol = gerarProtocolo(sequenceNumber, date);
          return PROTOCOL_REGEX.test(protocol);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('protocolos com mesma data e sequências distintas devem diferir na parte sequencial', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 1, max: 9999 }), { minLength: 2, maxLength: 100 }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (sequenceNumbers, date) => {
          const protocols = sequenceNumbers.map((seq) => gerarProtocolo(seq, date));
          const uniqueProtocols = new Set(protocols);
          return uniqueProtocols.size === protocols.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('gerarProtocoloUnico nunca gera protocolo que já existe na lista', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 1, max: 9998 }), { minLength: 1, maxLength: 20 }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (sequenceNumbers, date) => {
          const existingProtocols = sequenceNumbers.map((seq) => gerarProtocolo(seq, date));
          const newProtocol = gerarProtocoloUnico(existingProtocols, date);

          // New protocol must not be in existing list
          return !existingProtocols.includes(newProtocol);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('calcularProximoSequencial retorna valor maior que qualquer sequencial existente para a mesma data', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 1, max: 9998 }), { minLength: 1, maxLength: 20 }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (sequenceNumbers, date) => {
          const existingProtocols = sequenceNumbers.map((seq) => gerarProtocolo(seq, date));
          const nextSeq = calcularProximoSequencial(existingProtocols, date);

          // Next sequential must be greater than all existing ones for same date
          return nextSeq > Math.max(...sequenceNumbers);
        }
      ),
      { numRuns: 100 }
    );
  });
});
