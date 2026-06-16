# Requirements Document

## Introduction

This document defines the requirements for the Amacor Planos de Saúde website — a complete redesign focused on conversion optimization, institutional confidence, and self-service for beneficiaries. The website is built with React, TypeScript, and Tailwind CSS, serving as the primary digital presence for Amacor, a health insurance operator with 30+ years in Campo Grande and the Zona Oeste region of Rio de Janeiro. The central message is: "Planos inteligentes, acessíveis e próximos de você." The target audience is primarily people aged 50+, requiring exceptional accessibility, large interactive elements, clear language, and simple navigation paths to key actions (WhatsApp contact, plan simulation, beneficiary self-service, and provider network search). The visual identity follows a clean, modern digital health aesthetic — white/light gray backgrounds, rounded cards, blue/green palette tied to health and trust, medical icons, human photography, and premium composition with generous whitespace.

## Glossary

- **Website**: The Amacor Planos de Saúde web application built with React, TypeScript, and Tailwind CSS
- **User**: A visitor to the Amacor website, primarily aged 50+
- **Beneficiary**: An existing Amacor plan holder accessing self-service features
- **Lead**: A potential customer expressing interest through simulation, form, or WhatsApp contact
- **Provider_Network_Page**: The Rede Credenciada page displaying a searchable, filterable list of healthcare providers
- **Provider_Card**: A UI component displaying a single healthcare provider's information including name, type, specialties, address, contact options, hours, accepted plans, and distance
- **Plan_Card**: A UI component displaying plan summary with starting price, contract type, main benefits, and CTAs
- **Simulation_Widget**: An interactive component allowing users to simulate plan pricing based on age range and number of dependents
- **Header**: The fixed navigation component present on all pages with organized, non-cluttered navigation
- **Footer**: The complete footer component with regulatory information, social media links, and secondary navigation
- **WhatsApp_Button**: A floating action button present on all pages providing quick access to WhatsApp contact
- **WhatsApp_CTA**: An inline call-to-action button directing users to WhatsApp for plan contracting or support
- **Search_Filters**: The filtering and search component on the Provider Network Page
- **Accordion**: A collapsible content component used for displaying waiting period information
- **Contact_Form**: A reusable form component for user inquiries and proposal requests
- **CTA_Section**: A call-to-action section component used across multiple pages
- **Hero_Section**: A prominent banner section at the top of pages with key messaging and primary CTAs
- **Benefits_Grid**: A grid of icon-based cards highlighting plan benefits (Telemedicina 24h, Atendimento ambulatorial, etc.)
- **Trust_Section**: A section displaying institutional stats and credentials (30+ anos, Região Oeste, ANS, IDSS)
- **Testimonials_Section**: A section displaying social proof through customer testimonials or trust indicators
- **Beneficiary_Area**: A dedicated section/page for existing beneficiaries with self-service quick-access cards
- **CEP**: Brazilian postal code (Código de Endereçamento Postal)
- **IDSS**: Índice de Desempenho da Saúde Suplementar — health insurance performance index
- **TISS**: Troca de Informações na Saúde Suplementar — health information exchange standard
- **ANS**: Agência Nacional de Saúde Suplementar — the regulatory body for health insurance in Brazil
- **Geolocation_API**: The browser's built-in geolocation interface for determining user position
- **Mock_Data**: Static JSON data structures simulating API responses, ready for future backend integration
- **Provider_Type**: Classification of a healthcare provider (e.g., clinic, laboratory, hospital)
- **Specialty**: Medical specialty offered by a provider (e.g., Cardiologia, Dermatologia, Pediatria)
- **Telemedicine_Page**: The dedicated page explaining the telemedicine service and its access
- **Plans_Page**: The page displaying all available plans with comparison and contracting CTAs
- **Institutional_Page**: The page presenting Amacor's history, tradition, regulatory data, and credentials

## Requirements

### Requirement 1: Global Layout and Navigation

**User Story:** As a user, I want a consistent, organized, and clutter-free layout across all pages, so that I can find information without confusion or structural repetition.

