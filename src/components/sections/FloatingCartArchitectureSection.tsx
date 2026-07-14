import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowUpSquare, MousePointerClick, ShieldCheck, Zap, Maximize2, Minimize2, Accessibility, EyeOff } from "lucide-react";

export function FloatingCartArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Floating Cart Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A persistent, bottom-anchored UI element that ensures users always have context of their order and a frictionless path to checkout.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Layout & Core Elements */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-500" />
            Layout & Core Elements
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ArrowUpSquare className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Sticky Bottom</h3>
                <p className="text-xs text-muted-foreground mt-1">Anchored above the safe area inset and bottom navigation. Uses semantic `z-docked` to float above content but stay below modals.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-center h-6 w-6 rounded bg-primary text-primary-foreground font-bold text-xs shrink-0 mt-0.5">3</div>
              <div>
                <h3 className="font-semibold text-sm">Item Count & Price</h3>
                <p className="text-xs text-muted-foreground mt-1">Prominent badge showing total quantity and real-time order subtotal with optimistic UI updates.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-primary text-primary-foreground">
              <MousePointerClick className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Checkout Button</h3>
                <p className="text-xs opacity-90 mt-1">The primary call-to-action. High contrast, large hit target to drive conversion directly from the menu.</p>
              </div>
            </div>
          </div>
        </div>

        {/* States & Expansion */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Maximize2 className="h-5 w-5 text-emerald-500" />
              States & Expansion
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 opacity-60">
                <EyeOff className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Hidden (Empty)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Cart unmounts entirely when empty to maximize screen real estate for menu browsing.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Minimize2 className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Collapsed (Default)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Persistent floating bar showing summary metrics and checkout button.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 border-emerald-500/20">
                <Maximize2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Expand (Mini-Cart)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Tapping the summary expands a bottom sheet revealing line items, modifiers, and quick edit controls.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motion & Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Motion & Accessibility
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Feedback & Motion</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - **Entrance**: Slides up smoothly when the first item is added.
                  <br />- **Feedback**: Subtle scale bounce or flash when items are added to cart.
                  <br />- **Reduced Motion**: Fall back to simple fades if preferred.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Accessibility (a11y)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - **ARIA Live**: Uses `aria-live="polite"` or `role="status"` to announce price/count changes.
                  <br />- **Contrast**: Strong drop shadow (`shadow-lg`) separates it from scrolling content.
                  <br />- **Keyboard**: Fully reachable via Tab sequence.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
