# Implementation Plan: Amacor Website

## Overview

This plan implements the Amacor Planos de Saúde website incrementally — starting with project scaffolding and foundational types, then building reusable components, then assembling pages from simplest to most complex (Provider Network last). Each task builds on previous work so there is no orphaned code.

## Tasks

- [x] 1. Project setup and core infrastructure
  - [x] 1.1 Initialize Vite + React + TypeScript project and configure Tailwind CSS
    - Create Vite project with React-TS template
    - Install dependencies: react-router-dom, tailwindcss, postcss, autoprefixer
    - Install dev dependencies: vitest, @testing-library/react, @testing-library/jest-dom, fast-check, jsdom, axe-core, @axe-core/react
    - Configure tailwind.config.ts with brand colors (blue primary, orange accent, green for WhatsApp/confirmation), spacing tokens, font sizes (min 18px body, 24px headings), and responsive breakpoints (768px, 1024px)
    - Create src/index.css with Tailwind directives and global styles
    - Configure vitest.config.ts with jsdom environment and setup file
    - _Requirements: 1.8, 13.1, 13.2, 14.1, 15.3_

  - [x] 1.2 Define TypeScript type definitions and interfaces
    - Create src/types/provider.ts with Provider, ProviderType, Specialty, PlanType, ProviderFilters, SortOption, ViewMode interfaces
    - Create src/types/plan.ts with Plan interface
    - Create src/types/waitingPeriod.ts with WaitingPeriod interface
    - Create src/types/idss.ts with IDSSYearData interface
    - Create src/types/forms.ts with ContactFormData, ProposalFormData, ExclusivoIIFormData, FormFieldConfig, ValidationRule, ValidationResult interfaces
    - Create src/types/index.ts barrel export
    - _Requirements: 15.2_

  - [x] 1.3 Create mock data JSON files
    - Create src/data/providers.json with at least 30 provider entries covering all ProviderType and Specialty values, with coordinates in a realistic geographic area
    - Create src/data/plans.json with Exclusivo I, Exclusivo II, and Empresarial plan data
    - Create src/data/waitingPeriodsIndividual.json with procedure/duration entries
    - Create src/data/waitingPeriodsCorporate.json with procedure/duration entries
    - Create src/data/idssData.json with 2020, 2023, and 2025 indicator data (2025: IDSS 0.3095, IDQS 0.0000, IDGA 0.0000, IDSM 0.9208, IDGR 0.3333)
    - _Requirements: 7.15, 10.2_

  - [x] 1.4 Implement utility functions
    - Create src/utils/validation.ts with form validation engine (required, email, phone, minLength, maxLength, min, max, pattern, cep rules)
    - Create src/utils/geolocation.ts with geolocation helper functions
    - Create src/utils/distance.ts with Haversine distance calculation
    - Create src/utils/formatters.ts with number/date/phone formatting utilities
    - Create src/utils/filters.ts with case-insensitive substring filter and provider filtering logic
    - _Requirements: 5.2, 5.4, 6.2, 6.4, 7.3, 7.18, 8.3, 9.3, 12.1, 12.5_

  - [x] 1.5 Write property tests for validation utilities
    - **Property 1: Form validation correctness**
    - **Validates: Requirements 5.2, 5.4, 6.2, 6.4, 12.1, 12.5**
    - Create src/__tests__/properties/validation.property.test.ts
    - Use fast-check to generate arbitrary form field configs and input values
    - Verify isValid is true iff all required fields are non-empty and all constraints pass
    - Minimum 100 iterations

  - [x] 1.6 Write property tests for CEP validation
    - **Property 2: CEP format validation**
    - **Validates: Requirements 7.18**
    - Create src/__tests__/properties/cep.property.test.ts
    - Use fast-check to generate arbitrary strings and verify acceptance iff exactly 8 numeric digits
    - Minimum 100 iterations

  - [x] 1.7 Write property tests for distance calculation and radius filtering
    - **Property 3: Distance-based provider filtering**
    - **Validates: Requirements 7.3**
    - Create src/__tests__/properties/distance.property.test.ts
    - Use fast-check to generate center points and provider coordinates
    - Verify radius filter returns only providers within specified radius
    - Minimum 100 iterations

  - [x] 1.8 Write property tests for provider sorting
    - **Property 4: Provider sorting invariant**
    - **Validates: Requirements 7.8**
    - Create src/__tests__/properties/sorting.property.test.ts
    - Use fast-check to generate provider lists and sort options
    - Verify adjacent pair ordering invariant for all sort criteria
    - Minimum 100 iterations

  - [x] 1.9 Write property tests for pagination
    - **Property 5: Pagination calculation correctness**
    - **Validates: Requirements 7.19**
    - Create src/__tests__/properties/pagination.property.test.ts
    - Use fast-check to generate totalItems (≥0) and verify totalPages, startIndex, endIndex formulas
    - Minimum 100 iterations

  - [x] 1.10 Write property tests for case-insensitive substring filter
    - **Property 6: Case-insensitive substring filter**
    - **Validates: Requirements 8.3, 9.3**
    - Create src/__tests__/properties/filter.property.test.ts
    - Use fast-check to generate item lists and search strings
    - Verify filter returns exactly items containing search string case-insensitively
    - Minimum 100 iterations

