# Bottom Sheet Architecture

The Bottom Sheet is a critical mobile-first overlay component. It provides contextual actions and deep-dives (like cart details or filters) without forcing a full page navigation, keeping the user anchored to their primary task.

## Use Cases Supported

- **Cart / Mini-Cart**: Expanding the floating cart to view line items, adjust quantities, or apply promo codes.
- **Filters & Sorting**: Complex search refinements (price, dietary, categories) that require vertical space.
- **Product Details & Customization**: Viewing nutritional info, allergens, and selecting modifiers for a product.
- **Language & Region Selector**: Switching locale preferences.
- **Profile & Settings**: Quick access to account actions or active orders.

## Layout & Anatomy

- **Overlay (Backdrop)**: A dimmed, semi-transparent background (`bg-black/50`) that obscures the main content and handles tap-to-dismiss.
- **Sheet Container**: Anchored to the bottom (`fixed bottom-0 left-0 right-0`). Features top rounded corners (`rounded-t-2xl` or larger) to signify its drawer-like nature.
- **Drag Handle (Pill)**: A subtle visual indicator (small horizontal pill) at the top center of the sheet, signaling that the sheet is draggable.
- **Header**: Sticky title and an optional explicit "Close" (X) button.
- **Scrollable Content Area**: The main body of the sheet. Must support internal scrolling if content exceeds the viewport height.
- **Sticky Footer (Optional)**: For primary actions (e.g., "Apply Filters", "Add to Cart") that must remain visible regardless of scroll position.

## Interactions & Gesture Support

- **Swipe down to dismiss**: Users must be able to drag the sheet downwards to close it. The velocity of the swipe should determine intent.
- **Rubber-banding**: If dragging upwards past the maximum height, it should resist smoothly.
- **Snap Points**: Support for multiple heights (e.g., 50% for quick actions, 90% for complex filters).

## Animation & Motion

- **Entrance**: Slides up from the bottom edge (`translateY(100%)` to `0`) using a spring physics model (not a linear ease) for a natural, tactile feel.
- **Backdrop Fade**: The backdrop fades in (`opacity: 0` to `1`) synchronously with the slide animation.
- **Reduced Motion**: Respect `prefers-reduced-motion` by falling back to a simple crossfade instead of the slide transition.

## Accessibility (a11y)

- **Focus Management**:
  - Focus must be trapped inside the Bottom Sheet while open.
  - Initial focus should move to the first interactive element or the close button.
  - Focus must be restored to the triggering element upon closing.
- **ARIA Roles**:
  - `role="dialog"` or `role="alertdialog"` depending on the content.
  - Must have `aria-modal="true"`.
  - `aria-labelledby` pointing to the sheet's title.
- **Keyboard Dismissal**: Must close when the `Escape` key is pressed.
- **Scroll Locking**: The `<body>` scroll must be locked (`overflow: hidden`) when the sheet is open to prevent double-scrolling issues.
