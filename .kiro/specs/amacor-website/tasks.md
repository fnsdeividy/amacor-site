# Implementation Plan: Amacor Website Redesign

## Overview

This plan implements the Amacor website redesign in React + TypeScript + Tailwind CSS, focusing on conversion optimization, institutional trust, and self-service for beneficiaries. Tasks are ordered to build the data layer first, then utilities and hooks, then components, then pages, and finally routing/integration — ensuring no orphaned code at any stage.

## Tasks

- [x] 1. Data layer — new JSON files and type updates
  - [x] 1.1 Create `src/data/simulationPricing.json` with pricing matrix
    - Include `dependentFactor` and `plans` array with `planId`, `planName`, `slug`, and `priceByAge` record for all age ranges
    - Populate with pricing data for Exclusivo I, Exclusivo II, Mais com Franquia, and Empresarial
    - _Requirements: 2.4, 3.8, 14.3_

  - [x] 1.2 Create `src/data/benefits.json` with 6 benefit items
    - Items: Telemedicina 24h, Atendimento ambulatorial, Consultas e exames, Ambulância e aconselhamento médico, Mais de 2 mil procedimentos, Área do beneficiário e 2ª via de boleto
    - Each item: `id`, `icon`, `title`, `description`
    - _Requirements: 2.5_

  - [x] 1.3 Create `src/data/testimonials.json` with at least 3 testimonials
    - Each: `id`, `name`, `location`, `quote`, `rating`, optional `avatar`
    - _Requirements: 2.10_

  - [x] 1.4 Create `src/data/telemedicine.json` with telemedicine page content
    - Include `hero`, `steps`, `benefits`, `faq`, `plansWithTelemedicine`, `platformUrl`
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 1.5 Create `src/data/institutional.json` with institutional page content
    - Include `history` (with milestones), `mission`, `vision`, `values`, `ans` (registryNumber, status, verificationUrl), `idssLink`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_

  - [x] 1.6 Update `src/types/plan.ts` with enhanced Plan interface
    - Add `tagline`, `startingPrice`, `contractType`, `detailedBenefits`, `coverageDetails`, `coParticipation`, `networkInfo`, `includesTelemedicine`
    - Add `PlanContractType` and `PlanBenefit` types
    - _Requirements: 3.1, 3.2, 4.1, 18.2_

  - [x] 1.7 Update `src/data/plans.json` to include enhanced plan fields
    - Add Exclusivo I and Amacor Mais com Franquia plan entries
    - Add `tagline`, `startingPrice`, `contractType`, `detailedBenefits`, `coverageDetails` to all plans
    - _Requirements: 3.1, 3.2, 4.1_

  - [x] 1.8 Add simulation-related types to `src/types/index.ts`
    - Export `AgeRange`, `SimulationResult`, `SimulatedPlan`, `SimulationPricingData`, `PlanPricing`
    - Add `BenefitItem`, `Testimonial`, `TelemedicineData`, `InstitutionalData`, `LeadCapture`, `WhatsAppMessageConfig` interfaces
    - _Requirements: 2.4, 14.4, 18.2_

- [x] 2. Utilities — WhatsApp URL builder and lead capture
  - [x] 2.1 Create `src/utils/whatsapp.ts` with `buildWhatsAppUrl` and `buildWhatsAppMessage` functions
    - `buildWhatsAppUrl(phoneNumber, message)` returns `https://wa.me/{digits}?text={encodedMessage}`
    - `buildWhatsAppMessage(config: WhatsAppMessageConfig)` generates contextual messages based on page, plan, simulation data
    - Strip non-digit chars from phone number, URI-encode the message
    - _Requirements: 1.4, 2.3, 3.7, 4.3, 14.5_

  - [x] 2.2 Create `src/utils/leadCapture.ts` with lead data formatting
    - Implement `createLeadCapture(source, page, data, planContext?)` returning a `LeadCapture` object with UUID, ISO timestamp
    - Store leads in localStorage as mock for future CRM integration
    - _Requirements: 14.4_

  - [ ]* 2.3 Write property test for WhatsApp URL construction
    - **Property 1: WhatsApp URL Construction**
    - **Validates: Requirements 1.4, 2.3, 3.7, 4.3, 14.3, 14.5**
    - File: `src/__tests__/properties/whatsapp-url.property.test.ts`

  - [ ]* 2.4 Write property test for lead capture data integrity
    - **Property 13: Lead Capture Data Integrity**
    - **Validates: Requirements 14.4**
    - File: `src/__tests__/properties/lead-capture.property.test.ts`

