# Category Navigation UX Architecture

Behavior rules for the primary menu category navigation. Designed for rapid scanning, sticky context, and effortless horizontal scrolling on touch devices.

## Core Navigation Behavior

- **Sticky Positioning**: The navigation bar must become sticky below the global header as the user scrolls down the page. It provides immediate access to other categories without scrolling back up.
- **Horizontal Scroll (No Wrap)**: Categories are laid out in a single horizontal row (`whitespace-nowrap`, `overflow-x-auto`). Hide the system scrollbar for a cleaner look while maintaining scroll functionality.

## Ergonomics & Touch

- **Touch Targets & Spacing**: Category tabs must have generous padding (min 44px height). Space between tabs should be large enough to prevent accidental taps (e.g., `gap-4`).
- **Selected State**: The active category must be highly distinct. Use high-contrast text and a persistent indicator (e.g., a solid pill background or a bold underline). Inactive items use `color-muted`.
- **Smooth Animation**: When tapping a category, the page should smoothly scroll to the corresponding section. The active indicator should animate to the new selection (e.g., using shared layout animations).

## Integration & Accessibility

- **Search Integration**: A search icon/button is often integrated at the start or end of the row. When search is active, the category nav may morph into a search input or visually de-emphasize.
- **Loading State**: Before categories load, display a row of pill-shaped skeletons that overflow horizontally to indicate scrollability.
- **Accessibility (a11y)**: Use `role="tablist"` for the container and `role="tab"` for items. Set `aria-selected="true"` on the active item. Ensure keyboard arrow navigation works for scrolling through tabs.
