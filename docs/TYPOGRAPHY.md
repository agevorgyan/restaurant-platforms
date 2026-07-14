# Typography System Architecture

Semantic text styles and scales designed for extreme legibility in fast-paced restaurant environments.

## Naming Conventions
Typography tokens use semantic naming based on intent rather than just size.
Format: `text-[role]-[variant]` (e.g., `text-body-base`, `text-price-lg`).

## Typography Scale (Base 16px)
- `xs`: 12px (0.75rem)
- `sm`: 14px (0.875rem)
- `base`: 16px (1rem)
- `lg`: 18px (1.125rem)
- `xl`: 20px (1.25rem)
- `2xl`: 24px (1.5rem)
- `3xl`: 30px (1.875rem)
- `4xl`: 36px (2.25rem)
- `5xl`: 48px (3rem)

## Structural & Content

- **Heading**: `text-heading-1` (4xl/36px) · Bold · Tight tracking
  Used for page titles, major sections, and marketing headers.
- **Title**: `text-title` (2xl/24px) · Semibold · Tight tracking
  Used for card titles, modal headers, and primary content blocks.
- **Subtitle**: `text-subtitle` (lg/18px) · Medium · Normal tracking
  Supports headings and titles.
- **Body**: `text-body` (base/16px) · Regular · Relaxed line-height
  Primary reading text for paragraphs and descriptions.
- **Caption**: `text-caption` (sm/14px) · Regular · Normal line-height
  Secondary text, timestamps, table data, and helper text below inputs.

## Domain & UI Elements

- **Product Name**: `text-product-name` (lg/18px) · Semibold
  Used in menus, order summaries, and POS grid items.
- **Category Name**: `text-category` (sm/14px) · Medium · Uppercase · Wide tracking
  Used for section headers in menus (e.g., "APPETIZERS").
- **Price**: `text-price` (lg/18px) · Monospace/Tabular Nums · Medium
  Prices must always use tabular numerals to align vertically in receipts and carts.
- **Button Text**: `text-button` (sm/14px) · Medium
  Used inside interactive buttons.
- **Labels**: `text-label` (xs/12px) · Medium · Uppercase
  Used for form input labels, badges, and tiny UI indicators.

## Feedback & Validation

- **Error Text**: `text-error` (sm/14px) · Medium
  Form validation errors and failed payment notices. Pair with an icon.
- **Success Text**: `text-success` (sm/14px) · Medium
  Order confirmations and successful saves. Pair with an icon.
