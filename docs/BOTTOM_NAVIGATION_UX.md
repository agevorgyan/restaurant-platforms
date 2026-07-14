# Bottom Navigation UX Architecture

UX rules for the primary mobile navigation layer, including the Floating Cart and primary destination tabs. Designed for one-handed use and rapid context switching.

## Core Philosophy
- **Mobile-First & Sticky**: The bottom navigation is the control center for mobile users. It must be omnipresent (fixed to the bottom), easily reachable by the thumb, and visually separate from scrolling content via shadows or borders.
- **Gesture & Reach Ergonomics**: Positioned in the natural "thumb zone." Critical actions like the Cart are centered or placed on the dominant side to ensure instantaneous reachability without adjusting grip.

## Navigation Destinations
- **Home**: Returns to the primary dashboard or storefront. Tapping while already active scrolls to the top.
- **Categories**: Opens the full menu index or category modal for rapid jump navigation.
- **Search**: Focuses the search bar or opens a full-screen search overlay with recent queries and popular items.
- **Profile / Account**: Access to order history, payment methods, rewards, and account settings.

## Floating Cart
- **Prominent Action**: Often elevated above the standard tab bar as a Floating Action Button (FAB), or integrated as a highly distinct primary tab. It must stand out from standard navigation links.
- **Item Count Badge**: Displays the total number of items in the cart. Hidden when empty. Uses a high-contrast accent color.
- **Cart Summary (Pill)**: An alternative pattern is a floating pill above the nav bar showing "View Cart • $42.50", highly effective for food delivery to constantly reinforce the cart total.

## Animation Rules
- **Add to Cart Feedback**: The cart icon or badge must "pop" (scale up and down briefly) when an item is added to provide physical reassurance.
- **Scroll Behavior (Optional)**: The bar may translate down (hide) on scroll down to maximize screen real estate, and translate up (show) instantly on scroll up.
- **Active State Transition**: Icons should use filled variants when active, outlined when inactive. Transitions between states should be crossfaded (e.g., 150ms).

## Accessibility (a11y)
- **Aria Labels**: Icons MUST be paired with descriptive `aria-label`s if text labels are hidden.
- **Keyboard Focus**: Ensure the nav is reachable via keyboard (`Tab` indexing) and operates as a proper tab list or navigation landmark.
- **Contrast Margin**: The background must have a sufficient drop shadow or top border to separate it from the page content beneath it.
