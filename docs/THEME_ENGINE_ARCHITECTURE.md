# Theme Engine Architecture

The Theme Engine provides a scalable, CSS Custom Property (variable) driven approach to whitelabeling the Restaurant Platform. It allows individual restaurants to customize their brand identity without requiring code changes.

## Core Customization Pillars

- **Primary Color**: The primary brand accent used for main CTAs, active states, and emphasis. Handled via CSS variables (e.g., `--primary`) to automatically generate hover and active shades.
- **Border Radius**: Global curvature settings (e.g., `none`, `sm`, `md`, `lg`, `full`). Affects buttons, cards, dialogs, and inputs uniformly.
- **Typography (Font)**: Selection of brand-aligned fonts for headings and body text. Loaded dynamically and applied via CSS variables (`--font-sans`, `--font-heading`).
- **Logo & Assets**: Dynamic injection of the restaurant's logo into the header, receipts, and splash screens.
- **Icon Set**: Pluggable icon styles (e.g., solid, outline, duotone) to match the brand's mood.

## Component & Structural Theming

- **Card Style**: Configuration for product and summary cards.
  - *Styles*: Flat (borders), Elevated (shadows), or Neumorphic.
  - *Spacing*: Compact vs. Relaxed padding.
- **Button Style**: Global button appearances.
  - *Styles*: Solid, Outline, Soft, or Ghost.
  - *Shape*: Inherited from the global Radius setting.
- **Spacing**: Global density scale (compact vs. relaxed) controlling layout gaps, margins, and paddings.

## Dark Mode & Color Systems

- **Dark Mode Support**: Every theme configuration must provide a functional dark mode palette. 
  - Uses semantic tokens (`--bg-background`, `--text-foreground`, `--card`, `--border`).
  - Colors are inverted or adjusted automatically using HSL scales when the `.dark` class is applied.
- **Color Generation**: The engine automatically computes accessible contrast colors (e.g., `--primary-foreground`) based on the selected primary color.

## Implementation Details

- **CSS Variables**: The engine injects `<style>` blocks into the document `<head>` containing dynamically generated CSS variables based on the restaurant's config payload.
- **Tailwind Integration**: Tailwind is configured to consume these CSS variables, allowing developers to use standard utility classes (e.g., `bg-primary`, `rounded-container`) that automatically adapt to the current theme.