- [x] 2. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Custom hooks implementation
  - [x] 3.1 Implement useGeolocation hook
    - Create src/hooks/useGeolocation.ts
    - Wrap browser Geolocation API with permission handling, error states, and loading state
    - Return position (lat/lng), error message, isLoading, isPermissionDenied, and requestLocation function
    - Handle graceful degradation when API is unavailable
    - _Requirements: 7.2, 7.17_

  - [x] 3.2 Implement useFormValidation hook
    - Create src/hooks/useFormValidation.ts
    - Generic form validation with values, errors, touched state, handleChange, handleBlur, handleSubmit, reset, isValid
    - Validate on blur and on submit using validation utility functions
    - _Requirements: 5.2, 5.4, 6.2, 6.4, 12.1, 12.5_

  - [x] 3.3 Implement usePagination hook
    - Create src/hooks/usePagination.ts
    - Compute totalPages, currentPage, goToPage, nextPage, prevPage, startIndex, endIndex
    - Page size of 20 items
    - _Requirements: 7.19_

  - [x] 3.4 Implement useProviderSearch hook
    - Create src/hooks/useProviderSearch.ts
    - Combine filtering (multi-criteria), sorting (5 options), distance calculation, and pagination
    - Accept providers array and optional user location
    - Return filtered/sorted/paginated results with filter/sort/page state setters
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.6, 7.8, 7.19_

