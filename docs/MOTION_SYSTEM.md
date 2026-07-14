# Motion System Architecture

A purposeful, rapid, and spatial motion language designed to guide attention and provide immediate physical feedback without slowing down the user.

## Animation Philosophy
Motion must serve a functional purpose: providing feedback, explaining spatial relationships, or masking load times. It must never feel gratuitous or act as a barrier to interaction.

- **Rapid Execution**: Animations should rarely exceed 300ms. Micro-interactions must complete in 150ms or less to feel instantaneous.
- **Physicality**: Elements should mimic physical weight. Use spring physics for interactive components rather than linear easings.
- **Spatial Logic**: Motion should explain where elements come from and where they go.

## Micro-Interactions

- **Button Press**: Immediate scale-down (e.g., 96%) upon press to simulate a physical push. Restores scale on release with a slight spring.
- **Card Hover**: Subtle elevation increase (shadow gets larger) and a very slight translation upwards (-2px).
- **Cart Animation**: When adding an item, the cart icon should "pop" (briefly scale up to 120% then back to 100% with a spring) to confirm the action without blocking the UI.

## Macro Layout & Overlay

- **Page Transition**: Subtle crossfade combined with a very short upward translation. Avoid full-page slides which can induce motion sickness.
- **Bottom Sheet / Drawer**: Slides in from the bottom edge using a damping spring. Must support touch-drag gestures to dismiss.
- **Modal**: Fades in while scaling up slightly from 95% to 100%. The backdrop fades in concurrently. Creates a feeling of depth and focus.

## Loading & Perception

- **Skeleton Loaders**: Use a smooth, low-contrast pulse or shimmering wave effect. Skeletons must exactly match the structural footprint of the loaded content to prevent layout shifts.
- **Inline Loading**: For buttons and localized actions, replace the icon or text with a smooth, continuous rotation spinner. Do not block the entire screen for localized actions.
