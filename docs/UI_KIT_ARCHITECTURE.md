# Enterprise React UI Kit Architecture

A blueprint for designing reusable, composable, and accessible components for the enterprise React UI Kit. Every component must be built to scale across consumer apps, POS systems, and admin dashboards.

## Core Component Principles

- **Composable (Compound Pattern)**: Components must avoid "prop drilling" and "god component" anti-patterns. Use the Compound Component pattern (Slots) to allow flexible composition (e.g., `<Card><Card.Header /><Card.Body /></Card>`).
- **Fully Typed**: Export strict TypeScript interfaces for all props. Never use `any`. Extend native HTML attributes where appropriate (e.g., `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`).
- **Theme Aware & Dark Mode Ready**: Rely strictly on CSS Custom Properties injected by the Theme Registry. Never hardcode colors. Components must adapt seamlessly to dark mode (`dark:bg-card`).
- **Animation Ready**: Support Framer Motion layout animations by default. Wrap structural animations in `prefers-reduced-motion` guards.
- **Touch Friendly & Responsive**: Ensure 44px minimum touch targets on mobile. Use fluid typography (`clamp`) and fluid layouts over rigid breakpoints.
- **Accessible (a11y)**: Natively support WAI-ARIA standards, keyboard navigation, and screen reader announcements.

## Standardized State Requirements

Every interactive component must account for the following states:

- **Loading State**: Predictable skeletons or inline spinners. Skeletons must match the exact dimensions of the loaded component to prevent layout shifts.
- **Disabled State**: Opacity reduced to `0.38`. Pointer events disabled. Must remain readable against background.
- **Error State**: Clear semantic colors (e.g., `text-destructive`). Never rely on color alone; provide supporting error text or icons.
- **Empty State**: Friendly, clear illustrations or text explaining why there is no data and providing a call-to-action (CTA).

## API Design & Variants (CVA)

Use Class Variance Authority (CVA) to manage component variants cleanly.

- **Variants**: Define distinct visual styles (e.g., `solid`, `outline`, `ghost`).
- **Sizes**: Define standard sizing scales (e.g., `sm`, `md`, `lg`, `icon`) adjusting padding and font-size.
- **Polymorphism**: Support the `asChild` prop (via Radix UI `Slot`) to allow semantic HTML element overriding while keeping styles (e.g., rendering a link as a button).

## Accessibility Rules

- Always map `aria-` attributes correctly (e.g., `aria-invalid`, `aria-describedby`).
- Ensure focus states (`focus-visible`) are highly distinct. Do not rely on default browser focus rings if they lack contrast.
- Ensure proper ARIA roles (`role="dialog"`, `role="alert"`).
