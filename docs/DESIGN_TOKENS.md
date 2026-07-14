# Design Tokens Architecture (Enterprise)

Design tokens are the foundational units of our visual design system. To support infinite scalability and multi-tenant (whitelabel) deployments, all tokens strictly adhere to semantic naming and resolve to CSS Custom Properties (`var(--token-name)`) at runtime.

## Core Principles
- **No Hardcoded Utilities**: Using `text-blue-500` or `bg-slate-100` is strictly forbidden in product components. Use semantic mappings (e.g., `text-primary`, `bg-muted`).
- **CSS Variables for Theming**: All semantic tokens map to CSS variables (e.g., `--color-primary`) injected via a `ThemeRegistry` or `[data-theme]` attribute on the `<html>` root. This allows instantaneous, per-tenant whitelabeling without rebuilding the app.
- **Logical Properties (RTL Support)**: Spatial tokens (padding, margin, radius) must use CSS Logical Properties (`ms-`, `pe-`, `rounded-s-`) to natively support Right-to-Left (RTL) languages like Arabic without custom overrides.

## The Scaling Systems

### 1. Spatial Scale (Base 4px / Logical)
We use an 8-point base scale for macro spacing and a 4px scale for micro-adjustments.
- `space-1`: 4px (0.25rem)
- `space-2`: 8px (0.5rem)
- `space-3`: 12px (0.75rem)
- `space-4`: 16px (1rem)
- `space-6`: 24px (1.5rem)
- `space-8`: 32px (2rem)
- `space-12`: 48px (3rem)
- `space-16`: 64px (4rem)

*Implementation*: `p-4`, `m-2`, `gap-6`. Must use logical properties: `ms-4` instead of `ml-4`.

### 2. Radius Scale (Border Radius)
Defines the roundness of components to establish a modern, friendly, or sharp aesthetic.
- `radius-none`: 0px
- `radius-sm`: 4px (Checkboxes, small tags)
- `radius-md`: 8px (Buttons, inputs, cards)
- `radius-lg`: 12px (Modals, large surface areas)
- `radius-xl`: 16px (Hero images, structural containers)
- `radius-full`: 9999px (Avatars, pills)

*Implementation*: `rounded-md`, `rounded-full`. Logical properties: `rounded-s-md` instead of `rounded-l-md`.

### 3. Elevation Scale (Z-Index & Shadows)
Manages the Z-axis hierarchy. Instead of arbitrary z-indexes, we use semantic layers.
- `z-hide`: -1
- `z-base`: 0 (Default page content)
- `z-docked`: 10 (Sticky headers, bottom navigation)
- `z-dropdown`: 20 (Select menus, popovers)
- `z-sticky`: 30 (Sticky elements above docked)
- `z-banner`: 40 (Global alerts)
- `z-overlay`: 50 (Modal backdrops)
- `z-modal`: 60 (Modals, drawers)
- `z-toast`: 100 (Notifications)
- `z-tooltip`: 110 (Tooltips)

### 4. Opacity Scale
Standardized translucency levels.
- `opacity-0`: 0%
- `opacity-hover`: 8% (0.08) - Used for subtle state changes
- `opacity-disabled`: 38% (0.38) - Standard disabled state opacity
- `opacity-muted`: 60% (0.60) - De-emphasized text/icons
- `opacity-scrim`: 80% (0.80) - Modal backdrops
- `opacity-100`: 100%
