import { Separator } from "@/components/ui/separator";
import { Grid3X3, Layers, Maximize, Circle, Move, Wind, Zap, Box, LayoutGrid, ArrowRightLeft } from "lucide-react";

export function DesignTokensSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Design Tokens & Conventions</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The foundational, platform-agnostic design variables that define the visual language of the Restaurant SaaS Platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Naming Conventions */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Box className="h-5 w-5" />
            Token Naming Conventions
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tokens follow a strict taxonomy: <code>[Category]-[Property]-[Variant]-[State]</code>. This ensures predictability across UI components and Tailwind classes.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Category</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">spacing, radius, elevation</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Property/Intent</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">container, shadow, blur</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Variant/Scale</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">sm, md, lg, 100, 500</p>
            </div>
          </div>
        </div>

        {/* Spatial System */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-blue-500" />
            Spatial System
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Move className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Spacing (8pt Grid)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on a strict 8pt grid, with a 4pt half-step for micro-adjustments.
                  <br /><span className="font-mono mt-1 block">space-2 (8px), space-4 (16px), space-8 (32px)</span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <LayoutGrid className="h-6 w-6 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Grid, Margins & Padding</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Grid:</strong> 12 columns desktop, 8 tablet, 4 mobile. Gaps use spacing tokens.
                  <br /><strong>Margins/Padding:</strong> Mapped directly to spacing tokens (e.g., `p-4`, `m-8`).
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Maximize className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Breakpoints & Containers</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Mobile-first breakpoints. Container widths are clamped to prevent stretching on ultrawide monitors.
                  <br /><span className="font-mono mt-1 block">sm: 640px, md: 768px, lg: 1024px, xl: 1280px</span>
                  <span className="font-mono mt-1 block">container-max: 1440px</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Styling */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
            Visual Properties
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Circle className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Radius (Border Radius)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Subtle, consistent rounding. Outer radii should proportionally match inner radii to prevent visual distortion.
                  <br /><span className="font-mono mt-1 block">radius-sm (4px), radius-md (8px), radius-lg (12px), radius-full (9999px)</span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Layers className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Elevation (Shadows)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Shadows simulate physical depth. Layered multi-stop shadows rather than single-stop blur. Dark mode uses lighter border layers instead of shadows.
                  <br /><span className="font-mono mt-1 block">elevation-low, elevation-med, elevation-high, elevation-float</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Wind className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Opacity & Blur</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Used for glassmorphism panels, disabled states, and overlays. Blur tokens are paired with opacity for backdrop filters.
                  <br /><span className="font-mono mt-1 block">opacity-disabled (50%), opacity-overlay (80%)</span>
                  <span className="font-mono block">blur-sm (4px), blur-md (8px), blur-lg (16px)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Motion & Interaction */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Motion & Choreography
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ArrowRightLeft className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Transitions</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Standardized durations and easing curves for hover states, focus rings, and simple property changes.
                  <br /><strong>Durations:</strong> <span className="font-mono">fast (150ms), normal (250ms), slow (350ms)</span>
                  <br /><strong>Easings:</strong> <span className="font-mono">ease-out (decels), ease-in-out (standard)</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Animations (Keyframes)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Complex, multi-step motions for entering/exiting the DOM (e.g., modals sliding up, toasts fading in).
                  <br /><span className="font-mono mt-1 block">animate-in (fade, slide-up), animate-out (fade, scale-down), animate-pulse</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
