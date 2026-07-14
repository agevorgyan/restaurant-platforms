import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, ShieldCheck, Globe, Scaling, Users, EyeOff, RotateCcw, PaintRoller, Sparkles, Accessibility, Code } from "lucide-react";

export function DesignSystemReviewSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enterprise System Review</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          An architectural audit of the Design System to identify scalability limits, UX inconsistencies, and enforce enterprise-grade standards for a global SaaS platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Whitelabeling & Theming */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <PaintRoller className="h-5 w-5" />
            Multi-Tenant (Whitelabel) Scalability
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            The initial token architecture assumed a monolithic brand. For a SaaS platform serving 100,000+ restaurants, each tenant requires personalized branding without deploying separate applications.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-4 p-4 rounded-lg border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400">Issue: Hardcoded Utilities</h3>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Using utility classes like `text-blue-600` or `bg-green-500` binds the application to a specific color, destroying whitelabel capabilities.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Solution: Strict CSS Custom Properties</h3>
                <p className="text-xs text-muted-foreground mt-1">All design tokens must map to CSS Variables (`var(--color-primary)`). A `ThemeRegistry` dynamically injects the restaurant's `[data-theme]` variables into the HTML root at runtime.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Reach (i18n & RTL) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Internationalization (RTL)
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <RotateCcw className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Issue: Physical Properties</h3>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">Margin/padding (e.g., `ml-4`, `pr-2`) break visually when translated to RTL languages (Arabic, Hebrew).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Sparkles className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Solution: Logical Properties</h3>
                <p className="text-xs text-muted-foreground mt-1">Strict enforcement of logical properties. Use `ms-4` (margin-inline-start) and `pe-2` (padding-inline-end). The layout will automatically flip for RTL without custom overrides.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility & Motion */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-emerald-500" />
            Motion Accessibility
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <EyeOff className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Issue: Vestibular Triggers</h3>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">Heavy spatial motion (sliding drawers, page slides) can trigger motion sickness. The previous motion system lacked fallbacks.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ShieldCheck className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Solution: Reduced Motion</h3>
                <p className="text-xs text-muted-foreground mt-1">All structural animations must respect `prefers-reduced-motion`. Fall back to instantaneous transitions or simple opacity crossfades. Avoid sliding large blocks of content.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Component Architecture */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-500" />
            Component API Scalability
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400">Issue: The "God Component" Prop Drilling</h3>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">
                  Components like the `ProductCard` often grow to accept dozens of boolean props (`isSoldOut`, `showDiscount`, `hideImage`), creating fragile, unmaintainable monolithic components.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Scaling className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Solution: Compound Components (Slots)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Adopt the Compound Component pattern. Export sub-components (`ProductCard.Image`, `ProductCard.Price`) so consumers can compose the layout flexibly without modifying the core component logic.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