- [x] 4. Layout and shared components
  - [x] 4.1 Implement Header component with mobile menu
    - Create src/components/Header/Header.tsx with fixed positioning, nav links to all pages
    - Create src/components/Header/MobileMenu.tsx with hamburger toggle and slide-out panel
    - Active link visual distinction (brand color underline)
    - Min 16px font, 48x48px tap targets on mobile, collapse at <768px
    - _Requirements: 1.1, 1.5, 1.6, 1.7, 13.4_

  - [x] 4.2 Implement Footer component
    - Create src/components/Footer/Footer.tsx
    - Display regulatory info (ANS registry), contact details, secondary nav links, copyright
    - Full-width, responsive layout
    - _Requirements: 1.2_

  - [x] 4.3 Implement WhatsAppButton component
    - Create src/components/WhatsAppButton/WhatsAppButton.tsx
    - Floating button, fixed bottom-right, 56x56px minimum, green background
    - Opens WhatsApp link in new tab
    - _Requirements: 1.3, 1.4, 1.8_

  - [x] 4.4 Implement HeroSection component
    - Create src/components/HeroSection/HeroSection.tsx
    - Full-width banner with headline, subtitle, CTA button, optional background image
    - Responsive: stacked on mobile, side-by-side on desktop
    - _Requirements: 2.1, 15.5_

  - [x] 4.5 Implement PlanCard component
    - Create src/components/PlanCard/PlanCard.tsx
    - Display plan name, description, benefits list, CTA button, optional highlight state
    - Grid on desktop, stacked on mobile
    - _Requirements: 4.2, 15.5_

  - [x] 4.6 Write property test for PlanCard rendering
    - **Property 7: PlanCard renders all required fields**
    - **Validates: Requirements 4.2**
    - Create src/__tests__/properties/planCard.property.test.tsx
    - Use fast-check to generate valid Plan objects
    - Verify name, description, all benefits, and CTA button are rendered
    - Minimum 100 iterations

  - [x] 4.7 Implement InfoCard component
    - Create src/components/InfoCard/InfoCard.tsx
    - Generic card with title, description, optional icon, optional link
    - Rounded corners, soft shadow, consistent padding
    - _Requirements: 3.3, 15.5_

  - [x] 4.8 Implement CTASection component
    - Create src/components/CTASection/CTASection.tsx
    - Title, optional description, 1-2 action buttons with variant styling (whatsapp/phone/default)
    - 48x48px minimum touch targets
    - _Requirements: 2.5, 3.4, 15.5_

  - [x] 4.9 Implement Accordion component
    - Create src/components/Accordion/Accordion.tsx
    - Collapsible sections with single-open default behavior, optional allowMultiple
    - Accessible: keyboard navigation, ARIA attributes
    - _Requirements: 8.1, 8.4, 9.1, 9.4, 9.6, 13.8_

  - [x] 4.10 Implement ContactForm component
    - Create src/components/ContactForm/ContactForm.tsx
    - Reusable form with configurable fields, validation, error display, success/error states
    - Full-width fields on mobile, 48px min height, inline red error text, green confirmation
    - Uses useFormValidation hook
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 6.2, 6.3, 6.4, 6.5, 12.1, 12.4, 12.5, 12.7, 14.4_

  - [x] 4.11 Implement SearchFilters component
    - Create src/components/SearchFilters/SearchFilters.tsx
    - Geolocation button, CEP input (8-digit validation), city/neighborhood text input
    - Specialty dropdown, plan dropdown, provider type dropdown
    - Full-width on mobile, horizontal on desktop
    - _Requirements: 7.1, 7.4, 7.5, 7.6, 7.16_

  - [x] 4.12 Implement ProviderCard component
    - Create src/components/ProviderCard/ProviderCard.tsx
    - Display name, type badge, specialties, address, phone (tap-to-call), WhatsApp (tap-to-chat), hours, accepted plans, distance
    - Action buttons: call, WhatsApp, directions, show on map
    - _Requirements: 7.9, 7.10, 7.11, 7.12, 7.13_

  - [x] 4.13 Write property test for ProviderCard rendering
    - **Property 8: ProviderCard renders all required fields**
    - **Validates: Requirements 7.9**
    - Create src/__tests__/properties/providerCard.property.test.tsx
    - Use fast-check to generate valid Provider objects
    - Verify all required fields are rendered in output
    - Minimum 100 iterations

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. App routing and simple pages
  - [x] 6.1 Set up React Router and App component
    - Create src/App.tsx with BrowserRouter, Route definitions for all 11 pages
    - Wrap routes in layout with Header, Footer, WhatsAppButton
    - Configure main.tsx entry point
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 6.2 Implement Home page
    - Create src/pages/Home.tsx
    - Sections in order: HeroSection, 3 highlight cards, institutional text, Provider Network CTA, final CTA (WhatsApp + phone)
    - Use HeroSection, InfoCard, CTASection components
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 6.3 Implement About page
    - Create src/pages/About.tsx
    - Mission, values, vision sections with 32px vertical spacing
    - Value items in rounded cards with soft shadows (min 3 items)
    - CTA at bottom linking to Plans or contact
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 6.4 Implement Plans Overview page
    - Create src/pages/Plans.tsx
    - Render PlanCard components for Exclusivo I, Exclusivo II, Empresarial
    - Multi-column grid on desktop (≥768px), single-column on mobile
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.5 Implement TISS Manual page
    - Create src/pages/TISSManual.tsx
    - Heading, description text, downloadable document links with file format
    - Handle download initiation and error states
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 6.6 Implement Contact page
    - Create src/pages/Contact.tsx
    - ContactForm with name, phone, email, subject, message fields
    - Contact cards with phone numbers, email, office hours
    - Embedded map showing Amacor location
    - Tap-to-call on phone numbers
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 7. Plan detail and data-driven pages
  - [x] 7.1 Implement Exclusivo II plan detail page
    - Create src/pages/PlanExclusivoII.tsx
    - Benefit cards displaying coverage items
    - CTA section encouraging contact
    - ContactForm with name, phone, email (required) and message (optional)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.2 Implement Corporate Plan detail page
    - Create src/pages/PlanCorporate.tsx
    - Benefit cards with corporate coverage items
    - Proposal ContactForm with company name, contact name, phone, email, number of employees (required), message (optional)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 7.3 Implement Individual Waiting Periods page
    - Create src/pages/WaitingPeriodsIndividual.tsx
    - Search field for filtering procedures
    - Accordion with procedure names as headers, waiting period duration in expanded content
    - Single-open behavior, empty state message
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 7.4 Implement Corporate Waiting Periods page
    - Create src/pages/WaitingPeriodsCorporate.tsx
    - Search field for filtering procedures
    - Accordion with procedure/duration data from mock data
    - Single-open behavior, collapse on re-click, empty state
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 7.5 Implement IDSS Performance page
    - Create src/pages/IDSS.tsx
    - Year selector (2020, 2023, 2025), default to 2025
    - Display 5 indicators (IDSS, IDQS, IDGA, IDSM, IDGR) with values formatted to 4 decimal places
    - Handle unavailable year data
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 7.6 Write property test for IDSS indicator formatting
    - **Property 9: IDSS indicator formatting**
    - **Validates: Requirements 10.3**
    - Create src/__tests__/properties/idss.property.test.tsx
    - Use fast-check to generate valid IDSSYearData objects
    - Verify all 5 acronyms displayed with values formatted to exactly 4 decimal places
    - Minimum 100 iterations

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Provider Network page (most complex feature)
  - [x] 9.1 Implement Provider Network page structure and state management
    - Create src/pages/ProviderNetwork.tsx
    - Wire useGeolocation, useProviderSearch hooks
    - Load providers from mock data
    - Manage view mode state (list/map/combined)
    - Set default sort: alphabetical when no geolocation, proximity when geolocation available
    - _Requirements: 7.1, 7.7, 7.8, 7.15_

  - [x] 9.2 Integrate SearchFilters with Provider Network page
    - Connect SearchFilters component to useProviderSearch filter state
    - Wire geolocation button to useGeolocation hook
    - Handle CEP input validation and radius filtering
    - Handle geolocation permission denied fallback message
    - _Requirements: 7.1, 7.2, 7.3, 7.17, 7.18_

  - [x] 9.3 Implement list view with pagination
    - Render ProviderCard components from filtered/sorted results
    - Pagination controls (20 items per page)
    - Empty state message when no results match filters
    - Single-column on mobile (<768px)
    - _Requirements: 7.9, 7.14, 7.16, 7.19_

  - [x] 9.4 Implement map view and combined view
    - Map view showing provider markers (placeholder/static map or embedded map)
    - Combined view with list and map side by side on desktop
    - "Show on map" button on ProviderCard highlights provider on map
    - _Requirements: 7.7, 7.13_

  - [x] 9.5 Write unit tests for Provider Network page
    - Test filter interactions, sort changes, pagination navigation
    - Test geolocation permission denied flow
    - Test empty state rendering
    - Test view mode switching
    - _Requirements: 7.1, 7.8, 7.14, 7.17, 7.19_