#### Acceptance Criteria

1. THE Website SHALL render a fixed Header component at the top of every page that remains visible while the user scrolls, with navigation links organized into the following main sections: Início, Planos, Telemedicina, Rede Credenciada, Área do Beneficiário, Institucional, Contato
2. THE Website SHALL render a Footer component at the bottom of every page containing regulatory information (ANS registry number), contact details, social media links, and secondary navigation links
3. THE Website SHALL render a floating WhatsApp_Button component on all pages, positioned in the bottom-right corner with a minimum touch target of 56x56 pixels
4. WHEN a User taps the WhatsApp_Button, THE Website SHALL open a WhatsApp conversation link in a new browser tab within 1 second
5. THE Header SHALL display navigation items using text with a minimum font size of 16 pixels and SHALL visually distinguish the currently active section from other navigation items
6. WHEN the viewport width is less than 768 pixels, THE Header SHALL collapse navigation into a hamburger menu with large tap targets of at least 48x48 pixels
7. WHEN a User taps the hamburger menu icon, THE Header SHALL expand a navigation panel displaying all main section links, and WHEN the User taps the icon again or selects a link, THE Header SHALL collapse the navigation panel
8. THE Website SHALL use only the brand color palette: blue as primary color for trust and professionalism, green as secondary for health and WhatsApp elements, white and light gray as backgrounds, with no structural repetition or duplicate navigation paths between Header and page content
9. THE Header SHALL NOT contain duplicate links to the same destination, and navigation grouping SHALL avoid nested dropdowns deeper than one level to maintain simplicity for the 50+ audience

### Requirement 2: Home Page — Hero and Conversion

**User Story:** As a user, I want a welcoming home page that immediately communicates what Amacor offers and guides me to simulate a plan or talk to an advisor, so that I can take action without scrolling excessively.

#### Acceptance Criteria

1. THE Website SHALL render the Home page with a Hero_Section containing the headline "Planos de saúde inteligentes para cuidar de você e da sua família", a subtitle "Consultas, exames, telemedicina e atendimento ambulatorial com praticidade em Campo Grande e região.", and two primary CTA buttons: "Simular meu plano" and "Falar no WhatsApp", each with a minimum touch target of 48x48 pixels
2. WHEN a User clicks the "Simular meu plano" CTA, THE Website SHALL scroll smoothly to the Simulation_Widget section on the Home page or navigate to the Plans_Page simulation section
3. WHEN a User clicks the "Falar no WhatsApp" CTA, THE Website SHALL open a WhatsApp conversation link with a pre-filled message in a new browser tab within 1 second
4. THE Website SHALL render a Simulation_Widget section below the Hero_Section allowing Users to select age range and number of dependents to receive an estimated monthly price, with a CTA to "Contratar pelo WhatsApp" after simulation
5. THE Website SHALL display a Benefits_Grid section with exactly 6 icon-based rounded cards: Telemedicina 24h, Atendimento ambulatorial, Consultas e exames, Ambulância e aconselhamento médico, Mais de 2 mil procedimentos, and Área do beneficiário e 2ª via de boleto
6. THE Website SHALL display Plan_Card components in a commercial style showing: plan name, starting price ("A partir de R$..."), contract type (individual/familiar/empresarial), list of 3 to 5 main benefits, and two CTAs: "Ver detalhes" and "Contratar pelo WhatsApp"
7. THE Website SHALL display a "Saúde Digital" section with a split layout: explanatory text about telemedicine on the left and a phone mockup illustration on the right, with a CTA linking to the Telemedicine_Page
8. THE Website SHALL display a Trust_Section titled "Mais de 30 anos cuidando da saúde da Zona Oeste" with at least 6 stat items: +30 anos de tradição, Região Oeste do RJ, Atendimento ambulatorial, Registro ANS ativo, Rede própria e credenciada, and IDSS avaliado
9. THE Website SHALL display a Provider Network CTA_Section with a direct link to the Provider_Network_Page
10. THE Website SHALL display a Testimonials_Section with at least 3 trust indicators or customer testimonial cards
11. THE Website SHALL display a Beneficiary_Area section with large quick-access cards for: 2ª via de boleto, Manual do associado, Telemedicina, and Ouvidoria
12. THE Website SHALL display a final Contact CTA_Section containing a WhatsApp contact button and a phone contact button, each with a minimum touch target of 48x48 pixels
13. THE Website SHALL render Home page sections in the following top-to-bottom order: Hero_Section, Simulation_Widget, Benefits_Grid, Plan_Cards, Saúde Digital section, Trust_Section, Provider Network CTA_Section, Testimonials_Section, Beneficiary_Area section, Contact CTA_Section

