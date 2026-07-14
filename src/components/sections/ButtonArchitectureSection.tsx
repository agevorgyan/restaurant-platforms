import { Separator } from "@/components/ui/separator";
import { MousePointerClick, CheckCircle2, AlertTriangle, Loader2, ArrowRight, ArrowLeft, Settings, Accessibility, MonitorSmartphone, Type, Layers } from "lucide-react";

export function ButtonArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Button Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The primary interactive primitive of the UI Kit. Designed for high versatility, rigorous typing, and strict accessibility standards.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Variants */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            Visual Variants
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-primary text-primary-foreground">
              <MousePointerClick className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Primary</h3>
                <p className="text-xs opacity-90 mt-1">The main call to action. High contrast background with contrasting text.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-secondary text-secondary-foreground">
              <MousePointerClick className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Secondary</h3>
                <p className="text-xs opacity-80 mt-1">Alternative actions. Subtle background with strong text.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-transparent hover:bg-muted transition-colors">
              <MousePointerClick className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Ghost</h3>
                <p className="text-xs text-muted-foreground mt-1">Lowest emphasis. Transparent background, changes on hover.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border border-input bg-transparent">
              <MousePointerClick className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Outline</h3>
                <p className="text-xs text-muted-foreground mt-1">Medium emphasis. Solid border matching the text color.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Danger</h3>
                <p className="text-xs opacity-90 mt-1">Destructive actions (e.g., Delete). Uses semantic error colors.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Success</h3>
                <p className="text-xs opacity-90 mt-1">Positive confirmation. Uses semantic success colors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* States & Anatomy */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-500" />
              States & Modifiers
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Loader2 className="h-6 w-6 text-primary animate-spin shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Loading</h3>
                  <p className="text-xs text-muted-foreground mt-1">Disables interaction and shows a spinner while maintaining exact dimensions.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 opacity-50">
                <MousePointerClick className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Disabled</h3>
                  <p className="text-xs text-muted-foreground mt-1">Reduced opacity (`0.5`), pointer events disabled.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <MonitorSmartphone className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Full Width</h3>
                  <p className="text-xs text-muted-foreground mt-1">Expands to 100% width. Essential for mobile layouts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Type className="h-5 w-5 text-blue-500" />
              Anatomy & Icons
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <ArrowLeft className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Icon Left</h3>
                  <p className="text-xs text-muted-foreground mt-1">Leading icon preceding text.</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <ArrowRight className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Icon Right</h3>
                  <p className="text-xs text-muted-foreground mt-1">Trailing icon following text.</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Settings className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Icon-Only</h3>
                  <p className="text-xs text-muted-foreground mt-1">Requires visually hidden `aria-label`.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-purple-500" />
            Accessibility & Shapes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Keyboard & ARIA</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - Must receive focus via `Tab` and trigger via `Enter`/`Space`.
                  <br />- `aria-busy` and `aria-live="polite"` when loading.
                  <br />- Highly distinct `:focus-visible` offset ring.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Layers className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Shapes & Sizes</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  - **Standard**: Rounded rectangle (`md` or `lg` radius).
                  <br />- **Square**: Sharp corners (`radius-none`).
                  <br />- **Round**: Pill shape (`radius-full`).
                  <br />- **Sizes**: `sm`, `md` (default), `lg`, `icon`.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
