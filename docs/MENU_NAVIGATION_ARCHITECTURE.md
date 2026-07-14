# Menu Navigation Architecture

The Menu Navigation component is the primary structural wayfinding tool for exploring restaurant menus. It seamlessly connects a horizontal category ribbon with vertically scrolling menu content.

## Layout & Positioning

- **Sticky Header**: The horizontal category ribbon must dock to the top of the viewport (`sticky top-0`) or immediately below the main app header. It must remain visible at all times as the user scrolls through the menu content.
- **Horizontal Scroll**: The category ribbon must be horizontally scrollable (`overflow-x-auto`) to accommodate many categories. It should hide the physical scrollbar (`scrollbar-width: none`) for a clean, app-like aesthetic while allowing touch scrolling.

## Interaction & Synchronization

- **Scroll Spy**: The active category must automatically update as the user scrolls down the page. This is achieved using an `IntersectionObserver` that tracks which category section is currently intersecting the top of the viewport.
- **Auto Scroll (Ribbon)**: When the active category changes (either via manual scrolling of the page or tapping), the horizontal ribbon must automatically scroll horizontally to keep the newly selected category centered or fully visible in the ribbon's viewport.
- **Auto Scroll (Content)**: Tapping a category pill in the ribbon must smoothly scroll the main window vertically to align the corresponding section header with the bottom of the sticky ribbon.

## Visual States & Animation

- **Categories**: Rendered as highly legible pills or underlined tabs.
- **Selected Category**: Must feature a distinct visual treatment (e.g., solid primary background, high contrast text) to clearly indicate the current context.
- **Animation**: 
  - Utilize an animated layout indicator (e.g., Framer Motion `layoutId`) to transition the active background pill smoothly between categories as the active state changes.
  - Smooth snapping and easing (`scroll-behavior: smooth`) when auto-scrolling the ribbon.

## Accessibility (a11y)

- **Keyboard Navigation**: The category ribbon must be fully navigable via keyboard, supporting both `Tab` and `Arrow` keys for lateral movement.
- **ARIA Roles**:
  - The horizontal ribbon container should use `role="tablist"`.
  - Individual category buttons should use `role="tab"`, with `aria-selected="true"` for the currently active item.
  - The corresponding vertical content sections should use `role="region"` or `role="tabpanel"` and use `aria-labelledby` referencing the respective tab's ID.
- **Focus Management**: Ensure clear, highly visible focus rings when navigating the ribbon via keyboard.
