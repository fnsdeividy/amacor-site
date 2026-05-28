# Requirements Document

## Introduction

This document defines the requirements for the Amacor Planos de Saúde website — a modern, responsive, and accessible web application built with React, TypeScript, and Tailwind CSS. The website serves as the primary digital presence for Amacor, a health insurance operator focused on outpatient care offering individual, family, and corporate plans. The target audience is primarily people aged 50+, requiring exceptional accessibility, large interactive elements, clear language, and simple navigation paths to key actions (WhatsApp contact, phone calls, plan simulation, and provider network search).

## Glossary

- **Website**: The Amacor Planos de Saúde web application built with React, TypeScript, and Tailwind CSS
- **User**: A visitor to the Amacor website, primarily aged 50+
- **Provider_Network_Page**: The Rede Credenciada page — the most critical page of the website — displaying a searchable, filterable list of healthcare providers
- **Provider_Card**: A UI component displaying a single healthcare provider's information including name, type, specialties, address, contact options, hours, accepted plans, and distance
- **Plan_Card**: A UI component displaying summary information about a health insurance plan
- **Header**: The fixed navigation component present on all pages
- **Footer**: The complete footer component with regulatory information present on all pages
- **WhatsApp_Button**: A floating action button present on all pages providing quick access to WhatsApp contact
- **Search_Filters**: The filtering and search component on the Provider Network Page
- **Accordion**: A collapsible content component used for displaying waiting period information
- **Contact_Form**: A reusable form component for user inquiries and proposal requests
- **CTA_Section**: A call-to-action section component used across multiple pages
- **Hero_Section**: A prominent banner section at the top of pages with key messaging
- **CEP**: Brazilian postal code (Código de Endereçamento Postal)
- **IDSS**: Índice de Desempenho da Saúde Suplementar — health insurance performance index
- **TISS**: Troca de Informações na Saúde Suplementar — health information exchange standard
- **Geolocation_API**: The browser's built-in geolocation interface for determining user position
- **Mock_Data**: Static JSON data structures simulating API responses, ready for future backend integration
- **Provider_Type**: Classification of a healthcare provider (e.g., clinic, laboratory, hospital)
- **Specialty**: Medical specialty offered by a provider (e.g., Cardiologia, Dermatologia, Pediatria)

## Requirements

### Requirement 1: Global Layout and Navigation

**User Story:** As a user, I want a consistent, easy-to-navigate layout across all pages, so that I can find information without confusion.

#### Acceptance Criteria

1. THE Website SHALL render a fixed Header component at the top of every page that remains visible while the user scrolls, with navigation links to all main sections
2. THE Website SHALL render a Footer component at the bottom of every page containing regulatory information, contact details, and secondary navigation links
3. THE Website SHALL render a floating WhatsApp_Button component on all pages, positioned in the bottom-right corner with a minimum touch target of 56x56 pixels
4. WHEN a User taps the WhatsApp_Button, THE Website SHALL open a WhatsApp conversation link in a new browser tab within 1 second
5. THE Header SHALL display navigation items using text with a minimum font size of 16 pixels and SHALL visually distinguish the currently active section from other navigation items
6. WHEN the viewport width is less than 768 pixels, THE Header SHALL collapse navigation into a hamburger menu with large tap targets of at least 48x48 pixels
7. WHEN a User taps the hamburger menu icon, THE Header SHALL expand a navigation panel displaying all main section links, and WHEN the User taps the icon again or selects a link, THE Header SHALL collapse the navigation panel
8. THE Website SHALL use only the brand color palette: blue as primary, orange as accent, white and light gray as backgrounds, and green exclusively for WhatsApp and confirmation elements

### Requirement 2: Home Page

**User Story:** As a user, I want a welcoming home page that quickly shows me what Amacor offers and guides me to key actions, so that I can find what I need without scrolling excessively.

#### Acceptance Criteria

