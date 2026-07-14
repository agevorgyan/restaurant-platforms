import { Separator } from "@/components/ui/separator";
import { Layers, Puzzle, ShieldCheck, SunMoon, Hand, Accessibility, Sparkles, AlertTriangle, MonitorSmartphone, Code2 } from "lucide-react";

export function UIKitArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UI Kit Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The architectural blueprint for building the reusable enterprise React UI Kit. Enforcing composition, strict typing, and comprehensive state handling.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Principles */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Layers className="h-5 w-5" />
            Core Component Principles
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Every component must be designed to scale across the consumer app, POS, and admin dashboards without breaking changes.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Puzzle className="h-6 w-6 text-indigo-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Composable</h3>
                <p className="text-xs text-muted-foreground mt-1">Avoid "god components" with dozens of props. Use the Compound Component pattern (Slots) for ultimate flexibility.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Code2 className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Fully Typed</h3>
                <p className="text-xs text-muted-foreground mt-1">Export strict TypeScript interfaces. Extend native HTML attributes (e.g., `React.ButtonHTMLAttributes`). Never use `any`.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <SunMoon className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Theme Aware</h3>
                <p className="text-xs text-muted-foreground mt-1">Strict reliance on CSS Custom Properties injected by the Theme Engine. Components must adapt seamlessly to Dark Mode.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Hand className="h-6 w-6 text-pink-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Touch Friendly</h3>
                <p className="text-xs text-muted-foreground mt-1">Ensure 44px minimum touch targets on mobile for all interactive elements to prevent mis-taps.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <MonitorSmartphone className="h-6 w-6 text-blue-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Responsive</h3>
                <p className="text-xs text-muted-foreground mt-1">Use fluid typography (`clamp`) and fluid grid layouts over rigid breakpoints to support any screen size.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Sparkles className="h-6 w-6 text-cyan-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Animation Ready</h3>
                <p className="text-xs text-muted-foreground mt-1">Support Framer Motion layout animations. Wrap structural animations in `prefers-reduced-motion` guards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* State Management */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Standardized States
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div className="h-6 w-6 rounded-full bg-muted animate-pulse shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Loading State</h3>
                <p className="text-xs text-muted-foreground mt-1">Predictable skeletons or inline spinners. Skeletons must match the exact dimensions of the loaded component to prevent layout shifts.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400">Error State</h3>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Clear semantic colors (`text-destructive`). Never rely on color alone; provide supporting error text or icons.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 opacity-50">
              <ShieldCheck className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Disabled State</h3>
                <p className="text-xs text-muted-foreground mt-1">Opacity reduced to `0.38` or `0.5`. Pointer events disabled. Must remain readable against the background.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Layers className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Empty State</h3>
                <p className="text-xs text-muted-foreground mt-1">Friendly, clear illustrations or text explaining why there is no data, paired with a call-to-action (CTA).</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Design & Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-purple-500" />
            API Design & Accessibility
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Code2 className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">CVA Variants & Sizes</h3>
                <p className="text-xs text-muted-foreground mt-1">Use Class Variance Authority (CVA) to manage visual variants (e.g., `solid`, `outline`) and sizes (e.g., `sm`, `lg`) cleanly without messy template literals.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Layers className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Polymorphism (asChild)</h3>
                <p className="text-xs text-muted-foreground mt-1">Support the `asChild` prop (via Radix UI Slot) to allow semantic HTML element overriding (e.g., rendering a link styled as a button) without duplicate code.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Strict WAI-ARIA</h3>
                <p className="text-xs text-muted-foreground mt-1">Map `aria-invalid`, `aria-describedby`, and roles natively. Ensure focus states (`focus-visible`) are highly distinct and visible on all backgrounds.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