- [x] 3. Hook — useSimulation
  - [x] 3.1 Create `src/hooks/useSimulation.ts`
    - Import pricing data from `simulationPricing.json`
    - Implement `calculateSimulationPrice(ageRange, dependents, planPricing, dependentFactor)` pure function
    - Return `{ ageRange, dependents, setAgeRange, setDependents, results, isCalculating, reset }`
    - Formula: `basePrice + (dependents × basePrice × dependentFactor)`
    - Format results to 2 decimal places
    - _Requirements: 2.4, 3.8_

  - [ ]* 3.2 Write property test for simulation pricing calculation
    - **Property 3: Simulation Pricing Calculation**
    - **Validates: Requirements 2.4**
    - File: `src/__tests__/properties/simulation-pricing.property.test.ts`

- [x] 4. Checkpoint — Data layer and utilities
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. New components — SimulationWidget, BenefitsGrid, TrustSection, TestimonialsSection, WhatsAppCTA
  - [x] 5.1 Create `src/components/SimulationWidget/SimulationWidget.tsx`
    - Age range dropdown/select (10 ranges: 0-18 through 59+) and dependents counter (0-5+)
    - Displays plan pricing results using `useSimulation` hook
    - Shows WhatsAppCTA with simulation data pre-filled after results
    - Large touch targets (48px min), accessible labels, 18px min font
    - _Requirements: 2.4, 3.8, 14.2, 14.3, 15.1, 15.4_

  - [x] 5.2 Create `src/components/BenefitsGrid/BenefitsGrid.tsx`
    - Accepts `BenefitItem[]` prop, renders 6 icon-based rounded cards
    - Responsive: 2-col mobile, 3-col tablet, 3-col or 6-col desktop
    - Rounded cards with soft shadows (border-radius ≥ 12px)
    - _Requirements: 2.5, 17.1, 17.2_

  - [x] 5.3 Create `src/components/TrustSection/TrustSection.tsx`
    - Accepts `title` and `stats: TrustStat[]`, renders stat items with icon/value/label
    - Minimum 6 items, responsive grid layout
    - _Requirements: 2.8, 7.1_

  - [x] 5.4 Create `src/components/TestimonialsSection/TestimonialsSection.tsx`
    - Accepts `Testimonial[]`, renders cards with name, location, quote, rating (1-5 stars)
    - At least 3 testimonial cards visible
    - _Requirements: 2.10_

  - [x] 5.5 Create `src/components/WhatsAppCTA/WhatsAppCTA.tsx`
    - Inline CTA button (distinct from floating WhatsAppButton)
    - Props: `phoneNumber`, `message`, optional `label`, `variant` (primary/secondary/compact)
    - Uses `buildWhatsAppUrl` utility, opens in new tab
    - Green color, min 48x48px touch target
    - _Requirements: 1.4, 2.3, 3.7, 4.3, 14.5, 15.4_

- [x] 6. Enhanced existing components — PlanCard, HeroSection, Header
  - [x] 6.1 Enhance `src/components/PlanCard/PlanCard.tsx` with pricing and dual CTAs
    - Add props: `startingPrice`, `contractType`, `tagline`, `whatsappNumber`, `whatsappMessage`
    - Render "Ver detalhes" link (navigates to `/planos/{slug}`) and "Contratar pelo WhatsApp" button
    - Maintain backward compatibility with existing usage
    - _Requirements: 2.6, 3.2, 3.6, 3.7_

  - [x] 6.2 Enhance `src/components/HeroSection/HeroSection.tsx` with dual CTAs
    - Add `primaryCTA` and `secondaryCTA` props with `text`, `link`, `variant`
    - Support variants: button, scroll, whatsapp, phone, link
    - Maintain backward compatibility
    - _Requirements: 2.1, 2.2, 2.3, 5.1_

  - [x] 6.3 Enhance `src/components/Header/Header.tsx` with dropdown navigation
    - Implement single-level dropdown for Plans submenu (Exclusivo I, Exclusivo II, Mais com Franquia, Empresarial)
    - Update nav items: Início, Planos▾, Telemedicina, Rede Credenciada, Área do Beneficiário, Institucional, Contato
    - No nested dropdowns deeper than 1 level
    - Accessible keyboard navigation, focus indicators
    - _Requirements: 1.1, 1.5, 1.6, 1.7, 1.8, 1.9, 15.8_

  - [ ]* 6.4 Write property test for navigation uniqueness and depth
    - **Property 11: Navigation Uniqueness and Depth**
    - **Validates: Requirements 1.9**
    - File: `src/__tests__/properties/navigation.property.test.ts`

  - [ ]* 6.5 Write property test for plan filtering by category
    - **Property 4: Plan Filtering by Category**
    - **Validates: Requirements 3.9**
    - File: `src/__tests__/properties/plan-filtering.property.test.ts`