1. THE Website SHALL render the Home page with a Hero_Section containing a headline, a subtitle of no more than 150 characters, and a CTA button for plan simulation with a minimum touch target of 48x48 pixels
2. THE Website SHALL display exactly 3 highlight cards on the Home page summarizing key offerings (individual plans, corporate plans, provider network), each containing a title, a short description of no more than 80 characters, and a link navigating to the corresponding detail page
3. THE Website SHALL display an institutional text section on the Home page describing Amacor's mission in no more than 300 characters
4. THE Website SHALL display a Provider Network CTA_Section on the Home page with a direct link to the Provider_Network_Page
5. THE Website SHALL display a final CTA_Section on the Home page containing a WhatsApp contact button and a phone contact button, each with a minimum touch target of 48x48 pixels
6. WHEN a User clicks any CTA button on the Home page, THE Website SHALL navigate to the corresponding target page or open the corresponding contact channel within 1 second
7. THE Website SHALL render Home page sections in the following top-to-bottom order: Hero_Section, highlight cards, institutional text section, Provider Network CTA_Section, final CTA_Section

### Requirement 3: About Page (A Empresa)

**User Story:** As a user, I want to learn about Amacor's mission, values, and vision, so that I can trust the company before choosing a plan.

#### Acceptance Criteria

1. THE Website SHALL render the About page with visually distinct sections for mission, values, and vision, each separated by a minimum of 32 pixels of vertical spacing
2. THE Website SHALL display each section (mission, values, vision) with a descriptive heading and body text using a minimum font size of 18 pixels for body content
3. THE Website SHALL use rounded cards with soft shadows to present each value item, displaying at least 3 value items
4. THE Website SHALL display a CTA_Section at the bottom of the About page guiding the User to the Plans page or a contact channel

### Requirement 4: Plans Overview Page (Planos de Saúde)

**User Story:** As a user, I want to see all available health plans at a glance, so that I can compare options and choose the best fit.

#### Acceptance Criteria

1. THE Website SHALL render the Plans page with Plan_Card components for Exclusivo I, Exclusivo II, and Empresarial plans
2. THE Website SHALL display each Plan_Card with the plan name, a description of no more than 150 characters, a list of 3 to 5 benefit items, and a CTA button linking to the plan detail page
3. WHEN the viewport width is 768 pixels or greater, THE Website SHALL display Plan_Card components in a multi-column grid layout showing all cards side by side
4. WHEN the viewport width is less than 768 pixels, THE Website SHALL display Plan_Card components in a single-column stacked layout
5. WHEN a User clicks a Plan_Card CTA button, THE Website SHALL navigate to the corresponding plan detail page within 1 second

### Requirement 5: Individual Plan Detail Page (Plano Individual Amacor Exclusivo II)

**User Story:** As a user, I want to see detailed benefits of the Exclusivo II plan and easily request contact, so that I can make an informed decision.

#### Acceptance Criteria

1. THE Website SHALL render the Exclusivo II detail page with benefit cards displaying individual coverage items and a CTA_Section encouraging the User to request contact
2. THE Website SHALL render a Contact_Form on the Exclusivo II detail page with required fields for name (maximum 120 characters), phone (maximum 15 digits, Brazilian format), and email (maximum 254 characters, valid email format), and an optional message field (maximum 1000 characters)
3. WHEN a User submits the Contact_Form with all required fields filled and valid, THE Website SHALL display a green confirmation message below the form indicating the request was received, and SHALL clear all form fields
4. IF a User submits the Contact_Form with missing required fields or invalid field formats, THEN THE Website SHALL display inline validation errors in red text next to each invalid or incomplete field, indicating what correction is needed, and SHALL preserve the User's entered data
5. IF a User submits the Contact_Form and the submission fails due to a system error, THEN THE Website SHALL display an error message indicating the submission could not be completed and SHALL preserve all entered form data

### Requirement 6: Corporate Plan Detail Page (Plano Empresarial Amacor Mais com Franquia)

**User Story:** As a user, I want to see detailed benefits of the corporate plan and request a proposal, so that I can evaluate it for my company.

#### Acceptance Criteria

