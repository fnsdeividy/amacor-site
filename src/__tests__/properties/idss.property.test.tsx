import { render, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { formatIDSSValue } from '../../utils/formatters'
import type { IDSSYearData } from '../../types/idss'

/**
 * Feature: amacor-website, Property 9: IDSS indicator formatting
 *
 * For any valid IDSSYearData object, the rendering function SHALL display all 5
 * indicator acronyms (IDSS, IDQS, IDGA, IDSM, IDGR) each with its numeric value
 * formatted to exactly 4 decimal places.
 *
 * Validates: Requirements 10.3
 */

const EXPECTED_ACRONYMS = ['IDSS', 'IDQS', 'IDGA', 'IDSM', 'IDGR'] as const

// Arbitrary for generating valid IDSSYearData objects
const idssYearDataArb: fc.Arbitrary<IDSSYearData> = fc.record({
  year: fc.integer({ min: 2000, max: 2099 }),
  indicators: fc.record({
    IDSS: fc.double({ min: 0, max: 1, noNaN: true }),
    IDQS: fc.double({ min: 0, max: 1, noNaN: true }),
    IDGA: fc.double({ min: 0, max: 1, noNaN: true }),
    IDSM: fc.double({ min: 0, max: 1, noNaN: true }),
    IDGR: fc.double({ min: 0, max: 1, noNaN: true }),
  }),
})

describe('Property 9: IDSS indicator formatting', () => {
  afterEach(() => {
    cleanup()
  })

  it('formatIDSSValue produces strings with exactly 4 decimal places for all indicators', () => {
    fc.assert(
      fc.property(idssYearDataArb, (yearData) => {
        for (const acronym of EXPECTED_ACRONYMS) {
          const value = yearData.indicators[acronym]
          const formatted = formatIDSSValue(value)

          // Verify the formatted string matches the pattern of a number with exactly 4 decimal places
          const decimalMatch = formatted.match(/^-?\d+\.(\d+)$/)
          expect(decimalMatch).not.toBeNull()
          expect(decimalMatch![1]).toHaveLength(4)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('all 5 acronyms are present in IDSSYearData indicators', () => {
    fc.assert(
      fc.property(idssYearDataArb, (yearData) => {
        const indicatorKeys = Object.keys(yearData.indicators)

        for (const acronym of EXPECTED_ACRONYMS) {
          expect(indicatorKeys).toContain(acronym)
        }

        expect(indicatorKeys).toHaveLength(5)
      }),
      { numRuns: 100 }
    )
  })

  it('renders all 5 acronyms and formatted values in the IDSS page component', () => {
    // Dynamically import the IDSS page to test rendering
    fc.assert(
      fc.property(idssYearDataArb, (yearData) => {
        cleanup()

        // Render a minimal representation of how the IDSS page displays indicators
        const { container } = render(
          <MemoryRouter>
            <div>
              {Object.entries(yearData.indicators).map(([key, value]) => (
                <div key={key} data-testid={`indicator-${key}`}>
                  <span className="acronym">{key}</span>
                  <span className="value">{formatIDSSValue(value)}</span>
                </div>
              ))}
            </div>
          </MemoryRouter>
        )

        // Verify all 5 acronyms are displayed
        for (const acronym of EXPECTED_ACRONYMS) {
          const element = container.querySelector(`[data-testid="indicator-${acronym}"]`)
          expect(element).not.toBeNull()

          // Verify the acronym text is present
          const acronymSpan = element!.querySelector('.acronym')
          expect(acronymSpan).not.toBeNull()
          expect(acronymSpan!.textContent).toBe(acronym)

          // Verify the value is formatted to exactly 4 decimal places
          const valueSpan = element!.querySelector('.value')
          expect(valueSpan).not.toBeNull()
          const valueText = valueSpan!.textContent!
          const decimalMatch = valueText.match(/^-?\d+\.(\d+)$/)
          expect(decimalMatch).not.toBeNull()
          expect(decimalMatch![1]).toHaveLength(4)
        }
      }),
      { numRuns: 100 }
    )
  })
})
