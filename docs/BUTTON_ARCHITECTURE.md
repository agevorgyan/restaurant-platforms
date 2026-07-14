# Button Component Architecture

The Button is the primary interactive primitive of the UI Kit. It must be highly versatile, rigorously typed, and accessible.

## Variants (CVA)

- **Primary**: The main call to action. High contrast background (e.g., brand color) with contrasting text.
- **Secondary**: Alternative actions. Subtle background (e.g., muted or secondary color) with strong text.
- **Ghost**: Lowest emphasis. Transparent background, changes on hover. Useful for tertiary actions.
- **Outline**: Medium emphasis. Transparent background with a solid border matching the text color.
- **Danger**: Destructive actions (e.g., Delete, Remove). Uses semantic error colors (red).
- **Success**: Positive confirmation actions (e.g., Save, Complete). Uses semantic success colors (green).

## States & Modifiers

- **Loading**: Replaces the leading icon (or adds a spinner) and disables interaction while maintaining the button's exact dimensions.
- **Disabled**: Reduces opacity to `0.5`, sets `pointer-events: none`, and adds `aria-disabled="true"`.
- **Full Width**: Expands to fill 100% of the parent container's width. Essential for mobile layouts.

## Anatomy & Icons

- **Icon Left (Leading)**: Icon precedes the text label. Standard for directional or descriptive actions.
- **Icon Right (Trailing)**: Icon follows the text label. Standard for forward movement (e.g., "Next ->").
- **Icon-Only**: No text label. Requires a visually hidden `aria-label` for screen readers.

## Shapes & Sizes

- **Standard (Rounded)**: Default border-radius (e.g., `md` or `lg`).
- **Square**: Sharp corners (`radius-none`).
- **Round (Pill)**: Fully rounded edges (`radius-full`). Often used for tags or floating action buttons.
- **Sizes**: `sm`, `md` (default), `lg`, `icon` (perfectly square for icon-only).

## Accessibility (a11y)

- **Keyboard Navigation**: Must receive focus via `Tab`. Triggerable via `Enter` and `Space`.
- **Focus Visible**: Must implement highly distinct `:focus-visible` styles (e.g., an offset ring) that stand out against both light and dark backgrounds.
- **ARIA Attributes**:
  - `aria-disabled` when visually disabled but still focusable (or native `disabled`).
  - `aria-busy` and `aria-live="polite"` when in the loading state.
  - `aria-label` must be enforced for icon-only buttons.
