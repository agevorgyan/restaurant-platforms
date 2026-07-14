import { Separator } from "@/components/ui/separator";
import { Navigation, ShoppingBag, Home, LayoutGrid, Search, User, Layers, Hand, Zap, Accessibility, ShieldCheck } from "lucide-react";

export function BottomNavigationUXSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bottom Navigation UX</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          UX rules for the primary mobile navigation layer, including the Floating Cart and primary destination tabs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Philosophy */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Layers className="h-5 w-5" />
            Mobile-First & Sticky Positioning
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            The bottom navigation is the control center for mobile users. It must be omnipresent (sticky), easily reachable by the thumb, and visually separate from the scrolling content.
          </p>
          <div className="flex gap-4 p-4 rounded-lg border bg-card">
            <Hand className="h-6 w-6 text-indigo-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">Gesture & Reach Ergonomics</h3>
              <p className="text-xs text-muted-foreground mt-1">Placed at the bottom edge of the screen to accommodate "thumb zones". Critical actions (like the Cart) are centered or placed on the dominant side to ensure instantaneous reachability without adjusting grip.</p>
            </div>
          </div>
        </div>

        {/* Navigation Destinations */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-500" />
            Primary Destinations
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Home className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Home</h3>
                <p className="text-xs text-muted-foreground mt-1">Returns to the primary dashboard or storefront. Tapping while already active scrolls to top.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <LayoutGrid className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Categories</h3>
                <p className="text-xs text-muted-foreground mt-1">Opens the full menu index or category modal for rapid jump navigation.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Search className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Search</h3>
                <p className="text-xs text-muted-foreground mt-1">Focuses the search bar or opens a full-screen search overlay with recent queries and popular items.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <User className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Profile / Account</h3>
                <p className="text-xs text-muted-foreground mt-1">Access to order history, payment methods, rewards, and account settings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cart & Feedback */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-500" />
            Floating Cart
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
              <ShoppingBag className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Prominent Cart Action</h3>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Often elevated above the standard tab bar as a Floating Action Button (FAB), or integrated as a highly distinct primary tab. It must stand out from navigation links.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ShieldCheck className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Item Count Badge</h3>
                <p className="text-xs text-muted-foreground mt-1">Displays the total number of items in the cart. Hidden when cart is empty. Uses a high-contrast accent color (e.g., Red or Brand Primary).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Cart Summary (Optional)</h3>
                <p className="text-xs text-muted-foreground mt-1">Instead of just a button, it can be a floating pill showing "View Cart • $42.50". Highly effective for food delivery interfaces.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Animation & Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-pink-500" />
            Animation & Accessibility
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Animation Rules</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - <strong>Add to Cart:</strong> Badge must "pop" or scale up briefly when an item is added.
                  <br />- <strong>Scroll Behavior:</strong> Nav may translate down (hide) on scroll down, and translate up (show) on scroll up to maximize reading space.
                  <br />- <strong>Active State:</strong> Icons should use filled variants when active, outlined when inactive.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Accessibility (a11y)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - <strong>Labels:</strong> Icons MUST be paired with `aria-label`s if text labels are hidden.
                  <br />- <strong>Focus:</strong> Ensure the nav is reachable via keyboard (`Tab` indexing).
                  <br />- <strong>Contrast:</strong> The background must have sufficient shadow/border to separate it from page content.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
