import { render, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { ProviderCard } from '../../components/ProviderCard/ProviderCard'
import type { Provider, ProviderType, Specialty, PlanType } from '../../types/provider'

/**
 * Feature: amacor-website, Property 8: ProviderCard renders all required fields
 *
 * For any valid Provider object, the ProviderCard component SHALL render the provider
 * name, type, specialties, full address, phone number, operating hours, and accepted
 * plans in its output.
 *
 * Validates: Requirements 7.9
 */

const providerTypes: ProviderType[] = [
  'Hospital',
  'Clínica',
  'Laboratório',
  'Consultório',
  'Pronto-Socorro',
]

const specialties: Specialty[] = [
  'Clínica médica',
  'Cardiologia',
  'Dermatologia',
  'Ginecologia',
  'Pediatria',
  'Ortopedia',
  'Oftalmologia',
  'Laboratório',
  'Fisioterapia',
  'Psicologia',
  'Exames',
  'Urgência',
  'Telemedicina',
]

const planTypes: PlanType[] = ['Exclusivo I', 'Exclusivo II', 'Empresarial']

// Generate realistic alphanumeric strings to avoid regex special characters
const safeStringArb = (minLength: number, maxLength: number) =>
  fc.stringMatching(new RegExp(`^[A-Za-zÀ-ú0-9 ]{${minLength},${maxLength}}$`))
    .filter((s) => s.trim().length > 0)

// Arbitrary for generating valid Provider objects
const providerArb: fc.Arbitrary<Provider> = fc.record({
  id: fc.uuid(),
  name: safeStringArb(2, 40),
  type: fc.constantFrom(...providerTypes),
  specialties: fc
    .uniqueArray(fc.constantFrom(...specialties), { minLength: 1, maxLength: 5 }),
  address: fc.record({
    street: safeStringArb(3, 40),
    number: fc.stringMatching(/^[1-9]\d{0,4}$/),
    complement: fc.constant(undefined),
    neighborhood: safeStringArb(3, 30),
    city: safeStringArb(3, 30),
    state: fc.stringMatching(/^[A-Z]{2}$/),
    cep: fc.stringMatching(/^\d{8}$/),
  }),
  coordinates: fc.record({
    lat: fc.double({ min: -33.75, max: 5.27, noNaN: true }),
    lng: fc.double({ min: -73.99, max: -34.79, noNaN: true }),
  }),
  phone: fc.tuple(
    fc.constantFrom('11', '21', '31', '41', '51'),
    fc.stringMatching(/^\d{8}$/)
  ).map(([ddd, num]) => `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`),
  whatsapp: fc.constant(undefined),
  operatingHours: fc.record({
    weekdays: fc.constantFrom('08:00 - 18:00', '07:00 - 19:00', '24 horas', '06:00 - 22:00'),
    saturday: fc.option(
      fc.constantFrom('08:00 - 12:00', '08:00 - 14:00', '24 horas'),
      { nil: undefined }
    ),
    sunday: fc.option(
      fc.constantFrom('Fechado', '08:00 - 12:00', '24 horas'),
      { nil: undefined }
    ),
  }),
  acceptedPlans: fc
    .uniqueArray(fc.constantFrom(...planTypes), { minLength: 1, maxLength: 3 }),
})

afterEach(() => {
  cleanup()
})

describe('Property 8: ProviderCard renders all required fields', () => {
  it('renders provider name in the output', () => {
    fc.assert(
      fc.property(providerArb, (provider) => {
        const { container, unmount } = render(<ProviderCard provider={provider} />)
        const heading = container.querySelector('h3')
        expect(heading).not.toBeNull()
        expect(heading!.textContent).toBe(provider.name)
        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('renders provider type badge in the output', () => {
    fc.assert(
      fc.property(providerArb, (provider) => {
        const { container, unmount } = render(<ProviderCard provider={provider} />)
        const textContent = container.textContent
        expect(textContent).toContain(provider.type)
        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('renders all specialties in the output', () => {
    fc.assert(
      fc.property(providerArb, (provider) => {
        const { container, unmount } = render(<ProviderCard provider={provider} />)
        const textContent = container.textContent!
        // ProviderCard shows up to 4 specialties
        const visibleSpecialties = provider.specialties!.slice(0, 4)
        for (const specialty of visibleSpecialties) {
          expect(textContent).toContain(specialty)
        }
        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('renders full address (street, number, neighborhood, city, state) in the output', () => {
    fc.assert(
      fc.property(providerArb, (provider) => {
        const { container, unmount } = render(<ProviderCard provider={provider} />)
        const { street, number, neighborhood, city, state } = provider.address
        const textContent = container.textContent!

        expect(textContent).toContain(`${street}, ${number}`)
        expect(textContent).toContain(neighborhood)
        expect(textContent).toContain(`${city}/${state}`)
        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('renders phone number as a tel link', () => {
    fc.assert(
      fc.property(providerArb, (provider) => {
        const { container, unmount } = render(<ProviderCard provider={provider} />)
        const phoneLink = container.querySelector('a[href^="tel:"]')
        expect(phoneLink).not.toBeNull()
        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('renders operating hours (weekdays) in the output', () => {
    fc.assert(
      fc.property(providerArb, (provider) => {
        const { container, unmount } = render(<ProviderCard provider={provider} />)
        const textContent = container.textContent!
        expect(textContent).toContain(`Seg-Sex: ${provider.operatingHours!.weekdays}`)
        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('renders all accepted plans in the output', () => {
    fc.assert(
      fc.property(providerArb, (provider) => {
        const { container, unmount } = render(<ProviderCard provider={provider} />)
        const textContent = container.textContent!
        for (const plan of provider.acceptedPlans!) {
          expect(textContent).toContain(plan)
        }
        unmount()
      }),
      { numRuns: 100 }
    )
  })
})
