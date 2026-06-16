// Feature: admin-login-beneficiary-auth, Property 12: Unicidade de protocolos gerados
// **Validates: Requirements 10.1**

import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { gerarProtocolo } from '../../utils/protocol';

const PROTOCOL_REGEX = /^AMC-\d{8}-\d{5}$/;

describe('Property 12: Unicidade de protocolos gerados', () => {
  it('todos os protocolos gerados a partir de sequências distintas devem ser únicos entre si', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 1, max: 99999 }), { minLength: 2, maxLength: 50 }),
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

  it('todos os protocolos gerados devem seguir o formato AMC-YYYYMMDD-NNNNN', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99999 }),
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
        fc.uniqueArray(fc.integer({ min: 1, max: 99999 }), { minLength: 2, maxLength: 100 }),
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
});
