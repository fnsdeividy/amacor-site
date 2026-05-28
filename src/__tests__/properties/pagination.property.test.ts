/**
 * Property-based tests for pagination calculation correctness.
 *
 * Feature: amacor-website, Property 5: Pagination calculation correctness
 *
 * Validates: Requirements 7.19
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateTotalPages,
  calculateStartIndex,
  calculateEndIndex,
  DEFAULT_PAGE_SIZE,
} from '../../utils/pagination';

describe('Property 5: Pagination calculation correctness', () => {
  const PAGE_SIZE = DEFAULT_PAGE_SIZE; // 20

  it('totalPages equals Math.ceil(totalItems / 20) for totalItems > 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (totalItems) => {
          const totalPages = calculateTotalPages(totalItems, PAGE_SIZE);
          expect(totalPages).toBe(Math.ceil(totalItems / PAGE_SIZE));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('totalPages is 0 when totalItems is 0', () => {
    const totalPages = calculateTotalPages(0, PAGE_SIZE);
    expect(totalPages).toBe(0);
  });

  it('startIndex equals (page - 1) * 20 for any valid page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (totalItems) => {
          const totalPages = calculateTotalPages(totalItems, PAGE_SIZE);
          // For each valid page, verify startIndex
          for (let page = 1; page <= Math.min(totalPages, 5); page++) {
            const startIndex = calculateStartIndex(page, PAGE_SIZE);
            expect(startIndex).toBe((page - 1) * PAGE_SIZE);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('endIndex equals Math.min(page * 20, totalItems) for any valid page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (totalItems) => {
          const totalPages = calculateTotalPages(totalItems, PAGE_SIZE);
          // For each valid page, verify endIndex
          for (let page = 1; page <= Math.min(totalPages, 5); page++) {
            const endIndex = calculateEndIndex(page, totalItems, PAGE_SIZE);
            expect(endIndex).toBe(Math.min(page * PAGE_SIZE, totalItems));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('startIndex is always less than endIndex for any valid page with items', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (totalItems) => {
          const totalPages = calculateTotalPages(totalItems, PAGE_SIZE);
          for (let page = 1; page <= Math.min(totalPages, 5); page++) {
            const startIndex = calculateStartIndex(page, PAGE_SIZE);
            const endIndex = calculateEndIndex(page, totalItems, PAGE_SIZE);
            expect(startIndex).toBeLessThan(endIndex);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('endIndex - startIndex is at most pageSize for any valid page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (totalItems) => {
          const totalPages = calculateTotalPages(totalItems, PAGE_SIZE);
          for (let page = 1; page <= Math.min(totalPages, 5); page++) {
            const startIndex = calculateStartIndex(page, PAGE_SIZE);
            const endIndex = calculateEndIndex(page, totalItems, PAGE_SIZE);
            expect(endIndex - startIndex).toBeLessThanOrEqual(PAGE_SIZE);
            expect(endIndex - startIndex).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('last page endIndex always equals totalItems', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (totalItems) => {
          const totalPages = calculateTotalPages(totalItems, PAGE_SIZE);
          const endIndex = calculateEndIndex(totalPages, totalItems, PAGE_SIZE);
          expect(endIndex).toBe(totalItems);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all pages together cover all items without gaps or overlaps', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (totalItems) => {
          const totalPages = calculateTotalPages(totalItems, PAGE_SIZE);
          let coveredItems = 0;

          for (let page = 1; page <= totalPages; page++) {
            const startIndex = calculateStartIndex(page, PAGE_SIZE);
            const endIndex = calculateEndIndex(page, totalItems, PAGE_SIZE);

            // No gaps: startIndex of current page equals previous endIndex
            expect(startIndex).toBe(coveredItems);
            coveredItems = endIndex;
          }

          // All items covered
          expect(coveredItems).toBe(totalItems);
        }
      ),
      { numRuns: 100 }
    );
  });
});
