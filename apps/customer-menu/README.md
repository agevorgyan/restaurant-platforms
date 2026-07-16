# Customer Menu Application

A premium, interactive digital restaurant menu client application designed for tableside browsing and ordering in upscale dining establishments.

## Tech Stack & Standards

- **Core**: Next.js 14.2.5 (App Router), React 18.3
- **Styling**: Tailwind CSS, PostCSS (Autoprefixer)
- **Language**: TypeScript (strict mode checks)
- **Quality**: ESLint (custom Next rules)
- **Architecture**: Domain-Driven Design, Feature-Modular configuration
- **Aesthetics**: Sleek dark mode first, custom glassmorphism, responsive category scrollbar, CSS-based micro-animations.

## Folder Structure

```
apps/customer-menu/
├── app/                  # Next.js App Router root layout, pages, errors, and static assets
│   ├── error.tsx         # Premium error boundary catcher
│   ├── globals.css       # Global styles and custom keyframes / transitions
│   ├── layout.tsx        # Base document layout
│   ├── not-found.tsx     # Custom 404 handler page
│   └── page.tsx          # Main interactive homepage view (filtered categories, search, modal and drawer containers)
├── components/           # Modularized UI component layer
│   ├── cart-drawer.tsx   # Checkout summary calculations, quantity updating, and order submission
│   └── dish-modal.tsx    # Ingredient details, customizable add-ons, and allergen warnings
├── config/               # Decoupled mock database configurations
│   └── menu.ts           # Gastronomy dishes data array and restaurant metadata configuration
├── hooks/                # Custom React hook utilities
│   └── use-analytics.ts  # Standard custom telemetry event logger (no-console logging rule compliance)
├── types/                # Strict TypeScript declaration types
│   └── menu.ts           # Models for MenuItems, Categories, CartItems, and configs
├── README.md             # This document
├── package.json          # Node scripts and dependencies
├── tsconfig.json         # TypeScript rules
└── next.config.mjs       # Next.js settings
```

## Running the Application

### 1. Installation
Run the workspace pnpm installer from the root repository directory:
```bash
pnpm install
```

### 2. Run Development Servers
Start the dev servers for all apps in the monorepo:
```bash
pnpm dev
```
The **Customer Menu** app will start at [http://localhost:3001](http://localhost:3001).
Pass a query parameter to test table assignments, e.g. [http://localhost:3001?table=104](http://localhost:3001?table=104).

### 3. Build for Production
To bundle and optimize the application for production:
```bash
pnpm build
```

## Features

- **Decoupled Data Configs**: All products and details are sourced from config files, allowing immediate API binding later.
- **Search & Filters**: Instantly filters menu items by title, description, or allergens, with dietary selection badges.
- **Interactive Modals**: Customizable choices (size, doneness, add-ons) with automatic total price adjustments.
- **Mock Cart Checkout**: Dynamic service charge and state sales tax calculations. Places order at table with animations.
- **Custom Telemetry**: All core actions (views, carts, orders) generate `CustomEvent` entries tracked in `sessionStorage` for inspection.