### Requirement 3: Plans Page

**User Story:** As a user, I want to see all available health plans with pricing, compare them side by side, and easily start contracting, so that I can choose the best plan for my situation.

#### Acceptance Criteria

1. THE Website SHALL render the Plans_Page with Plan_Card components for: Amacor Exclusivo I (individual/familiar), Amacor Exclusivo II (mais cobertura), Amacor Mais com Franquia (mais acessível), and Empresarial (empresas e colaboradores)
2. THE Website SHALL display each Plan_Card with: plan name, a tagline of no more than 80 characters, starting price ("A partir de R$..."), contract type, a list of 3 to 5 main benefit items, and two CTA buttons: "Ver detalhes" and "Contratar pelo WhatsApp"
3. THE Website SHALL display a plan comparison table showing all plans side by side with rows for: price range, contract type, coverage items, telemedicine access, network type, and co-participation details
4. WHEN the viewport width is 768 pixels or greater, THE Website SHALL display Plan_Card components in a multi-column grid layout showing all cards side by side
5. WHEN the viewport width is less than 768 pixels, THE Website SHALL display Plan_Card components in a single-column stacked layout and the comparison table SHALL scroll horizontally
6. WHEN a User clicks a "Ver detalhes" CTA button on a Plan_Card, THE Website SHALL navigate to the corresponding plan detail page within 1 second
7. WHEN a User clicks a "Contratar pelo WhatsApp" CTA button, THE Website SHALL open a WhatsApp conversation link with the plan name pre-filled in the message
8. THE Website SHALL display a Simulation_Widget at the top of the Plans_Page allowing Users to select age range and number of dependents to view estimated pricing for each plan
9. THE Website SHALL organize the Plans_Page with filter tabs for: Todos, Individual, Familiar, and Empresarial, allowing Users to filter visible Plan_Card components by category

### Requirement 4: Plan Detail Pages

**User Story:** As a user, I want to see detailed benefits of a specific plan and easily request contact or contract via WhatsApp, so that I can make an informed decision.

#### Acceptance Criteria

1. THE Website SHALL render individual plan detail pages for Exclusivo I, Exclusivo II, and Amacor Mais com Franquia, each displaying: full plan name, detailed description, complete benefits list with icons, coverage details, co-participation rules, and network information
2. THE Website SHALL render a Contact_Form on each plan detail page with required fields for name (maximum 120 characters), phone (maximum 15 digits, Brazilian format), and email (maximum 254 characters), and an optional message field (maximum 1000 characters)
3. THE Website SHALL display a prominent WhatsApp_CTA on each plan detail page with the text "Contratar pelo WhatsApp" that opens a conversation with the plan name pre-filled
4. WHEN a User submits the Contact_Form with all required fields filled and valid, THE Website SHALL display a green confirmation message below the form indicating the request was received, and SHALL clear all form fields
5. IF a User submits the Contact_Form with missing required fields or invalid field formats, THEN THE Website SHALL display inline validation errors in red text next to each invalid or incomplete field, indicating what correction is needed, and SHALL preserve the User's entered data
6. IF a User submits the Contact_Form and the submission fails due to a system error, THEN THE Website SHALL display an error message indicating the submission could not be completed and SHALL preserve all entered form data
7. THE Website SHALL render a Corporate Plan detail page for the Empresarial plan with a proposal Contact_Form containing required fields: company name (maximum 100 characters), contact name (maximum 80 characters), phone (maximum 20 characters), email (maximum 120 characters), number of employees (numeric, range 1 to 99999), and optional message (maximum 500 characters)