- [x] 10. Accessibility and responsive polish
  - [x] 10.1 Accessibility audit and fixes
    - Run axe-core on all page components
    - Verify focus indicators (3:1 contrast, 2px thickness) on all interactive elements
    - Verify keyboard navigation through forms, accordions, menus
    - Ensure ARIA attributes on dynamic content (accordion, mobile menu, filter results)
    - Verify 4.5:1 contrast ratio for normal text, 3:1 for large text
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

  - [x] 10.2 Responsive design verification and fixes
    - Verify layouts at all 3 breakpoints (mobile <768px, tablet 768-1024px, desktop >1024px)
    - Ensure WhatsApp button, CTA, and provider search visible in first viewport on mobile
    - Verify no horizontal scrollbar at any breakpoint
    - Verify images scale proportionally
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The Provider Network page is implemented last because it depends on all foundational utilities, hooks, and components
- All user-facing text should be in Brazilian Portuguese
- Mock data is structured for easy future API replacement

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4"] },
    { "id": 3, "tasks": ["1.5", "1.6", "1.7", "1.8", "1.9", "1.10"] },
    { "id": 4, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 5, "tasks": ["3.4"] },
    { "id": 6, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.7", "4.8", "4.9", "4.10", "4.11", "4.12"] },
    { "id": 7, "tasks": ["4.6", "4.13"] },
    { "id": 8, "tasks": ["6.1"] },
    { "id": 9, "tasks": ["6.2", "6.3", "6.4", "6.5", "6.6"] },
    { "id": 10, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 11, "tasks": ["7.6"] },
    { "id": 12, "tasks": ["9.1"] },
    { "id": 13, "tasks": ["9.2", "9.3"] },
    { "id": 14, "tasks": ["9.4"] },
    { "id": 15, "tasks": ["9.5"] },
    { "id": 16, "tasks": ["10.1", "10.2"] }
  ]
}
```
