import { Separator } from "@/components/ui/separator";
import { ArrowDownToLine, MoveVertical, Touchpad, Accessibility, Layers, ShoppingBag, Filter, Settings, Globe, Info, MousePointerClick, Zap } from "lucide-react";

export function BottomSheetArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bottom Sheet Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The ultimate mobile-first overlay component. Designed for deep-dives and contextual actions without forcing a full page navigation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Use Cases */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            Core Supported Use Cases
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ShoppingBag className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Cart & Checkout</h3>
                <p className="text-xs text-muted-foreground mt-1">Expanding the floating cart to view items, adjust quantities, and proceed.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Filter className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Filters & Sorting</h3>
                <p className="text-xs text-muted-foreground mt-1">Refining search results (price, dietary) with plenty of vertical space.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Info className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Product Details</h3>
                <p className="text-xs text-muted-foreground mt-1">Viewing nutritional info and selecting complex modifiers without leaving the menu.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Globe className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Language / Locale</h3>
                <p className="text-xs text-muted-foreground mt-1">Switching language or regional preferences quickly.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 sm:col-span-2">
              <Settings className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Profile & Settings</h3>
                <p className="text-xs text-muted-foreground mt-1">Quick access to account actions, active orders, or authentication flows.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gestures & Motion */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Touchpad className="h-5 w-5 text-emerald-500" />
              Gestures & Interaction
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <ArrowDownToLine className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Swipe to Dismiss</h3>
                  <p className="text-xs text-muted-foreground mt-1">Users can drag the sheet downwards to close it. Velocity determines the intent.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <MoveVertical className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Snap Points & Rubber-banding</h3>
                  <p className="text-xs text-muted-foreground mt-1">Support for multiple heights (e.g., 50% vs 90%). Smooth resistance when dragging past the max height.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Zap className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Spring Animation</h3>
                  <p className="text-xs text-muted-foreground mt-1">Entrance uses a spring physics model for a tactile, native feel. Respects `prefers-reduced-motion` with fade fallbacks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility & Focus */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-purple-500" />
            Accessibility & Anatomy
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <MousePointerClick className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Focus Management</h3>
                <p className="text-xs text-muted-foreground mt-1">Focus is trapped inside while open. Restored to trigger button upon close.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">ARIA & Keyboard</h3>
                <p className="text-xs text-muted-foreground mt-1">Uses `role="dialog"` and `aria-modal="true"`. Must close on `Escape` key press.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Layers className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Scroll Locking</h3>
                <p className="text-xs text-muted-foreground mt-1">Locks body scroll to prevent double-scrolling. Internal scroll area handles overflow.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
