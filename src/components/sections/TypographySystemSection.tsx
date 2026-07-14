import { Separator } from "@/components/ui/separator";
import { Type, Heading1, Heading2, AlignLeft, Hash, Tag, AlertCircle, CheckCircle2, DollarSign, GripHorizontal, Scaling } from "lucide-react";

export function TypographySystemSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Typography System</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Semantic text styles and scales designed for extreme legibility in fast-paced restaurant environments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Naming Conventions */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Tag className="h-5 w-5" />
            Naming Conventions
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Typography tokens use semantic naming based on intent rather than just size. 
            Format: <code>text-[role]-[variant]</code> (e.g., <code>text-body-base</code>, <code>text-price-lg</code>).
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Role / Intent</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">heading, body, price, button, label</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Variant / Size</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">sm, base, lg, xl, 1, 2</p>
            </div>
          </div>
        </div>

        {/* Base Scale */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Hash className="h-5 w-5 text-blue-500" />
            Typography Scale (Base 16px)
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">xs</span>
              <span className="font-mono font-medium">12px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">0.75rem</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">sm</span>
              <span className="font-mono font-medium">14px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">0.875rem</span>
            </div>
            <div className="p-3 bg-primary/10 border-primary/30 rounded-md border text-center">
              <span className="text-xs text-primary block mb-1 font-medium">base</span>
              <span className="font-mono font-medium text-primary">16px</span>
              <span className="text-[10px] text-primary/70 block mt-1">1rem</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">lg</span>
              <span className="font-mono font-medium">18px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">1.125rem</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">xl</span>
              <span className="font-mono font-medium">20px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">1.25rem</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">2xl</span>
              <span className="font-mono font-medium">24px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">1.5rem</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">3xl</span>
              <span className="font-mono font-medium">30px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">1.875rem</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">4xl</span>
              <span className="font-mono font-medium">36px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">2.25rem</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-md border text-center">
              <span className="text-xs text-muted-foreground block mb-1">5xl</span>
              <span className="font-mono font-medium">48px</span>
              <span className="text-[10px] text-muted-foreground block mt-1">3rem</span>
            </div>
          </div>
        </div>

        {/* Structural Typography */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heading1 className="h-5 w-5 text-indigo-500" />
            Structural & Content
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-bold text-2xl tracking-tight text-foreground">Heading</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-heading-1 (4xl/36px) · Bold · Tight tracking</p>
                <p className="text-xs text-muted-foreground mt-1">Used for page titles, major sections, and marketing headers.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-xl tracking-tight text-foreground">Title</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-title (2xl/24px) · Semibold · Tight tracking</p>
                <p className="text-xs text-muted-foreground mt-1">Used for card titles, modal headers, and primary content blocks.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-medium text-lg text-muted-foreground">Subtitle</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-subtitle (lg/18px) · Medium · Normal tracking</p>
                <p className="text-xs text-muted-foreground mt-1">Supports headings and titles. Often used to explain the section below.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="text-base text-foreground">Body</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-body (base/16px) · Regular · Relaxed line-height</p>
                <p className="text-xs text-muted-foreground mt-1">Primary reading text for paragraphs, descriptions, and long-form content.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="text-sm text-muted-foreground">Caption</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-caption (sm/14px) · Regular · Normal line-height</p>
                <p className="text-xs text-muted-foreground mt-1">Secondary text, timestamps, table data, and helper text below inputs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Domain-Specific Typography */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Domain & UI Elements
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Product Name</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-product-name (lg/18px) · Semibold</p>
                <p className="text-xs text-muted-foreground mt-1">Used in menus, order summaries, and POS grid items to highlight the item.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-medium text-base text-muted-foreground uppercase tracking-wider">Category Name</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-category (sm/14px) · Medium · Uppercase · Wide tracking</p>
                <p className="text-xs text-muted-foreground mt-1">Used for section headers in menus (e.g., "APPETIZERS", "BEVERAGES").</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-mono font-medium text-lg text-foreground">$24.99</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-price (lg/18px) · Monospace/Tabular Nums · Medium</p>
                <p className="text-xs text-muted-foreground mt-1">Prices must always use tabular numerals to align vertically in receipts and carts.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-medium text-sm text-primary">Button Text</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-button (sm/14px) · Medium · Centered</p>
                <p className="text-xs text-muted-foreground mt-1">Used inside interactive buttons. Slightly heavier weight for legibility on colored backgrounds.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <div>
                <h3 className="font-medium text-xs text-foreground uppercase tracking-widest">Labels</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">text-label (xs/12px) · Medium · Uppercase</p>
                <p className="text-xs text-muted-foreground mt-1">Used for form input labels, badges, and tiny UI indicators.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Typography */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            Feedback & Validation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm text-rose-600 dark:text-rose-400">Error Text</h3>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1 font-mono">text-error (sm/14px) · Medium</p>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Form validation errors, failed payment notices, and destructive action warnings. Never rely on color alone; always pair with an icon.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm text-emerald-600 dark:text-emerald-400">Success Text</h3>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1 font-mono">text-success (sm/14px) · Medium</p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Order confirmations, successful saves, and positive feedback. Used sparingly to maintain impact.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Architecture */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Scaling className="h-5 w-5 text-indigo-500" />
            Responsive Architecture
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <h3 className="font-semibold text-sm">Fluid Clamp Scaling</h3>
              <p className="text-xs text-muted-foreground mt-1">Instead of rigid media queries (`text-base md:text-lg`), we use CSS `clamp()` to linearly scale typography between min and max bounds based on viewport width. E.g., `clamp(1rem, 1.5vw + 0.75rem, 1.25rem)`.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <h3 className="font-semibold text-sm text-foreground">Semantic Classes (No Base HTML)</h3>
              <p className="text-xs text-muted-foreground mt-1">Never style raw `&lt;h1&gt;` or `&lt;h2&gt;` tags globally. Use semantic utility classes (`.text-heading-1`, `.text-body-lg`) to decouple visual style from SEO/Accessibility document structure.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
