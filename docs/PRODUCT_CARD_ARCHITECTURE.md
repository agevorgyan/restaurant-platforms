# Product Card Component Architecture

The Product Card is the core entity of the Restaurant Platform. It must support high visual appetite, rapid scanning, and precise state communication across multiple layouts (list, grid, compact).

## Layout & Anatomy

- **Layout Variants**: 
  - **Grid (Vertical)**: Image on top, content below. Used for visual menus and hero items.
  - **List (Horizontal)**: Image on the leading edge (start), content filling the remaining width. Used for dense scanning.
- **Spacing**: Generous internal padding (e.g., `p-4`) decoupled from image edges. Minimal gap between title and description, larger gap before price/actions.
- **Image Ratio**: 
  - 1:1 (Square) for list views or unified grids.
  - 4:3 or 16:9 for featured/hero grid items.
  - Must use `object-cover` to prevent distortion.

## Typography & Elements

- **Typography**:
  - **Title**: Strong, semantic heading (`h3` or `h4`), utilizing line-clamp (max 2 lines) to prevent layout breakage.
  - **Description**: Subtle, muted text (`text-sm`), line-clamped (max 2 lines).
  - **Price**: Distinctive typography (e.g., medium weight, `font-mono` if applicable) for the final decision point.
- **Discount**: Display original price crossed out alongside the discounted price in a semantic accent color (e.g., red or brand primary).
- **Badges**: Dietary indicators (Vegan, Spicy) or promotions placed over the image corner or inline next to the title.
- **Favorite**: A heart icon button overlaid on the image (top trailing corner) with immediate optimistic UI updates upon interaction.
- **Add Button**: Fixed to the bottom trailing corner. If modifiers exist, it must read "Customize" or "+", not a definitive "Add".
- **Modifier Indicator**: Subtle text ("Customizable") or a wand/settings icon indicating choices are required before adding to cart.

## States & Resilience

- **Stock Status (Sold Out)**: Image receives a grayscale filter. Entire card drops opacity to 50%. Add button is replaced by a non-interactive "Sold Out" badge.
- **Animations**: 
  - **Hover**: Slight scale up of the image (105%) and card elevation (-2px Y translation, deeper shadow).
  - **Press**: Whole card scales down (98%) simulating physical touch.
- **Loading (Skeleton)**: Skeletons must exactly mimic the layout (image block, title line, price block) to prevent layout shifts.
- **Error**: Inline fallback if the image fails to load (a neutral placeholder icon/gradient).
- **Dark Mode**: Soft borders (`border-border/50`) and subtle background elevations (`bg-card`) to separate the card from the background canvas without stark contrast lines.

## Accessibility

- **Focus**: The entire card is a focusable link (to details), but the "Add" and "Favorite" buttons must be distinct, nested focus targets.
- **ARIA**: Provide descriptive `aria-label` for the whole card if necessary, or ensure semantic nesting. Prices read clearly by screen readers.
