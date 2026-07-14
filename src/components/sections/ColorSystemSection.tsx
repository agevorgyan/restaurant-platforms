import { Separator } from "@/components/ui/separator";
import { Palette, Sun, Moon, Contrast, PaintBucket, AlertTriangle, CheckCircle, Info, ShieldAlert, Zap, LayoutTemplate, Type } from "lucide-react";

export function ColorSystemSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Color System Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A highly semantic, accessibility-first color language built for both Light and Dark themes. 
          Values are defined by intent, never by hardcoded hex codes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Principles */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Contrast className="h-5 w-5" />
            Semantic Color & Accessibility
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Colors are entirely semantic. A button is never "blue"; it uses the `Primary` token. 
            This ensures effortless theming, perfect dark mode inversion, and guaranteed WCAG AA/AAA compliance.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Sun className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Light Theme (Default)</h3>
                <p className="text-xs text-muted-foreground mt-1">High lightness backgrounds with deep, high-contrast text. Surfaces utilize subtle drop shadows to convey elevation.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Moon className="h-6 w-6 text-indigo-400 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Dark Theme</h3>
                <p className="text-xs text-muted-foreground mt-1">Deep backgrounds. Elevation is conveyed through surface lightness (lighter borders and backgrounds) rather than shadows.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Action Colors */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PaintBucket className="h-5 w-5 text-blue-500" />
            Brand & Interactive
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary shrink-0 border"></div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Primary</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-primary · color-primary-foreground</p>
                <p className="text-xs text-muted-foreground mt-1">The primary brand color. Used for the most important actions, active states, and primary navigation elements.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-secondary shrink-0 border"></div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Secondary</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-secondary · color-secondary-foreground</p>
                <p className="text-xs text-muted-foreground mt-1">Used for secondary actions, less prominent active states, and alternative interactive elements.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-accent shrink-0 border"></div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Accent</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-accent · color-accent-foreground</p>
                <p className="text-xs text-muted-foreground mt-1">A highly contrasting color used sparingly to draw attention to new features, highlights, or special promotions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback & Semantic Colors */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Feedback & Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
              <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Success</h3>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1 font-mono">color-success · color-success-foreground</p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Indicates successful operations, completed orders, and active states.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-amber-500/10 border-amber-500/20">
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-amber-700 dark:text-amber-400">Warning</h3>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1 font-mono">color-warning · color-warning-foreground</p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">Cautions the user. Low stock alerts, impending timeouts, or missing non-critical data.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-rose-500/10 border-rose-500/20">
              <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-rose-700 dark:text-rose-400">Danger / Destructive</h3>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1 font-mono">color-danger · color-danger-foreground</p>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Critical errors, destructive actions (delete, cancel order), and severe system failures.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-blue-500/10 border-blue-500/20">
              <Info className="h-6 w-6 text-blue-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400">Info</h3>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 font-mono">color-info · color-info-foreground</p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Neutral informational messages, updates, and helpful tips.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout & Structure */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-slate-500" />
            Layout & Structure
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Background</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-background</p>
                <p className="text-xs text-muted-foreground mt-1">The deepest base layer of the application. Typically a very light gray in Light mode, and near-black in Dark mode.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Surface</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-surface</p>
                <p className="text-xs text-muted-foreground mt-1">Elevated containers that sit on top of the background, such as sidebars or floating panels.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Card</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-card</p>
                <p className="text-xs text-muted-foreground mt-1">Used for distinct content blocks, menu items, and dashboard widgets.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Border</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-border</p>
                <p className="text-xs text-muted-foreground mt-1">Subtle lines used to separate content when whitespace is insufficient. Must maintain a low contrast ratio against the background.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Colors */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Type className="h-5 w-5 text-indigo-500" />
            Typography & Neutrals
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Text (Foreground)</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-text</p>
                <p className="text-xs text-muted-foreground mt-1">Primary reading text. Must maintain a minimum WCAG AA contrast ratio of 4.5:1 against the background.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Muted</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-muted · color-muted-foreground</p>
                <p className="text-xs text-muted-foreground mt-1">Secondary text, placeholders, and disabled states. Used to establish visual hierarchy without bolding.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Neutral</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">color-neutral-100 to color-neutral-900</p>
                <p className="text-xs text-muted-foreground mt-1">A core grayscale palette used as the foundation for the interface. Rarely applied directly, usually mapped through semantic tokens.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
