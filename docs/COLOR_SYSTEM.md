# Color System Architecture

A highly semantic, accessibility-first color language built for both Light and Dark themes. Values are defined by intent, never by hardcoded hex codes.

## Core Principles
Colors are entirely semantic. A button is never "blue"; it uses the `Primary` token. This ensures effortless theming, perfect dark mode inversion, and guaranteed WCAG AA/AAA compliance.

### Light Theme (Default)
High lightness backgrounds with deep, high-contrast text. Surfaces utilize subtle drop shadows to convey elevation.

### Dark Theme
Deep backgrounds. Elevation is conveyed through surface lightness (lighter borders and backgrounds) rather than shadows.

## Brand & Interactive

- **Primary** (`color-primary`, `color-primary-foreground`): The primary brand color. Used for the most important actions, active states, and primary navigation elements.
- **Secondary** (`color-secondary`, `color-secondary-foreground`): Used for secondary actions, less prominent active states, and alternative interactive elements.
- **Accent** (`color-accent`, `color-accent-foreground`): A highly contrasting color used sparingly to draw attention to new features, highlights, or special promotions.

## Feedback & Status

- **Success** (`color-success`, `color-success-foreground`): Indicates successful operations, completed orders, and active states.
- **Warning** (`color-warning`, `color-warning-foreground`): Cautions the user. Low stock alerts, impending timeouts, or missing non-critical data.
- **Danger / Destructive** (`color-danger`, `color-danger-foreground`): Critical errors, destructive actions (delete, cancel order), and severe system failures.
- **Info** (`color-info`, `color-info-foreground`): Neutral informational messages, updates, and helpful tips.

## Layout & Structure

- **Background** (`color-background`): The deepest base layer of the application.
- **Surface** (`color-surface`): Elevated containers that sit on top of the background, such as sidebars or floating panels.
- **Card** (`color-card`): Used for distinct content blocks, menu items, and dashboard widgets.
- **Border** (`color-border`): Subtle lines used to separate content. Must maintain a low contrast ratio against the background.

## Typography & Neutrals

- **Text / Foreground** (`color-text`): Primary reading text. Must maintain WCAG AA contrast (4.5:1).
- **Muted** (`color-muted`, `color-muted-foreground`): Secondary text, placeholders, and disabled states.
- **Neutral Scale** (`color-neutral-100` to `color-neutral-900`): A core grayscale palette. Used as the foundation but rarely applied directly (mapped through semantic tokens instead).