### Requirement 5: Telemedicine Page

**User Story:** As a user, I want to understand how Amacor's telemedicine service works and how to access it, so that I can get medical attention from home when needed.

#### Acceptance Criteria

1. THE Website SHALL render the Telemedicine_Page with a Hero_Section containing the headline "Atendimento médico na palma da mão" and a subtitle explaining 24-hour access to medical consultations via smartphone
2. THE Website SHALL display a "Como funciona" section with a step-by-step guide (numbered steps with icons) explaining how to access and use the telemedicine service
3. THE Website SHALL display a Benefits section with at least 4 benefit cards highlighting: 24-hour availability, no waiting room, prescription and referral capability, and access from anywhere
4. THE Website SHALL display a CTA_Section with buttons to "Acessar Telemedicina" (linking to the telemedicine platform) and "Falar no WhatsApp" for support
5. THE Website SHALL display which plans include telemedicine access and a brief FAQ section with at least 3 common questions answered using Accordion components
6. WHEN a User clicks the "Acessar Telemedicina" button, THE Website SHALL open the telemedicine platform link in a new browser tab

### Requirement 6: Beneficiary Area Page

**User Story:** As a beneficiary, I want quick and frictionless access to self-service tools like boleto, manual, reimbursement, and ombudsman, so that I can resolve my needs without calling support.

#### Acceptance Criteria

1. THE Website SHALL render the Beneficiary_Area page with large, visually distinct quick-access cards for the following services: 2ª via de boleto, Manual do associado, Ouvidoria, Reembolso, Telemedicina, and Reajuste anual
2. THE Website SHALL display each quick-access card with an icon, a service title, and a short description of no more than 60 characters explaining the action
3. WHEN a User clicks the "2ª via de boleto" card, THE Website SHALL navigate to the boleto generation service or display instructions for obtaining the second copy
4. WHEN a User clicks the "Manual do associado" card, THE Website SHALL open or download the associate manual PDF document
5. WHEN a User clicks the "Ouvidoria" card, THE Website SHALL navigate to the ombudsman contact section with phone, email, and form access
6. WHEN a User clicks the "Reembolso" card, THE Website SHALL navigate to a section explaining the reimbursement process with required documentation and submission instructions
7. WHEN a User clicks the "Telemedicina" card, THE Website SHALL navigate to the Telemedicine_Page or directly to the telemedicine platform access
8. WHEN a User clicks the "Reajuste anual" card, THE Website SHALL display information about the annual price adjustment including applicable rates and regulatory basis
9. THE Website SHALL display quick-access cards with a minimum size of 120x120 pixels and a minimum touch target of 48x48 pixels to reduce friction for the 50+ audience
10. WHILE the viewport width is less than 768 pixels, THE Website SHALL display quick-access cards in a 2-column grid layout, and WHILE the viewport width is 768 pixels or greater, THE Website SHALL display them in a 3-column grid layout

### Requirement 7: Institutional Page

**User Story:** As a user, I want to learn about Amacor's history, tradition, and regulatory standing, so that I can trust the company before choosing a plan.

#### Acceptance Criteria

1. THE Website SHALL render the Institutional_Page with sections for: history and tradition, mission/values/vision, ANS registration, IDSS performance index, and regulatory compliance
2. THE Website SHALL display the history section emphasizing 30+ years of operation in Campo Grande and the Zona Oeste region of Rio de Janeiro, including founding context and growth milestones
3. THE Website SHALL display ANS registration information including the registry number, active status, and a link to verify on the ANS website
4. THE Website SHALL display IDSS performance data with yearly indicators, linking to the dedicated IDSS detail page for full historical data
5. THE Website SHALL display each section (history, mission, values, vision) with a descriptive heading and body text using a minimum font size of 18 pixels
6. THE Website SHALL use rounded cards with soft shadows to present each value item, displaying at least 3 value items
7. THE Website SHALL display a CTA_Section at the bottom of the Institutional_Page guiding the User to the Plans_Page or a WhatsApp contact channel

