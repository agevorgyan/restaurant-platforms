import { Separator } from "@/components/ui/separator";
import { Navigation, Anchor, MoveRight, MoveDown, MousePointerClick, Activity, Accessibility, LayoutTemplate } from "lucide-react";

export function MenuNavigationArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Navigation Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The primary structural wayfinding tool for restaurant menus. Connects a horizontal sticky ribbon with vertically scrolling content via Intersection Observers.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Layout & Positioning */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-indigo-500" />
            Layout & Positioning
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Anchor className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Sticky Header</h3>
                <p className="text-xs text-muted-foreground mt-1">Docks to the top of the viewport (`sticky top-0`). Remains persistently visible as the user scrolls through the dense menu content.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <MoveRight className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Horizontal Scroll</h3>
                <p className="text-xs text-muted-foreground mt-1">Scrollable ribbon (`overflow-x-auto`) to accommodate many categories. Hides physical scrollbars (`scrollbar-width: none`) for a clean look.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction & Sync */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              Interaction & Sync
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 border-emerald-500/20">
                <Navigation className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Scroll Spy</h3>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Active category updates automatically using an `IntersectionObserver` as the user scrolls down the page.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <MoveRight className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Auto Scroll (Ribbon)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Ribbon automatically scrolls horizontally to keep the newly selected category centered in the viewport.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <MoveDown className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Auto Scroll (Content)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Tapping a category smoothly scrolls the main window vertically to align the section header below the sticky ribbon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animation & Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-rose-500" />
            Animation & Accessibility
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Activity className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Layout Animation</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - Uses Framer Motion `layoutId` to slide the active pill background between categories.
                  <br />- Distinct visual treatment for the selected state.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Strict ARIA Patterns</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - `role="tablist"` for the ribbon.
                  <br />- `role="tab"` and `aria-selected` for items.
                  <br />- Keyboard navigable via `Arrow` keys.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
