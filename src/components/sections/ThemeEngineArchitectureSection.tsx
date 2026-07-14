import { Separator } from "@/components/ui/separator";
import { Palette, Type, Image as ImageIcon, Paintbrush, Moon, Layers, AppWindow, MousePointerClick, Maximize, Frame } from "lucide-react";

export function ThemeEngineArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theme Engine Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A scalable, CSS Custom Property driven approach to whitelabeling. Allows restaurants to inject their unique brand identity without code changes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Brand Assets */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-500" />
            Core Brand Assets
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Paintbrush className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Primary Color</h3>
                <p className="text-xs text-muted-foreground mt-1">Main accent for CTAs and emphasis. Auto-generates hover states and accessible contrast foregrounds.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Type className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Typography</h3>
                <p className="text-xs text-muted-foreground mt-1">Brand-aligned fonts for headings and body. Loaded dynamically via CSS variables.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ImageIcon className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Logo & Imagery</h3>
                <p className="text-xs text-muted-foreground mt-1">Dynamic injection into headers, receipts, and splash screens.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Frame className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Icons</h3>
                <p className="text-xs text-muted-foreground mt-1">Pluggable icon sets (solid, outline, duotone) to match the brand's mood.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Structural & Components */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AppWindow className="h-5 w-5 text-emerald-500" />
              Structural Theming
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Maximize className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Global Radius & Spacing</h3>
                  <p className="text-xs text-muted-foreground mt-1">Controls curvature (none to full) and density (compact vs relaxed) globally across all components.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Layers className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Card Style</h3>
                  <p className="text-xs text-muted-foreground mt-1">Configuration for product and summary cards: Flat (borders) or Elevated (shadows).</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <MousePointerClick className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Button Style</h3>
                  <p className="text-xs text-muted-foreground mt-1">Global appearances: Solid, Outline, Soft, or Ghost. Inherits the global radius setting.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation & Dark Mode */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Moon className="h-5 w-5 text-slate-500" />
            Dark Mode & Implementation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Moon className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Dark Mode Auto-Scaling</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Semantic tokens (`--bg`, `--foreground`, `--card`) invert or adjust smoothly using HSL scales when the `.dark` class is applied. Every theme is automatically dark-mode compatible.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Type className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">CSS Custom Properties</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Engine injects inline `&lt;style&gt;` tags with variables based on the JSON payload. Tailwind is configured to consume these variables, enabling standard utility classes (`bg-primary`) to adapt dynamically.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