- [x] 7. Checkpoint — Components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. New pages — Telemedicine, Institutional, PlanExclusivoI, PlanMaisComFranquia
  - [x] 8.1 Create `src/pages/Telemedicine.tsx`
    - Load data from `telemedicine.json`
    - Sections: HeroSection, "Como funciona" steps, Benefits cards, Plans with telemedicine, FAQ with Accordion, CTA to platform + WhatsApp
    - Accessible, responsive, 18px min font
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 8.2 Create `src/pages/Institutional.tsx`
    - Load data from `institutional.json`
    - Sections: History (milestones), Mission/Vision/Values (rounded cards), ANS registration info, IDSS link, CTA to Plans or WhatsApp
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 8.3 Create `src/pages/PlanExclusivoI.tsx`
    - Plan detail page: full name, description, benefits list with icons, coverage details, co-participation rules, network info
    - Contact_Form with name, phone, email (required), message (optional)
    - WhatsAppCTA with plan name pre-filled
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 8.4 Create `src/pages/PlanMaisComFranquia.tsx`
    - Same structure as PlanExclusivoI but for "Amacor Mais com Franquia"
    - Contact_Form and WhatsAppCTA
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 9. Update Home page with new sections
  - [x] 9.1 Refactor `src/pages/Home.tsx` with complete section order
    - Section order: HeroSection (dual CTAs) → SimulationWidget → BenefitsGrid (6 cards) → PlanCards (commercial style) → Saúde Digital section (split layout) → TrustSection (6 stats) → Provider Network CTA → TestimonialsSection → Beneficiary Area cards → Contact CTA
    - Import and compose all new components
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13_

  - [x] 9.2 Implement Beneficiary Area section in Home page
    - Large quick-access cards: 2ª via de boleto, Manual do associado, Telemedicina, Ouvidoria
    - Cards with icons, title, short description (≤60 chars), min 120x120px
    - _Requirements: 2.11, 6.1, 6.2, 6.9_

- [x] 10. Update Plans page with simulation, filters, and comparison
  - [x] 10.1 Refactor `src/pages/Plans.tsx` with SimulationWidget and filter tabs
    - Add SimulationWidget at top
    - Add filter tabs: Todos, Individual, Familiar, Empresarial
    - Display enhanced PlanCards (with pricing, dual CTAs) in grid layout
    - Responsive: multi-column ≥768px, single-column <768px
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.8, 3.9_

  - [x] 10.2 Add plan comparison table to Plans page
    - Table with columns for each plan, rows: price range, contract type, coverage, telemedicine, network type, co-participation
    - Horizontal scroll on mobile
    - _Requirements: 3.3, 3.5_

- [x] 11. Update Beneficiary Area page with full self-service cards
  - [x] 11.1 Refactor `src/pages/BeneficiaryArea.tsx` with 6 service cards
    - Cards: 2ª via de boleto, Manual do associado, Ouvidoria, Reembolso, Telemedicina, Reajuste anual
    - Each with icon, title, description (≤60 chars)
    - Responsive: 2-col <768px, 3-col ≥768px
    - Min card size 120x120px, touch target 48x48px
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

- [x] 12. Routing and integration
  - [x] 12.1 Update `src/App.tsx` with new routes and imports
    - Add routes: `/planos/exclusivo-i` → PlanExclusivoI, `/planos/mais-com-franquia` → PlanMaisComFranquia, `/telemedicina` → Telemedicine, `/institucional` → Institutional
    - Redirect `/sobre` to `/institucional` or replace About with Institutional
    - Import all new page components
    - _Requirements: 1.1, 5.1, 7.1_

  - [x] 12.2 Update Footer with new navigation links
    - Add links to Telemedicina, Institucional, new plan pages
    - Ensure ANS registry number displayed, social media links
    - _Requirements: 1.2, 13.4_

