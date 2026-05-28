import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterBySubstring } from '../../utils/filters';

/**
 * Feature: amacor-website, Property 6: Case-insensitive substring filter
 *
 * For any list of items with text labels and any search string, the filter function
 * SHALL return exactly those items whose label contains the search string as a
 * case-insensitive substring, and SHALL exclude all items that do not contain it.
 *
 * Validates: Requirements 8.3, 9.3
 */
describe('Property 6: Case-insensitive substring filter', () => {
  // Arbitrary for items with text labels
  const itemArb = fc.record({
    id: fc.uuid(),
    label: fc.string({ minLength: 0, maxLength: 50 }),
  });

  const itemListArb = fc.array(itemArb, { minLength: 0, maxLength: 30 });
  const searchStringArb = fc.string({ minLength: 1, maxLength: 20 });

  it('returns exactly items containing the search string case-insensitively (no false positives)', () => {
    fc.assert(
      fc.property(itemListArb, searchStringArb, (items, searchQuery) => {
        const result = filterBySubstring(items, searchQuery, (item) => item.label);

        // Every returned item must contain the search string case-insensitively
        const normalizedQuery = searchQuery.toLowerCase().trim();
        for (const item of result) {
          expect(item.label.toLowerCase().includes(normalizedQuery)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('returns exactly items containing the search string case-insensitively (no false negatives)', () => {
    fc.assert(
      fc.property(itemListArb, searchStringArb, (items, searchQuery) => {
        const result = filterBySubstring(items, searchQuery, (item) => item.label);

        // Every item NOT in the result must NOT contain the search string case-insensitively
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const resultIds = new Set(result.map((item) => item.id));

        for (const item of items) {
          if (!resultIds.has(item.id)) {
            expect(item.label.toLowerCase().includes(normalizedQuery)).toBe(false);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('result count equals the count of items whose label contains the search string', () => {
    fc.assert(
      fc.property(itemListArb, searchStringArb, (items, searchQuery) => {
        const result = filterBySubstring(items, searchQuery, (item) => item.label);

        const normalizedQuery = searchQuery.toLowerCase().trim();
        const expectedCount = items.filter((item) =>
          item.label.toLowerCase().includes(normalizedQuery)
        ).length;

        expect(result.length).toBe(expectedCount);
      }),
      { numRuns: 100 }
    );
  });

  it('returns all items when search string is empty or whitespace', () => {
    fc.assert(
      fc.property(itemListArb, (items) => {
        const resultEmpty = filterBySubstring(items, '', (item) => item.label);
        expect(resultEmpty.length).toBe(items.length);

        const resultWhitespace = filterBySubstring(items, '   ', (item) => item.label);
        expect(resultWhitespace.length).toBe(items.length);
      }),
      { numRuns: 100 }
    );
  });

  it('filter is case-insensitive: searching with any case variant yields same results', () => {
    fc.assert(
      fc.property(itemListArb, searchStringArb, (items, searchQuery) => {
        const resultLower = filterBySubstring(items, searchQuery.toLowerCase(), (item) => item.label);
        const resultUpper = filterBySubstring(items, searchQuery.toUpperCase(), (item) => item.label);
        const resultOriginal = filterBySubstring(items, searchQuery, (item) => item.label);

        expect(resultLower.length).toBe(resultOriginal.length);
        expect(resultUpper.length).toBe(resultOriginal.length);

        // Same items returned regardless of case
        const idsLower = resultLower.map((item) => item.id);
        const idsUpper = resultUpper.map((item) => item.id);
        const idsOriginal = resultOriginal.map((item) => item.id);

        expect(idsLower).toEqual(idsOriginal);
        expect(idsUpper).toEqual(idsOriginal);
      }),
      { numRuns: 100 }
    );
  });

  it('preserves original item order in filtered results', () => {
    fc.assert(
      fc.property(itemListArb, searchStringArb, (items, searchQuery) => {
        const result = filterBySubstring(items, searchQuery, (item) => item.label);

        // Result items should appear in the same relative order as in the original list
        let lastIndex = -1;
        for (const resultItem of result) {
          const currentIndex = items.findIndex((item) => item.id === resultItem.id);
          expect(currentIndex).toBeGreaterThan(lastIndex);
          lastIndex = currentIndex;
        }
      }),
      { numRuns: 100 }
    );
  });
});