1. THE Website SHALL render the Corporate Plan detail page with at least one benefit card, where each card displays a corporate coverage item with a title and description
2. THE Website SHALL render a proposal Contact_Form on the Corporate Plan detail page with the following required fields: company name (maximum 100 characters), contact name (maximum 80 characters), phone (maximum 20 characters, digits and formatting only), email (maximum 120 characters, must match standard email format), number of employees (numeric input, range 1 to 99999), and an optional message field (maximum 500 characters)
3. WHEN a User submits the proposal Contact_Form with all required fields filled with valid values (non-empty company name, non-empty contact name, phone containing at least 10 digits, email matching a valid email format, and number of employees within 1 to 99999), THE Website SHALL display a green confirmation message and clear the form fields
4. IF a User submits the proposal Contact_Form with any required field empty or containing an invalid value, THEN THE Website SHALL display inline validation errors next to each field that is empty or invalid, indicating the specific validation failure
5. IF a User submits the proposal Contact_Form and the submission fails due to a network or server error, THEN THE Website SHALL display an error message indicating the submission could not be completed and SHALL preserve the entered form data

### Requirement 7: Provider Network Page (Rede Credenciada)

**User Story:** As a user, I want to search and filter healthcare providers by location, specialty, and plan, so that I can quickly find a nearby provider that accepts my plan.

#### Acceptance Criteria

1. THE Provider_Network_Page SHALL display Search_Filters at the top of the page with options for: geolocation search, CEP search, city/neighborhood filter, specialty filter, plan filter, and provider type filter
2. WHEN a User activates geolocation search, THE Provider_Network_Page SHALL request browser geolocation permission and use the Geolocation_API to determine the User's current position
3. WHEN a User enters a valid 8-digit CEP, THE Provider_Network_Page SHALL filter providers to show those within a 10 km radius of the CEP's geographic center
4. THE Provider_Network_Page SHALL provide a specialty filter with the following options: Clínica médica, Cardiologia, Dermatologia, Ginecologia, Pediatria, Ortopedia, Oftalmologia, Laboratório, Fisioterapia, Psicologia, Exames, Urgência, Telemedicina
5. THE Provider_Network_Page SHALL provide a plan filter allowing Users to select which Amacor plan they hold
6. THE Provider_Network_Page SHALL provide a provider type filter with the following classifications: Hospital, Clínica, Laboratório, Consultório, Pronto-Socorro
7. THE Provider_Network_Page SHALL provide view toggle buttons allowing Users to switch between list view, map view, and combined list-plus-map view
8. THE Provider_Network_Page SHALL provide sort options for: proximity (nearest first), alphabetical (A-Z), specialty, city, and neighborhood, with alphabetical (A-Z) as the default sort when geolocation is unavailable and proximity as the default when geolocation is available
9. THE Provider_Network_Page SHALL display results as Provider_Card components containing: provider name, provider type, specialties, full address, phone number, WhatsApp number, operating hours, accepted plans, and distance from User displayed in kilometers
10. WHEN a User taps the call button on a Provider_Card, THE Website SHALL initiate a phone call to the provider's number
11. WHEN a User taps the WhatsApp button on a Provider_Card, THE Website SHALL open a WhatsApp conversation with the provider
12. WHEN a User taps the directions button on a Provider_Card, THE Website SHALL open a maps application with directions to the provider's address
13. WHEN a User taps the map button on a Provider_Card, THE Website SHALL display the provider's location on the map view
14. IF no providers match the applied filters, THEN THE Provider_Network_Page SHALL display an empty state message indicating that no providers were found and suggesting the User broaden or adjust the applied filters
15. THE Provider_Network_Page SHALL use Mock_Data structured as JSON to simulate provider information, ready for future API integration
16. WHEN the viewport width is less than 768 pixels, THE Provider_Network_Page SHALL display Provider_Card components in a single-column layout with full-width filter controls
17. IF the User denies geolocation permission or the Geolocation_API fails, THEN THE Provider_Network_Page SHALL display a message indicating that location access is unavailable and prompt the User to search by CEP or city instead
18. IF a User enters a CEP that is not a valid 8-digit numeric format, THEN THE Provider_Network_Page SHALL display an inline validation message indicating the expected CEP format without submitting the search
19. THE Provider_Network_Page SHALL display a maximum of 20 Provider_Card components per page and provide pagination controls to navigate additional results