- [x] 13. Checkpoint — Pages and routing complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Form validation and error handling
  - [x] 14.1 Enhance `src/utils/validation.ts` with plan form validators
    - Add `validateCep` (8-digit numeric), `validatePhone` (Brazilian format), `validateEmail` (standard format)
    - Ensure `validateForm` returns `isValid` with errors keyed to invalid fields
    - Error messages in Portuguese (≤ 8th-grade reading level)
    - _Requirements: 4.4, 4.5, 8.18, 13.5, 13.6, 15.7_

  - [ ]* 14.2 Write property test for form validation correctness
    - **Property 2: Form Validation Correctness**
    - **Validates: Requirements 4.4, 4.5, 8.18, 13.5, 13.6**
    - File: `src/__tests__/properties/form-validation.property.test.ts`

- [x] 15. Provider network enhancements
  - [x] 15.1 Update `src/types/provider.ts` with `PlanType` including 'Amacor Mais com Franquia'
    - Add `'Amacor Mais com Franquia'` to the PlanType union
    - Ensure provider data supports the new plan type
    - _Requirements: 8.5_

  - [ ]* 15.2 Write property test for provider distance filtering
    - **Property 5: Provider Distance Filtering**
    - **Validates: Requirements 8.3**
    - File: `src/__tests__/properties/provider-distance.property.test.ts`

  - [ ]* 15.3 Write property test for provider sorting correctness
    - **Property 6: Provider Sorting Correctness**
    - **Validates: Requirements 8.8**
    - File: `src/__tests__/properties/provider-sorting.property.test.ts`

  - [ ]* 15.4 Write property test for pagination invariant
    - **Property 7: Pagination Invariant**
    - **Validates: Requirements 8.19**
    - File: `src/__tests__/properties/pagination.property.test.ts`

- [ ] 16. Waiting periods and IDSS enhancements
  - [ ]* 16.1 Write property test for procedure search filtering
    - **Property 8: Procedure Search Filtering**
    - **Validates: Requirements 9.3, 10.3**
    - File: `src/__tests__/properties/procedure-search.property.test.ts`

  - [ ]* 16.2 Write property test for accordion mutual exclusion
    - **Property 9: Accordion Mutual Exclusion**
    - **Validates: Requirements 9.4, 10.6**
    - File: `src/__tests__/properties/accordion-state.property.test.ts`

  - [ ]* 16.3 Write property test for IDSS data rendering completeness
    - **Property 10: IDSS Data Rendering Completeness**
    - **Validates: Requirements 11.3**
    - File: `src/__tests__/properties/idss-rendering.property.test.ts`

- [ ] 17. Accessibility and design system verification
  - [ ]* 17.1 Write property test for design system color contrast
    - **Property 12: Design System Color Contrast**
    - **Validates: Requirements 15.3**
    - File: `src/__tests__/properties/color-contrast.property.test.ts`

- [x] 18. Final checkpoint — Full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- The project uses React + TypeScript + Tailwind CSS with Vitest for testing
- All new data files use typed JSON with interfaces exported from `src/types/`
- The existing component and page structure is preserved — new code augments rather than replaces

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.8"] },
    { "id": 1, "tasks": ["1.7", "2.1", "2.2", "15.1"] },
    { "id": 2, "tasks": ["2.3", "2.4", "3.1"] },
    { "id": 3, "tasks": ["3.2", "5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 4, "tasks": ["6.1", "6.2", "6.3"] },
    { "id": 5, "tasks": ["6.4", "6.5", "8.1", "8.2", "8.3", "8.4"] },
    { "id": 6, "tasks": ["9.1", "9.2", "10.1", "10.2", "11.1"] },
    { "id": 7, "tasks": ["12.1", "12.2"] },
    { "id": 8, "tasks": ["14.1"] },
    { "id": 9, "tasks": ["14.2", "15.2", "15.3", "15.4", "16.1", "16.2", "16.3", "17.1"] }
  ]
}
```
