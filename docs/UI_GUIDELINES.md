# Design System Architecture

An enterprise-grade, premium design language. Elegant, minimal, fast, and inherently accessible.

## Core Philosophy & Inspirations
The design language is inspired by the usability and aesthetic precision of **Apple, Stripe, Linear, and Notion**. While we draw usability inspiration from industry leaders like MenuForma, this system is **strictly original**, prioritizing a unique, premium identity tailored for high-end restaurant operations.

- **Elegant**: Refined typography, crisp iconography, and generous negative space.
- **Minimal**: Signal over noise. Remove non-essential borders and dividers.
- **Fast**: Visual feedback must be instantaneous. Minimal layout shifts.
- **Modern**: Sophisticated depth, subtle shadows, and layered elevation.

## System Architecture

### Design Tokens (`packages/theme`)
Absolute values mapped to semantic tokens. These serve as the single source of truth across all apps.
- **Spacing**: 8pt grid system.
- **Typography**: Fluid scale based on rems.
- **Colors**: Semantic mapping (e.g., `background.primary`, `action.destructive`).

### Primitives & Components (`packages/ui`)
Headless UI architecture (e.g., Radix) combined with Tailwind CSS for styling.
- **Strictly Modular**: Components are isolated and reusable.
- **Stateless UI**: No business logic resides in the UI package.
- **Composable**: Build complex patterns by composing simple primitives.

## Typography & Color

### Typographic Hierarchy
- **Headings**: High-contrast, geometric sans-serif (e.g., Inter or Plus Jakarta Sans). Tight tracking.
- **Body**: High legibility sans-serif. Relaxed tracking.
- **Data/Monospace**: Monospaced fonts for technical or tabular data (receipts, SKUs).

### Semantic Palettes (Dark/Light)
- **Base**: Minimalist base palettes (zinc/slate).
- **Accents**: Color is reserved strictly for semantic meaning (destructive, success, active states) and brand accents.
- **Contrast**: Full support for Dark Mode with carefully tuned elevation scales using lightness rather than just opacity.

## Ergonomics & Layout

### Mobile-First & Touch Targets
All interfaces scale up from mobile. Critical touch targets (buttons, inputs, list items) are enforced at a minimum of **44x44px** to prevent fat-finger errors in fast-paced restaurant environments.

### Spatial Rhythm (8pt Grid)
Layouts adhere to a strict 8pt grid system. Generous negative space (padding/margins) is used to group related elements logically without relying heavily on borders or explicit dividers.

## Accessibility & Motion

### WCAG AA Compliance
- **Contrast**: Strict adherence to color contrast ratios (4.5:1).
- **Navigation**: Full keyboard navigability (focus rings are customized but never disabled).
- **Screen Readers**: ARIA labels are mandated for all icon-only interactive elements and complex widgets.

### Purposeful Choreography
Motion must be rapid (under 200ms) and purposeful. Used exclusively to indicate state changes (e.g., expanding a card, successful checkout) or spatial relationships (e.g., off-canvas drawers sliding in from the origin side). No gratuitous animations.
