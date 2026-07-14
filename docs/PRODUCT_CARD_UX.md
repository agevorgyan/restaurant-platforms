# Product Card UX Architecture

UX rules for the primary item entity (the product/menu item card). Designed for extreme visual appetite, rapid scanning, and precise state communication.

## Core Philosophy: The Compound Component
To ensure infinite scalability and prevent "prop drilling" (where a card accepts dozens of boolean flags like `isSoldOut`, `showDiscount`), the Product Card must be implemented using the **Compound Component Pattern** (Slots). 
- **Consumer flexibility**: `<ProductCard><ProductCard.Image /><ProductCard.Price /></ProductCard>` allows any layout configuration per restaurant without modifying the underlying component code.

## Layout Anatomy (Mobile-First)
- **Aspect Ratio**: 1:1 (Square) or 4:3 for primary images. Horizontal list cards use a 1:1 thumbnail on the leading edge (start).
- **Whitespace**: Generous padding inside the card. Never cramp text against the edges or the image.
- **Hierarchy**:
  1. Image (Appetite appeal)
  2. Title (Clarity)
  3. Price (Decision)
  4. Badges (Urgency/Context)
  5. Add to Cart (Action)

## State Management

- **Sold Out**: The entire card opacity drops to 50%. The image receives a grayscale filter. A prominent "Sold Out" overlay or badge replaces the price/add-to-cart button.
- **Customizable**: If an item requires choices (e.g., "Choose your side"), the action button must say "Customize" or "+", never instantly add to cart, to prevent silent failures or assumptions.
- **Loading (Skeleton)**: Must perfectly match the dimensions of the final loaded card to prevent layout shifting. Use a subtle pulse animation respecting `prefers-reduced-motion`.

## Interactive Feedback

- **Hit Target**: The entire card should be a tappable area navigating to the detail view. The "Add to Cart" button must be an isolated, elevated hit target within the card.
- **Hover (Desktop)**: Slight elevation increase (shadow gets deeper) and a -2px Y-axis translation. The image can have a subtle 105% scale effect on hover.
- **Active (Press)**: Scale down slightly (98%) to simulate physical compression.

## Badges & Overlays
- **Dietary Indicators**: Small, universally recognized icons (e.g., leaf for vegan, flame for spicy) positioned near the title.
- **Limited Availability**: If stock is low, use an amber semantic warning badge (e.g., "Only 2 left") to create genuine urgency without alarm.
