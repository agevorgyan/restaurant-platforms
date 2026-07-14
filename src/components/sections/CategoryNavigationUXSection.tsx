import { Separator } from "@/components/ui/separator";
import { Navigation, Anchor, MoveHorizontal, Pointer, Search, Zap, CheckCircle2, SquareDashed, Accessibility } from "lucide-react";

export function CategoryNavigationUXSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Category Navigation UX</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Behavior rules for the primary menu category navigation. Designed for rapid scanning, sticky context, and effortless horizontal scrolling on touch devices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Behavior */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Navigation className="h-5 w-5" />
            Core Navigation Behavior
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            The category navigation acts as the anchor for the entire menu experience. It must provide persistent context as the user scrolls through the product list.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Anchor className="h-6 w-6 text-indigo-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Sticky Positioning</h3>
                <p className="text-xs text-muted-foreground mt-1">The navigation bar must become sticky below the global header as the user scrolls down the page. It provides immediate access to other categories without scrolling back up.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <MoveHorizontal className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Horizontal Scroll (No Wrap)</h3>
                <p className="text-xs text-muted-foreground mt-1">Categories are laid out in a single horizontal row (`whitespace-nowrap`, `overflow-x-auto`). Hide the system scrollbar for a cleaner look while maintaining scroll functionality.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction & Ergonomics */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Pointer className="h-5 w-5 text-blue-500" />
            Ergonomics & Touch
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Pointer className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Touch Targets & Spacing</h3>
                <p className="text-xs text-muted-foreground mt-1">Category tabs must have generous padding (min 44px height). Space between tabs should be large enough to prevent accidental taps (e.g., `gap-4`).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Selected State</h3>
                <p className="text-xs text-muted-foreground mt-1">The active category must be highly distinct. Use high-contrast text and a persistent indicator (e.g., a solid pill background or a bold underline). Inactive items use `color-muted`.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Smooth Animation</h3>
                <p className="text-xs text-muted-foreground mt-1">When tapping a category, the page should smoothly scroll to the corresponding section. The active indicator should animate to the new selection (e.g., using framer-motion `layoutId`).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Feedback */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-500" />
            Integration & Accessibility
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Search className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Search Integration</h3>
                <p className="text-xs text-muted-foreground mt-1">A search icon/button is often integrated at the start or end of the row. When search is active, the category nav may morph into a search input or visually de-emphasize.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <SquareDashed className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Loading State</h3>
                <p className="text-xs text-muted-foreground mt-1">Before categories load, display a row of pill-shaped skeletons that overflow horizontally to indicate scrollability.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Accessibility (a11y)</h3>
                <p className="text-xs text-muted-foreground mt-1">Use `role="tablist"` for the container and `role="tab"` for items. Set `aria-selected="true"` on the active item. Ensure keyboard arrow navigation works for scrolling.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