### Requirement 8: Individual Waiting Periods Page (Carência Individual)

**User Story:** As a user, I want to look up waiting periods for individual plan procedures, so that I know when I can access specific services.

#### Acceptance Criteria

1. THE Website SHALL render the Individual Waiting Periods page with an Accordion component listing procedures and their corresponding waiting periods, where each Accordion item header displays the procedure name and each expanded item displays the waiting period duration in days
2. THE Website SHALL provide a search field at the top of the page allowing Users to filter Accordion items by procedure name
3. WHEN a User types in the search field, THE Website SHALL perform a case-insensitive substring match against procedure names and display only Accordion items whose procedure name contains the entered text
4. WHEN a User clicks an Accordion item header, THE Website SHALL expand that item to reveal the waiting period duration, and collapse any previously expanded Accordion item
5. IF the search field text does not match any procedure name, THEN THE Website SHALL display a message indicating no procedures were found and suggesting the User adjust the search term

### Requirement 9: Corporate Waiting Periods Page (Carência Empresarial)

**User Story:** As a user, I want to look up waiting periods for corporate plan procedures, so that I know when my employees can access specific services.

#### Acceptance Criteria

1. THE Website SHALL render the Corporate Waiting Periods page with an Accordion component listing procedures and their corresponding waiting periods, sourced from Mock_Data
2. THE Website SHALL provide a search field at the top of the page allowing Users to filter Accordion items by procedure name
3. WHEN a User types in the search field, THE Website SHALL filter visible Accordion items to show only those whose procedure name contains the search text using case-insensitive substring matching
4. WHEN a User clicks an Accordion item header, THE Website SHALL expand that item to reveal the waiting period details including the procedure name and the waiting period duration in days
5. IF no Accordion items match the search text, THEN THE Website SHALL display a message indicating no procedures were found for the entered search term
6. WHEN a User clicks an already-expanded Accordion item header, THE Website SHALL collapse that item to hide the waiting period details

### Requirement 10: IDSS Performance Indicators Page

**User Story:** As a user, I want to view Amacor's performance indicators by year, so that I can assess the quality of the operator.

#### Acceptance Criteria

1. THE Website SHALL render the IDSS page with performance data organized by year (2020, 2023, 2025), displaying the 2025 year data by default on page load
2. THE Website SHALL display the 2025 IDSS data with the following values formatted to 4 decimal places: IDSS 0.3095, IDQS 0.0000, IDGA 0.0000, IDSM 0.9208, IDGR 0.3333
3. THE Website SHALL present each year's data in a separate section where each indicator is displayed with its acronym label (IDSS, IDQS, IDGA, IDSM, IDGR) adjacent to its numeric value, and each year section displays the corresponding year as a heading
4. WHEN a User selects a different year, THE Website SHALL display the corresponding performance data for that year within 1 second of selection
5. IF performance data for a selected year is unavailable, THEN THE Website SHALL display a message indicating that no data is available for the selected year

### Requirement 11: TISS Manual Page (Manual TISS)

**User Story:** As a user, I want to access TISS documentation and download relevant files, so that I can comply with health information exchange standards.

#### Acceptance Criteria

1. THE Website SHALL render the TISS Manual page with a heading identifying the page and a text section describing the purpose and applicability of the TISS standard for health information exchange
2. THE Website SHALL display at least one downloadable document link on the TISS Manual page, where each link shows the document name and file format
3. WHEN a User clicks a document download link, THE Website SHALL initiate a file download for the selected document
4. IF a document file is unavailable or the download fails, THEN THE Website SHALL display an error message indicating the file could not be downloaded and suggesting the User try again later

### Requirement 12: Contact Page (Contato)

**User Story:** As a user, I want to find Amacor's contact information and send a message, so that I can get in touch for questions or support.

#### Acceptance Criteria