### Requirement 8: Provider Network Page (Rede Credenciada)

**User Story:** As a user, I want to search and filter healthcare providers by location, specialty, and plan, so that I can quickly find a nearby provider that accepts my plan.

#### Acceptance Criteria

1. THE Provider_Network_Page SHALL display Search_Filters at the top of the page with options for: geolocation search, CEP search, city/neighborhood filter, specialty filter, plan filter, and provider type filter
2. WHEN a User activates geolocation search, THE Provider_Network_Page SHALL request browser geolocation permission and use the Geolocation_API to determine the User's current position
3. WHEN a User enters a valid 8-digit CEP, THE Provider_Network_Page SHALL filter providers to show those within a 10 km radius of the CEP's geographic center
4. THE Provider_Network_Page SHALL provide a specialty filter with the following options: Clínica médica, Cardiologia, Dermatologia, Ginecologia, Pediatria, Ortopedia, Oftalmologia, Laboratório, Fisioterapia, Psicologia, Exames, Urgência, Telemedicina
5. THE Provider_Network_Page SHALL provide a plan filter allowing Users to select which Amacor plan they hold (Exclusivo I, Exclusivo II, Amacor Mais com Franquia, Empresarial)
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

### Requirement 9: Individual Waiting Periods Page (Carência Individual)

**User Story:** As a user, I want to look up waiting periods for individual plan procedures, so that I know when I can access specific services.

#### Acceptance Criteria

1. THE Website SHALL render the Individual Waiting Periods page with an Accordion component listing procedures and their corresponding waiting periods, where each Accordion item header displays the procedure name and each expanded item displays the waiting period duration in days
2. THE Website SHALL provide a search field at the top of the page allowing Users to filter Accordion items by procedure name
3. WHEN a User types in the search field, THE Website SHALL perform a case-insensitive substring match against procedure names and display only Accordion items whose procedure name contains the entered text
4. WHEN a User clicks an Accordion item header, THE Website SHALL expand that item to reveal the waiting period duration, and collapse any previously expanded Accordion item
5. IF the search field text does not match any procedure name, THEN THE Website SHALL display a message indicating no procedures were found and suggesting the User adjust the search term

### Requirement 10: Corporate Waiting Periods Page (Carência Empresarial)

**User Story:** As a user, I want to look up waiting periods for corporate plan procedures, so that I know when my employees can access specific services.

#### Acceptance Criteria

1. THE Website SHALL render the Corporate Waiting Periods page with an Accordion component listing procedures and their corresponding waiting periods, sourced from Mock_Data
2. THE Website SHALL provide a search field at the top of the page allowing Users to filter Accordion items by procedure name
3. WHEN a User types in the search field, THE Website SHALL filter visible Accordion items to show only those whose procedure name contains the search text using case-insensitive substring matching
4. WHEN a User clicks an Accordion item header, THE Website SHALL expand that item to reveal the waiting period details including the procedure name and the waiting period duration in days
5. IF no Accordion items match the search text, THEN THE Website SHALL display a message indicating no procedures were found for the entered search term
6. WHEN a User clicks an already-expanded Accordion item header, THE Website SHALL collapse that item to hide the waiting period details

### Requirement 11: IDSS Performance Indicators Page

**User Story:** As a user, I want to view Amacor's performance indicators by year, so that I can assess the quality of the operator.

#### Acceptance Criteria

1. THE Website SHALL render the IDSS page with performance data organized by year (2020, 2023, 2025), displaying the 2025 year data by default on page load
2. THE Website SHALL display the 2025 IDSS data with the following values formatted to 4 decimal places: IDSS 0.3095, IDQS 0.0000, IDGA 0.0000, IDSM 0.9208, IDGR 0.3333
3. THE Website SHALL present each year's data in a separate section where each indicator is displayed with its acronym label (IDSS, IDQS, IDGA, IDSM, IDGR) adjacent to its numeric value, and each year section displays the corresponding year as a heading
4. WHEN a User selects a different year, THE Website SHALL display the corresponding performance data for that year within 1 second of selection
5. IF performance data for a selected year is unavailable, THEN THE Website SHALL display a message indicating that no data is available for the selected year

