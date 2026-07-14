import { Separator } from "@/components/ui/separator";
import { Search, Clock, TrendingUp, Mic, Loader2, Ghost, Accessibility, Keyboard, Type } from "lucide-react";

export function SearchArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A highly responsive, predictive, and accessible discovery mechanism designed for rapid item finding.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Input & Voice */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-500" />
            Input & Controls
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Type className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Search Input</h3>
                <p className="text-xs text-muted-foreground mt-1">Leading search icon, semantic placeholder, and a trailing clear (X) button that mounts when text exists.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 border-purple-500/20">
              <Mic className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-purple-600 dark:text-purple-400">Voice Search Ready</h3>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">Trailing microphone icon to trigger Web Speech API or native device voice-to-text.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Discovery & Predictive */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Discovery & Suggestions
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Clock className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Recent Searches</h3>
                  <p className="text-xs text-muted-foreground mt-1">Displayed immediately on focus. Stored locally. Includes ability to clear history.</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <TrendingUp className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Popular Searches</h3>
                  <p className="text-xs text-muted-foreground mt-1">Guides discovery when there is no active query or history.</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Search className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Suggestions (Autocomplete)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Debounced API fetching showing predictive text or exact entity matches as the user types.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback States & Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-rose-500" />
            Feedback & Accessibility
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
                <Loader2 className="h-6 w-6 text-primary animate-spin shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Loading State</h3>
                  <p className="text-xs text-muted-foreground mt-1">Inline spinner replaces the search icon during debounced network requests.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
                <Ghost className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Empty State</h3>
                  <p className="text-xs text-muted-foreground mt-1">Friendly "No results" message with fallback actions (e.g., "Browse categories").</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Keyboard className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Accessibility (a11y)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - **Keyboard**: Navigate suggestions via `ArrowUp`/`ArrowDown` and `Enter`.
                  <br />- **ARIA Combobox**: Input uses `role="combobox"` with `aria-expanded` and `aria-controls`.
                  <br />- **Active Descendant**: `aria-activedescendant` for listbox navigation.
                  <br />- **Announcements**: `aria-live="polite"` announces result counts.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
