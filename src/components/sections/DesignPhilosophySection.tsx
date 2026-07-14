import { Separator } from "@/components/ui/separator";
import { Palette, Layers, Monitor, Smartphone, LayoutTemplate, Type, Zap, Box, Moon, Sun, Fingerprint, Layers3, Accessibility, Move } from "lucide-react";

export function DesignPhilosophySection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Design System Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          An enterprise-grade, premium design language. Elegant, minimal, fast, and inherently accessible.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Core Principles */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Palette className="h-5 w-5" />
            Core Philosophy & Inspirations
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            The design language is inspired by the usability and aesthetic precision of <strong>Apple, Stripe, Linear, and Notion</strong>. While we draw usability inspiration from industry leaders like MenuForma, this system is <strong>strictly original</strong>, prioritizing a unique, premium identity tailored for high-end restaurant operations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center gap-2 bg-background p-3 rounded-md border">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="font-medium text-sm">Elegant</span>
            </div>
            <div className="flex items-center gap-2 bg-background p-3 rounded-md border">
              <span className="h-2 w-2 rounded-full bg-slate-500"></span>
              <span className="font-medium text-sm">Minimal</span>
            </div>
            <div className="flex items-center gap-2 bg-background p-3 rounded-md border">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span className="font-medium text-sm">Fast</span>
            </div>
            <div className="flex items-center gap-2 bg-background p-3 rounded-md border">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-sm">Modern</span>
            </div>
          </div>
        </div>

        {/* Foundation & Architecture */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-indigo-500" />
            System Architecture
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Box className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Design Tokens (packages/theme)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Absolute values (colors, typography, spacing, radii, shadows) mapped to semantic tokens. E.g., `spacing-4` = `16px`. These serve as the single source of truth across all apps.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <LayoutTemplate className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Primitives & Components (packages/ui)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Headless UI (Radix) combined with Tailwind CSS for styling. Components are strictly modular, reusable, and side-effect free. No business logic resides in the UI package.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Color */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Type className="h-5 w-5 text-teal-500" />
            Typography & Color
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Type className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Typographic Hierarchy</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  High-contrast, geometric sans-serif for headings (e.g., Inter or Plus Jakarta Sans). High legibility sans-serif for body. Tight tracking on headings, relaxed tracking on body text.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Palette className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Semantic Palettes (Dark/Light)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimalist base palettes (zinc/slate). Color is reserved strictly for semantic meaning (destructive, success, active states) and brand accents.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Factor & Ergonomics */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-orange-500" />
            Ergonomics & Layout
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Smartphone className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Mobile-First & Touch Targets</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  All interfaces scale up from mobile. Critical touch targets (buttons, inputs, list items) are enforced at a minimum of <strong>44x44px</strong> to prevent fat-finger errors in fast-paced restaurant environments.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Move className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Spatial Rhythm (8pt Grid)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Layouts adhere to a strict 8pt grid system. Generous negative space (padding/margins) is used to group related elements logically without relying heavily on borders or explicit dividers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Motion & Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-rose-500" />
            Accessibility & Motion
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">WCAG AA Compliance</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Strict adherence to color contrast ratios (4.5:1). Full keyboard navigability (focus rings are customized but never disabled). ARIA labels are mandated for all icon-only interactive elements.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Purposeful Choreography</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Motion must be rapid (under 200ms) and purposeful. Used exclusively to indicate state changes (e.g., expanding a card, successful checkout) or spatial relationships (e.g., off-canvas drawers sliding in from the origin side).
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
