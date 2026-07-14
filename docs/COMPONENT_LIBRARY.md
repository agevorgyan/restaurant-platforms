# Component Library Architecture (packages/ui)

The enterprise component library is structured as an independent package (`packages/ui`) to enforce strict modularity, reusability, and separation of concerns. This structure supports sharing the design system across multiple applications (e.g., consumer app, kitchen display system, admin dashboard).

## Directory Structure Overview

### `/components`
Core, primitive interactive elements built on top of Radix UI or pure React. These are domain-agnostic.
- Buttons, Badges, Avatars, Inputs, Modals, Tooltips, etc.

### `/layout`
Structural components responsible for macro-layout and spacing without containing business logic.
- Container, Stack, Grid, Spacer, Divider.

### `/navigation`
Wayfinding components that govern movement across the application.
- Header, Footer, Sidebar, Navbar, Bottom Navbar, Breadcrumbs.

### `/restaurant`
Domain-specific (SaaS) composite components. These compose primitive components to solve specific restaurant industry use cases.
- Product Card, Category Card, Menu Card, Order Card, Cart, Floating Cart, Quantity Picker, Modifier Group, Allergens, etc.

### `/feedback`
Components communicating system state to the user.
- Skeletons, Spinners, Empty States, Error States.

### `/theme`
Theme registry, CSS variable injection, and whitelabel configuration logic.

### `/motion`
Shared Framer Motion variants, layout animations, and transition wrappers respecting `prefers-reduced-motion`.

### `/hooks`, `/icons`, `/utils`
Shared logic, SVG icon wrappers (Lucide), and class name mergers (`cn`, `clsx`, `tailwind-merge`).