1. THE Website SHALL render the Contact page with a Contact_Form containing required fields for name (maximum 100 characters), phone (maximum 15 digits), email (maximum 254 characters), subject (maximum 150 characters), and message (maximum 2000 characters)
2. THE Website SHALL display contact cards showing phone numbers, email addresses, and office hours
3. THE Website SHALL display an embedded map showing Amacor's physical location
4. WHEN a User submits the Contact_Form with all required fields filled and valid (email in standard email format, phone containing only digits, spaces, hyphens, or parentheses), THE Website SHALL display a green confirmation message and clear the form fields
5. IF a User submits the Contact_Form with missing required fields or invalid field formats, THEN THE Website SHALL display inline validation errors next to each invalid or incomplete field indicating the specific issue
6. WHEN a User taps a phone number on a contact card, THE Website SHALL initiate a phone call to that number
7. IF the Contact_Form submission fails due to a server or network error, THEN THE Website SHALL display an error message indicating the message was not sent and SHALL preserve the entered form data

### Requirement 13: Accessibility and Readability

**User Story:** As a user aged 50+, I want the website to be easy to read and interact with, so that I can use it without difficulty or frustration.

#### Acceptance Criteria

1. THE Website SHALL use a minimum body text font size of 18 pixels across all pages
2. THE Website SHALL use a minimum heading font size of 24 pixels across all pages
3. THE Website SHALL maintain a color contrast ratio of at least 4.5:1 for normal-sized text (below 24 pixels) and at least 3:1 for large text (24 pixels and above) against its background
4. THE Website SHALL provide clickable areas with a minimum size of 48x48 pixels for all interactive elements
5. THE Website SHALL use a minimum spacing of 16 pixels between interactive elements to prevent accidental taps
6. THE Website SHALL avoid auto-playing animations, and any animation present SHALL not move or reposition page content after it has been rendered, and SHALL not use flashing or blinking effects that cycle more than 3 times per second
7. THE Website SHALL use language at or below an 8th-grade reading level (Flesch-Kincaid Grade Level ≤ 8) and SHALL avoid domain-specific technical terms unless a plain-language definition is provided inline or in a glossary
8. THE Website SHALL provide focus indicators on all interactive elements that have a minimum contrast ratio of 3:1 against adjacent colors and a minimum thickness of 2 pixels for keyboard navigation

### Requirement 14: Responsive Design

**User Story:** As a user, I want the website to work well on my phone, tablet, and computer, so that I can access it from any device.

#### Acceptance Criteria

1. THE Website SHALL adapt its layout to three breakpoints: mobile (below 768px), tablet (768px to 1024px), and desktop (above 1024px)
2. WHILE the viewport width is less than 768 pixels, THE Website SHALL display the WhatsApp_Button, simulation CTA, and Provider Network search within the first visible viewport without requiring scrolling
3. WHILE the viewport width is less than 768 pixels, THE Website SHALL display card components in a single-column layout
4. WHILE the viewport width is less than 768 pixels, THE Website SHALL render form fields at full width with a minimum height of 48 pixels
5. THE Website SHALL render all images and media so that they scale proportionally and do not exceed the width of their containing element
6. THE Website SHALL NOT display a horizontal scrollbar at any of the three defined breakpoints

### Requirement 15: Reusable Component Architecture

**User Story:** As a developer, I want a library of reusable components, so that I can maintain consistency and develop new pages efficiently.

#### Acceptance Criteria

1. THE Website SHALL implement the following as reusable React components: Header, Footer, WhatsApp_Button, Hero_Section, Plan_Card, InfoCard, Provider_Card, Search_Filters, Accordion, Contact_Form, CTA_Section
2. THE Website SHALL define and export a TypeScript props interface for each reusable component, distinguishing required props from optional props with default values, so that each component renders correctly when provided only its required props
3. THE Website SHALL apply all component-specific styles as Tailwind CSS utility classes directly within the component's JSX markup, without requiring external CSS files or separate style modules
4. THE Website SHALL organize components in a dedicated components directory with one file per component or one folder per component when the component includes sub-components or helper files
5. THE Website SHALL ensure each reusable component contains no page-specific hardcoded content, receiving all variable text, URLs, and data through its props interface