### Requirement 12: TISS Manual Page (Manual TISS)

**User Story:** As a user, I want to access TISS documentation and download relevant files, so that I can comply with health information exchange standards.

#### Acceptance Criteria

1. THE Website SHALL render the TISS Manual page with a heading identifying the page and a text section describing the purpose and applicability of the TISS standard for health information exchange
2. THE Website SHALL display at least one downloadable document link on the TISS Manual page, where each link shows the document name and file format
3. WHEN a User clicks a document download link, THE Website SHALL initiate a file download for the selected document
4. IF a document file is unavailable or the download fails, THEN THE Website SHALL display an error message indicating the file could not be downloaded and suggesting the User try again later

### Requirement 13: Contact Page

**User Story:** As a user, I want to find Amacor's contact information through multiple channels and send a message, so that I can get in touch for questions or support.

#### Acceptance Criteria

1. THE Website SHALL render the Contact page with a Contact_Form containing required fields for name (maximum 100 characters), phone (maximum 15 digits), email (maximum 254 characters), subject (maximum 150 characters), and message (maximum 2000 characters)
2. THE Website SHALL display contact cards showing: WhatsApp number with direct link, phone numbers, email addresses, physical address, and office hours
3. THE Website SHALL display an embedded map showing Amacor's physical location in Campo Grande, RJ
4. THE Website SHALL display social media links (Instagram, Facebook) with icons linking to Amacor's official profiles
5. WHEN a User submits the Contact_Form with all required fields filled and valid (email in standard email format, phone containing only digits, spaces, hyphens, or parentheses), THE Website SHALL display a green confirmation message and clear the form fields
6. IF a User submits the Contact_Form with missing required fields or invalid field formats, THEN THE Website SHALL display inline validation errors next to each invalid or incomplete field indicating the specific issue
7. WHEN a User taps a phone number on a contact card, THE Website SHALL initiate a phone call to that number
8. WHEN a User taps the WhatsApp number on a contact card, THE Website SHALL open a WhatsApp conversation link in a new browser tab
9. IF the Contact_Form submission fails due to a server or network error, THEN THE Website SHALL display an error message indicating the message was not sent and SHALL preserve the entered form data

### Requirement 14: Lead Capture and Conversion Optimization

**User Story:** As a potential customer, I want multiple low-friction ways to express interest in a plan, so that I can get information or start contracting without barriers.

#### Acceptance Criteria

1. THE Website SHALL ensure all Contact_Form components render correctly and function on mobile viewports without requiring JavaScript activation messages or broken states
2. THE Website SHALL provide at least 3 conversion touchpoints on the Home page: Simulation_Widget, WhatsApp_CTA, and Contact_Form
3. WHEN a User completes a plan simulation in the Simulation_Widget, THE Website SHALL display a WhatsApp_CTA button with the simulated plan details pre-filled for immediate contracting
4. THE Website SHALL track Lead interactions by storing form submission data in a format compatible with future CRM integration using Mock_Data structures
5. THE Website SHALL ensure all WhatsApp_CTA links include contextual pre-filled messages indicating the page of origin and selected plan when applicable
6. IF the Website detects that JavaScript is not fully loaded when a User attempts to use a Contact_Form, THEN THE Website SHALL display a fallback contact method (WhatsApp link and phone number) instead of a broken form state
7. THE Website SHALL render all lead capture forms with fields at full width on mobile viewports, a minimum input height of 48 pixels, and clearly visible submit buttons with a minimum touch target of 48x48 pixels

### Requirement 15: Accessibility and Readability

**User Story:** As a user aged 50+, I want the website to be easy to read and interact with, so that I can use it without difficulty or frustration.

#### Acceptance Criteria

