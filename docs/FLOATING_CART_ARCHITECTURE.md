# Floating Cart Architecture

The Floating Cart is a persistent, sticky bottom-anchored UI element that ensures users always have context of their order and a quick path to checkout without breaking their browsing flow.

## Layout & Positioning

- **Sticky Bottom**: Anchored to the bottom of the viewport (`fixed bottom-4` or `sticky`). On mobile, it sits safely above the home indicator (safe area inset) and any bottom navigation bars.
- **Z-Index**: Uses a high-elevation semantic token (e.g., `z-docked`) to ensure it always floats above scrolling page content but stays below modals (`z-modal`).

## Core Elements

- **Item Count**: A prominent badge or indicator showing the total quantity of items.
- **Price**: Real-time order subtotal. Must update instantly (optimistic UI) when items are added.
- **Checkout Button**: The primary call-to-action. Uses the brand's primary action color to drive conversion.

## States & Interactions

- **Hidden (Empty)**: The floating cart does not render when the cart is empty to maximize screen real estate for menu browsing.
- **Collapsed**: The default persistent state showing just the summary (Count, Total, Checkout).
- **Expand (Mini-Cart)**: Tapping the summary area (excluding the checkout button) expands a bottom sheet/drawer revealing the line items, modifiers, and quick quantity controls.
- **Collapse**: Swiping down or tapping a close button returns the drawer to the collapsed floating state.

## Motion & Animation

- **Entrance/Exit**: Slides up smoothly from the bottom when the first item is added. Slides down and exits when the cart is emptied.
- **Attention (Add to Cart)**: When a new item is added, the cart should provide subtle feedback (e.g., a slight scale bounce or number ticker animation) to confirm the action.
- **Expand Drawer**: Uses a fluid spring animation to expand the drawer upwards from the anchor point.
- **Reduced Motion**: Wrap structural animations in `prefers-reduced-motion` guards. Fall back to instantaneous state changes or simple opacity fades for vestibular safety.

## Accessibility (a11y)

- **Screen Readers**: The cart region must use `aria-live="polite"` or `role="status"` to announce changes to the item count and total without stealing focus.
- **Keyboard Navigation**: The floating bar and its inner buttons must be reachable via the `Tab` sequence.
- **Visual Contrast**: Requires a strong drop shadow (`shadow-lg`) or distinct background color to maintain contrast against any scrolling content underneath.
