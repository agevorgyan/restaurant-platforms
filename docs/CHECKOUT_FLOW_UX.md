# Checkout Flow UX Architecture

UX rules for a high-converting, friction-free checkout experience. Designed to handle edge cases gracefully while maintaining user trust.

## Core Philosophy: Frictionless Conversion
The checkout flow is the most critical conversion funnel. It must be linear, completely isolated from main navigation to prevent abandonment, and heavily optimized for speed and trust.

- **Isolated Checkout (Enclosed Funnel)**: Once the user enters the checkout flow, remove standard navigation headers and footers. Provide only a secure "Back" button to return to the cart. This minimizes distractions.

## Cart & Fulfillment Selection

- **Cart Review**: Provide clear item summaries, ability to adjust quantities, and prominent cross-sells. The subtotal and checkout button should stick to the bottom of the viewport on mobile.
- **Delivery vs. Pickup**: A highly prominent segmented control to select fulfillment method. Switching methods must clearly update estimated times and associated fees (delivery fee, driver tip).
- **Address Validation**: Autofill addresses via Google Maps Places API. Validate if the address falls within the restaurant's delivery radius immediately, before the user proceeds to payment.

## Payment & Post-Checkout

- **Payment Methods**: Support modern digital wallets (Apple Pay, Google Pay) prominently at the top to bypass manual entry. For cards, use automatic formatting (spaces, CVC masking) and display card brand logos dynamically.
- **Success State**: Instantaneous confirmation screen. Avoid redirects to empty pages. Display a celebratory animation, the order number, and a clear call to action to "Track Order".
- **Order Tracking**: Provide real-time state updates (Received, Preparing, Out for Delivery, Delivered). Use a visual progress bar and ETA that updates dynamically.

## Resilience & Error Handling

- **Idempotent Loading**: When the user taps "Pay", disable the button immediately and show an inline spinner. The backend must use idempotency keys to prevent duplicate charges.
- **Graceful Errors**: Never show raw API errors. Map failures to human-readable text (e.g., "Your card was declined by the bank"). Keep the user on the checkout page so they can correct the issue.
- **Retry Mechanisms**: If a network timeout occurs, offer a clear "Try Again" button that preserves all previously entered form data so the user doesn't have to start over.