1. THE Website SHALL use a minimum body text font size of 18 pixels across all pages
2. THE Website SHALL use a minimum heading font size of 24 pixels across all pages
3. THE Website SHALL maintain a color contrast ratio of at least 4.5:1 for normal-sized text (below 24 pixels) and at least 3:1 for large text (24 pixels and above) against its background
4. THE Website SHALL provide clickable areas with a minimum size of 48x48 pixels for all interactive elements
5. THE Website SHALL use a minimum spacing of 16 pixels between interactive elements to prevent accidental taps
6. THE Website SHALL avoid auto-playing animations, and any animation present SHALL not move or reposition page content after it has been rendered, and SHALL not use flashing or blinking effects that cycle more than 3 times per second
7. THE Website SHALL use language at or below an 8th-grade reading level (Flesch-Kincaid Grade Level of 8 or less) and SHALL avoid domain-specific technical terms unless a plain-language definition is provided inline or in a glossary
8. THE Website SHALL provide focus indicators on all interactive elements that have a minimum contrast ratio of 3:1 against adjacent colors and a minimum thickness of 2 pixels for keyboard navigation

### Requirement 16: Responsive Design

**User Story:** As a user, I want the website to work well on my phone, tablet, and computer, so that I can access it from any device.

#### Acceptance Criteria

1. THE Website SHALL adapt its layout to three breakpoints: mobile (below 768px), tablet (768px to 1024px), and desktop (above 1024px)
2. WHILE the viewport width is less than 768 pixels, THE Website SHALL display the WhatsApp_Button, simulation CTA, and Provider Network search within the first visible viewport without requiring scrolling
3. WHILE the viewport width is less than 768 pixels, THE Website SHALL display card components in a single-column layout
4. WHILE the viewport width is less than 768 pixels, THE Website SHALL render form fields at full width with a minimum height of 48 pixels
5. THE Website SHALL render all images and media so that they scale proportionally and do not exceed the width of their containing element
6. THE Website SHALL NOT display a horizontal scrollbar at any of the three defined breakpoints

### Requirement 17: Visual Identity and Design System

**User Story:** As a user, I want the website to feel modern, trustworthy, and human, so that I feel confident choosing Amacor as my health plan provider.

#### Acceptance Criteria

1. THE Website SHALL use rounded cards (border-radius of at least 12 pixels) with soft shadows for all card components (Plan_Card, Provider_Card, benefit cards, quick-access cards)
2. THE Website SHALL use a consistent icon set with medical/health-themed icons for benefit items, service cards, and navigation elements
3. THE Website SHALL incorporate human photography (people, families, medical professionals) in Hero sections and key marketing sections, using images that represent the 50+ target audience
4. THE Website SHALL maintain generous whitespace with a minimum of 48 pixels vertical spacing between major page sections
5. THE Website SHALL use the blue/green color palette exclusively: blue for primary actions and headings, green for health indicators and WhatsApp elements, white and light gray for backgrounds, avoiding cluttered color usage
6. THE Website SHALL display all section headings in a consistent typographic style with bold weight and the primary blue color

### Requirement 18: Reusable Component Architecture

**User Story:** As a developer, I want a library of reusable components, so that I can maintain consistency and develop new pages efficiently.

#### Acceptance Criteria

1. THE Website SHALL implement the following as reusable React components: Header, Footer, WhatsApp_Button, WhatsApp_CTA, Hero_Section, Plan_Card, Benefits_Grid, Trust_Section, Testimonials_Section, Simulation_Widget, Provider_Card, Search_Filters, Accordion, Contact_Form, CTA_Section, Beneficiary_Area cards
2. THE Website SHALL define and export a TypeScript props interface for each reusable component, distinguishing required props from optional props with default values, so that each component renders correctly when provided only its required props
3. THE Website SHALL apply all component-specific styles as Tailwind CSS utility classes directly within the component's JSX markup, without requiring external CSS files or separate style modules
4. THE Website SHALL organize components in a dedicated components directory with one file per component or one folder per component when the component includes sub-components or helper files
5. THE Website SHALL ensure each reusable component contains no page-specific hardcoded content, receiving all variable text, URLs, and data through its props interface
