import { Separator } from "@/components/ui/separator";
import { Folder, FolderTree, Package, Layout, Navigation, Box, Zap, Settings, Component, FileCode, Layers, Activity } from "lucide-react";

export function ComponentLibrarySection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Component Library Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The structural blueprint for the <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">packages/ui/</code> workspace. Designed for a monorepo environment to serve the consumer app, POS, and admin dashboards.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Package Overview */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Package className="h-5 w-5" />
            Monorepo UI Package
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Isolating the Design System into its own package ensures zero business-logic leakage, enforces strict prop interfaces, and allows independent versioning and testing via Storybook.
          </p>
        </div>

        {/* Directory Tree Explorer */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-indigo-500" />
            Directory Structure
          </h2>
          
          <div className="font-mono text-sm bg-muted/30 p-4 rounded-lg border overflow-x-auto">
            <div className="flex items-center gap-2 text-primary font-bold mb-2">
              <Package className="h-4 w-4" /> packages/ui/
            </div>
            
            <div className="pl-6 space-y-3 text-muted-foreground">
              {/* Components */}
              <div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-blue-400" /> components/</div>
                <div className="pl-6 pt-1 text-xs space-y-1">
                  <div>button/</div>
                  <div>badge/</div>
                  <div>input/</div>
                  <div>modal/</div>
                  <div className="text-muted-foreground/50">... (primitives)</div>
                </div>
              </div>

              {/* Layout */}
              <div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-emerald-400" /> layout/</div>
                <div className="pl-6 pt-1 text-xs space-y-1">
                  <div>container/</div>
                  <div>stack/</div>
                  <div>grid/</div>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-purple-400" /> navigation/</div>
                <div className="pl-6 pt-1 text-xs space-y-1">
                  <div>header/</div>
                  <div>bottom-navbar/</div>
                  <div>sidebar/</div>
                </div>
              </div>

              {/* Restaurant */}
              <div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-amber-500" /> restaurant/</div>
                <div className="pl-6 pt-1 text-xs space-y-1">
                  <div>product-card/</div>
                  <div>cart/</div>
                  <div>modifier-group/</div>
                  <div className="text-muted-foreground/50">... (domain entities)</div>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-rose-400" /> feedback/</div>
                <div className="pl-6 pt-1 text-xs space-y-1">
                  <div>skeleton/</div>
                  <div>error-state/</div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-slate-400" /> theme/</div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-slate-400" /> motion/</div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-slate-400" /> hooks/</div>
                <div className="flex items-center gap-2 text-foreground font-semibold"><Folder className="h-4 w-4 text-slate-400" /> utils/</div>
              </div>

            </div>
          </div>
        </div>

        {/* Module Definitions */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm">
              <Component className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Primitives (components/)</h3>
                <p className="text-xs text-muted-foreground mt-1">Domain-agnostic interactive elements (Buttons, Inputs, Checkboxes). Often built on top of headless accessible libraries like Radix UI.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm">
              <Layers className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Layouts & Navigation</h3>
                <p className="text-xs text-muted-foreground mt-1">Structural boundaries and wayfinding logic. `stack/` and `container/` handle macro-spacing to prevent margin-leakage between sibling components.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm border-amber-500/20">
              <Box className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Domain Entities (restaurant/)</h3>
                <p className="text-xs text-muted-foreground mt-1">Composite components specific to the SaaS vertical. `product-card/`, `modifier-group/`, and `cart/` compose primitives together to solve complex business needs.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm">
              <Activity className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Feedback & Motion</h3>
                <p className="text-xs text-muted-foreground mt-1">`feedback/` handles loading (`skeleton/`) and destructive states. `motion/` exports shared Framer Motion variants to ensure animation consistency.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm">
              <Settings className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Theme Engine & Utils</h3>
                <p className="text-xs text-muted-foreground mt-1">`theme/` manages CSS variable injection for whitelabeling. `utils/` houses pure functions like `cn()` for Tailwind class merging.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
