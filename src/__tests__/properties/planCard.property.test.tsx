import { render, within, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { PlanCard } from '../../components/PlanCard/PlanCard'

/**
 * Feature: amacor-website, Property 7: PlanCard renders all required fields
 *
 * For any valid Plan object, the PlanCard component SHALL render the plan name,
 * description, all benefit items, and a CTA button in its output.
 *
 * Validates: Requirements 4.2
 */
describe('Property 7: PlanCard renders all required fields', () => {
  afterEach(() => {
    cleanup()
  })

  // Generate strings that won't be affected by HTML whitespace normalization:
  // - No leading/trailing spaces
  // - No consecutive spaces
  // - Only alphanumeric characters and single spaces
  const safeStringArb = fc
    .array(
      fc.oneof(
        fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
        fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
        fc.constantFrom(...'0123456789'.split(''))
      ),
      { minLength: 3, maxLength: 25 }
    )
    .map((chars) => chars.join(''))

  // Arbitrary for benefits: array of 3-5 unique strings
  const benefitsArb = fc.uniqueArray(safeStringArb, {
    minLength: 3,
    maxLength: 5,
    comparator: (a, b) => a === b,
  })

  // Arbitrary for ctaLink: string starting with /
  const ctaLinkArb = fc
    .array(
      fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')),
      { minLength: 2, maxLength: 15 }
    )
    .map((chars) => '/' + chars.join(''))

  // Combined PlanCardProps arbitrary ensuring all fields are unique
  const planCardPropsArb = fc
    .record({
      name: safeStringArb,
      description: safeStringArb,
      benefits: benefitsArb,
      ctaText: safeStringArb,
      ctaLink: ctaLinkArb,
    })
    .filter((props) => {
      // Ensure name, description, ctaText, and all benefits are all distinct
      const allTexts = [props.name, props.description, props.ctaText, ...props.benefits]
      return new Set(allTexts).size === allTexts.length
    })

  it('renders the plan name', () => {
    fc.assert(
      fc.property(planCardPropsArb, (props) => {
        cleanup()
        const { container } = render(
          <MemoryRouter>
            <PlanCard {...props} />
          </MemoryRouter>
        )

        const view = within(container)
        expect(view.getByRole('heading', { name: props.name })).toBeInTheDocument()
      }),
      { numRuns: 100 }
    )
  })

  it('renders the plan description', () => {
    fc.assert(
      fc.property(planCardPropsArb, (props) => {
        cleanup()
        const { container } = render(
          <MemoryRouter>
            <PlanCard {...props} />
          </MemoryRouter>
        )

        const view = within(container)
        expect(view.getByText(props.description)).toBeInTheDocument()
      }),
      { numRuns: 100 }
    )
  })

  it('renders all benefit items', () => {
    fc.assert(
      fc.property(planCardPropsArb, (props) => {
        cleanup()
        const { container } = render(
          <MemoryRouter>
            <PlanCard {...props} />
          </MemoryRouter>
        )

        const view = within(container)
        for (const benefit of props.benefits) {
          expect(view.getByText(benefit)).toBeInTheDocument()
        }
      }),
      { numRuns: 100 }
    )
  })

  it('renders the CTA button with correct text and link', () => {
    fc.assert(
      fc.property(planCardPropsArb, (props) => {
        cleanup()
        const { container } = render(
          <MemoryRouter>
            <PlanCard {...props} />
          </MemoryRouter>
        )

        const view = within(container)
        const link = view.getByRole('link', { name: props.ctaText })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', props.ctaLink)
      }),
      { numRuns: 100 }
    )
  })
})
