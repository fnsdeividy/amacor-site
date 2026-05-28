---
inclusion: auto
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web applications. Use this when building or reviewing UI components, pages, layouts, or any visual/interaction design decisions.

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks |
|----------|----------|--------|------------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels |
| 2 | Touch & Interaction | CRITICAL | Min size 44×44px, 8px+ spacing, Loading feedback |
| 3 | Performance | HIGH | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) |
| 4 | Style Selection | HIGH | Match product type, Consistency, SVG icons (no emoji) |
| 5 | Layout & Responsive | HIGH | Mobile-first breakpoints, No horizontal scroll |
| 6 | Typography & Color | MEDIUM | Base 16px, Line-height 1.5, Semantic color tokens |
| 7 | Animation | MEDIUM | Duration 150–300ms, Motion conveys meaning |
| 8 | Forms & Feedback | MEDIUM | Visible labels, Error near field, Progressive disclosure |
| 9 | Navigation Patterns | HIGH | Predictable back, Bottom nav ≤5, Deep linking |
| 10 | Charts & Data | LOW | Legends, Tooltips, Accessible colors |

## Common Rules for Professional UI

### Icons & Visual Elements

- **No Emoji as Structural Icons** — Use vector-based icons (Heroicons, Lucide). Emojis are font-dependent and inconsistent across platforms.
- **Vector-Only Assets** — Use SVG icons that scale cleanly and support theming.
- **Consistent Icon Sizing** — Define icon sizes as design tokens (icon-sm=16, icon-md=20, icon-lg=24).
- **Stroke Consistency** — Use consistent stroke width (1.5px or 2px) within the same visual layer.
- **Touch Target Minimum** — 44×44px interactive area minimum.

### Typography

- **Base 16px** — Minimum body text size for readability.
- **Line-height 1.5-1.75** — For body text readability.
- **Font pairing** — Match heading/body font personalities. Use display fonts for headings, text fonts for body.
- **Font scale** — Consistent type scale (12, 14, 16, 18, 24, 32, 40, 48).
- **Weight hierarchy** — Bold headings (600–700), Regular body (400), Medium labels (500).
- **Letter-spacing** — Tighter for headings (-0.025em), normal for body.

### Color & Contrast

- **Semantic color tokens** — Define primary, secondary, error, surface, on-surface. Never use raw hex in components.
- **4.5:1 contrast** — For normal text against background.
- **3:1 contrast** — For large text and UI elements.
- **Color not only** — Don't convey info by color alone (add icon/text).

### Layout & Spacing

- **8px spacing rhythm** — Use 4/8px increments for all padding/gaps/margins.
- **Mobile-first** — Design mobile-first, then scale up.
- **Consistent max-width** — Use max-w-7xl or similar for desktop content.
- **No horizontal scroll** — Content must fit viewport width.
- **Visual hierarchy** — Establish via size, spacing, contrast — not color alone.

### Interaction

- **Hover feedback** — Clear visual change on hover (color shift, shadow, scale).
- **Press feedback** — Visual feedback within 100ms of interaction.
- **Loading states** — Show skeleton or spinner when loading exceeds 300ms.
- **Disabled clarity** — Reduced opacity (0.4-0.5) + cursor change.
- **Animation timing** — 150-300ms for micro-interactions with ease-out.

### Forms

- **Visible labels** — Always use visible labels, not placeholder-only.
- **Error near field** — Show error below the related field.
- **Required indicators** — Mark required fields with asterisk.
- **Inline validation** — Validate on blur, not keystroke.
- **Helper text** — Provide persistent helper text for complex inputs.

### Navigation

- **Active state** — Current location visually highlighted in navigation.
- **Consistent placement** — Navigation stays the same across all pages.
- **Breadcrumbs** — For 3+ level deep hierarchies.
- **Back behavior** — Predictable and consistent.

## Pre-Delivery Checklist

Before delivering UI code:

### Visual Quality
- [ ] No emojis used as structural icons (use SVG)
- [ ] All icons from consistent icon family
- [ ] Semantic theme tokens used (no hardcoded colors)
- [ ] Hover/pressed states don't shift layout

### Interaction
- [ ] All interactive elements have hover/focus states
- [ ] Touch targets ≥ 44×44px
- [ ] Animation timing 150-300ms
- [ ] Disabled states are visually clear

### Layout
- [ ] No horizontal scroll at any breakpoint
- [ ] Consistent spacing rhythm (8px base)
- [ ] Content readable on mobile (no edge-to-edge text)
- [ ] Responsive at 375px, 768px, 1024px, 1440px

### Accessibility
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Color contrast meets 4.5:1
- [ ] Focus indicators visible
- [ ] Color is not the only indicator
