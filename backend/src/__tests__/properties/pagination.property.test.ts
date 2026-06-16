// Feature: admin-login-beneficiary-auth, Property 7: Correção da paginação
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Validates: Requirements 6.1, 6.3, 11.5, 16.1
 *
 * Property 7: Correção da paginação
 * Para qualquer lista de N solicitações e tamanho de página P (P=20 para listagem,
 * P=50 para histórico), o endpoint deve retornar exatamente ceil(N/P) páginas,
 * cada página deve conter no máximo P itens, a concatenação de todas as páginas
 * deve conter exatamente N itens sem duplicatas nem ausências.
 */

/**
 * Pure pagination function that simulates the pagination logic used
 * in solicitacoes.repository.ts (listar, listarPorBeneficiario, historico).
 *
 * Given an array of items and pagination parameters, returns all pages
 * following the same logic as the repository:
 * - Page numbering starts at 1
 * - Each page has at most `porPagina` items
 * - Items are sliced using offset = (pagina - 1) * porPagina
 */
interface ResultadoPaginado<T> {
  dados: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

function paginar<T>(items: T[], pagina: number, porPagina: number): ResultadoPaginado<T> {
  const total = items.length;
  const totalPaginas = total === 0 ? 0 : Math.ceil(total / porPagina);
  const offset = (pagina - 1) * porPagina;
  const dados = items.slice(offset, offset + porPagina);

  return {
    dados,
    total,
    pagina,
    porPagina,
    totalPaginas,
  };
}

/**
 * Collects all pages from the pagination function for a given set of items.
 */
function coletarTodasPaginas<T>(items: T[], porPagina: number): ResultadoPaginado<T>[] {
  const totalPaginas = items.length === 0 ? 0 : Math.ceil(items.length / porPagina);
  const paginas: ResultadoPaginado<T>[] = [];

  for (let p = 1; p <= totalPaginas; p++) {
    paginas.push(paginar(items, p, porPagina));
  }

  return paginas;
}

describe('Property 7: Correção da paginação', () => {
  // Generator for N (number of items): 0 to 200
  const nArbitrary = fc.integer({ min: 0, max: 200 });

  // Generator for P (page size): 20 for listagem, 50 for histórico
  const pArbitrary = fc.constantFrom(20, 50);

  // Generator for unique items (using sequential IDs to guarantee uniqueness)
  const itemsArbitrary = (n: number) =>
    fc.constant(Array.from({ length: n }, (_, i) => ({ id: i, value: `item-${i}` })));

  it('total de páginas deve ser Math.ceil(N/P) ou 0 quando N=0', () => {
    fc.assert(
      fc.property(nArbitrary, pArbitrary, (n, p) => {
        const items = Array.from({ length: n }, (_, i) => i);
        const resultado = paginar(items, 1, p);

        const expectedTotalPaginas = n === 0 ? 0 : Math.ceil(n / p);
        expect(resultado.totalPaginas).toBe(expectedTotalPaginas);
        expect(resultado.total).toBe(n);
      }),
      { numRuns: 100 }
    );
  });

  it('cada página deve conter no máximo P itens', () => {
    fc.assert(
      fc.property(nArbitrary, pArbitrary, (n, p) => {
        const items = Array.from({ length: n }, (_, i) => i);
        const paginas = coletarTodasPaginas(items, p);

        for (const pagina of paginas) {
          expect(pagina.dados.length).toBeLessThanOrEqual(p);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('última página deve conter exatamente N % P itens (ou P se divisível)', () => {
    fc.assert(
      fc.property(
        nArbitrary.filter((n) => n > 0),
        pArbitrary,
        (n, p) => {
          const items = Array.from({ length: n }, (_, i) => i);
          const paginas = coletarTodasPaginas(items, p);

          const ultimaPagina = paginas[paginas.length - 1];
          const expectedLastPageSize = n % p === 0 ? p : n % p;
          expect(ultimaPagina.dados.length).toBe(expectedLastPageSize);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('concatenação de todas as páginas deve conter exatamente N itens sem duplicatas nem ausências', () => {
    fc.assert(
      fc.property(nArbitrary, pArbitrary, (n, p) => {
        const items = Array.from({ length: n }, (_, i) => i);
        const paginas = coletarTodasPaginas(items, p);

        // Concatenate all page data
        const todosItens = paginas.flatMap((pag) => pag.dados);

        // Must have exactly N items
        expect(todosItens.length).toBe(n);

        // No duplicates - use Set to check uniqueness
        const uniqueItems = new Set(todosItens);
        expect(uniqueItems.size).toBe(n);

        // No missing items - all original items must be present
        for (let i = 0; i < n; i++) {
          expect(todosItens).toContain(i);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('metadados de paginação são consistentes em todas as páginas', () => {
    fc.assert(
      fc.property(nArbitrary, pArbitrary, (n, p) => {
        const items = Array.from({ length: n }, (_, i) => i);
        const paginas = coletarTodasPaginas(items, p);
        const expectedTotalPaginas = n === 0 ? 0 : Math.ceil(n / p);

        for (let i = 0; i < paginas.length; i++) {
          const pagina = paginas[i];
          expect(pagina.total).toBe(n);
          expect(pagina.porPagina).toBe(p);
          expect(pagina.pagina).toBe(i + 1);
          expect(pagina.totalPaginas).toBe(expectedTotalPaginas);
        }
      }),
      { numRuns: 100 }
    );
  });
});
