import { Separator } from "@/components/ui/separator";
import { ShoppingCart, MapPin, Truck, Store, CreditCard, CheckCircle2, Clock, Loader2, AlertTriangle, RefreshCcw, LayoutTemplate, ShieldCheck, Zap } from "lucide-react";

export function CheckoutFlowUXSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout Flow UX Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          UX rules for a high-converting, friction-free checkout experience. Designed to handle edge cases gracefully while maintaining user trust.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Philosophy */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Zap className="h-5 w-5" />
            Core Philosophy: Frictionless Conversion
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            The checkout flow is the most critical conversion funnel. It must be linear, completely isolated from main navigation to prevent abandonment, and heavily optimized for speed and trust.
          </p>
          <div className="flex gap-4 p-4 rounded-lg border bg-card">
            <LayoutTemplate className="h-6 w-6 text-indigo-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">Isolated Checkout (Enclosed Funnel)</h3>
              <p className="text-xs text-muted-foreground mt-1">Once the user enters the checkout flow, remove standard navigation headers and footers. Provide only a secure "Back" button to return to the cart. This minimizes distractions and prevents accidental abandonment.</p>
            </div>
          </div>
        </div>

        {/* Cart & Fulfillment */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            Cart & Fulfillment Selection
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ShoppingCart className="h-6 w-6 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Cart Review</h3>
                <p className="text-xs text-muted-foreground mt-1">Provide clear item summaries, ability to adjust quantities, and prominent cross-sells (e.g., "Add a drink"). The subtotal and checkout button should stick to the bottom of the viewport.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div className="flex flex-col gap-2 shrink-0 mt-0.5">
                <Truck className="h-5 w-5 text-emerald-500" />
                <Store className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Delivery vs. Pickup</h3>
                <p className="text-xs text-muted-foreground mt-1">A highly prominent segmented control or large radio buttons to select fulfillment method. Switching methods must clearly update estimated times and associated fees (delivery fee, driver tip).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <MapPin className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Address Validation</h3>
                <p className="text-xs text-muted-foreground mt-1">Autofill addresses via Google Maps Places API. Validate if the address falls within the restaurant's delivery radius immediately, before the user proceeds to payment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Confirmation */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-500" />
            Payment & Post-Checkout
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CreditCard className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Payment Methods</h3>
                <p className="text-xs text-muted-foreground mt-1">Support modern digital wallets (Apple Pay, Google Pay) prominently at the top to bypass manual entry. For cards, use automatic formatting (spaces, CVC masking) and display card brand logos dynamically.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Success State</h3>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Instantaneous confirmation screen. Avoid redirects to empty pages. Display a celebratory animation, the order number, and a clear call to action to "Track Order".</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Clock className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Order Tracking</h3>
                <p className="text-xs text-muted-foreground mt-1">Provide real-time state updates (Received, Preparing, Out for Delivery, Delivered). Use a visual progress bar and estimated time of arrival (ETA) that updates dynamically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edge Cases: Loading, Errors & Retry */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-500" />
            Resilience & Error Handling
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <h3 className="font-semibold text-sm">Idempotent Loading</h3>
              <p className="text-xs text-muted-foreground mt-1">When the user taps "Pay", disable the button immediately and show an inline spinner. The backend must use idempotency keys to prevent duplicate charges if the user taps multiple times.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
              <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400">Graceful Errors</h3>
              <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Never show raw API errors. Map failures to human-readable text (e.g., "Your card was declined by the bank" instead of "Error 402: Insufficient Funds"). Keep the user on the checkout page.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <RefreshCcw className="h-6 w-6 text-blue-500" />
              <h3 className="font-semibold text-sm">Retry Mechanisms</h3>
              <p className="text-xs text-muted-foreground mt-1">If a network timeout occurs, auto-retry the request safely in the background. If it fails completely, offer a clear "Try Again" button that preserves all previously entered form data.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
