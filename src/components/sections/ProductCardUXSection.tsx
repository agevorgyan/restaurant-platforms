import { Separator } from "@/components/ui/separator";
import { CreditCard, Image as ImageIcon, Type, DollarSign, Percent, Star, Heart, PlusSquare, Clock, XCircle, Zap, Loader2, SquareDashed, Moon, Accessibility, Smartphone, LayoutTemplate } from "lucide-react";

export function ProductCardUXSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Card UX Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          UX rules for the core menu item component. Built for mobile optimization, rapid ordering, and extreme scalability.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Philosophy */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <LayoutTemplate className="h-5 w-5" />
            Core Philosophy
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            The Product Card is the most interacted-with component in the platform. It must be exceptionally performant, highly legible on mobile devices, and support complex states (sold out, discounted, customizable) without visual clutter.
          </p>
          <div className="flex gap-4 p-4 rounded-lg border bg-card">
            <Smartphone className="h-6 w-6 text-indigo-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">Mobile-First Optimization</h3>
              <p className="text-xs text-muted-foreground mt-1">Designed primarily for touch. Add buttons and favorite toggles must exceed the 44x44px touch target minimum. The card utilizes a horizontal layout on small screens and a stacked layout on larger viewports.</p>
            </div>
          </div>
        </div>

        {/* Visual Hierarchy & Content */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            Visual Hierarchy & Content
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ImageIcon className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Large Imagery</h3>
                <p className="text-xs text-muted-foreground mt-1">High-quality, lazy-loaded images are the primary focal point. Images must have a consistent aspect ratio (e.g., 1:1 or 4:3) with object-fit cover. A subtle fallback skeleton must be shown during image load.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Type className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Beautiful Typography</h3>
                <p className="text-xs text-muted-foreground mt-1">Product Name (`text-product-name`) is prominent. Descriptions are clamped to 2 lines to maintain uniform card heights. Ingredients or allergens use `text-caption`.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Star className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Rating & Social Proof</h3>
                <p className="text-xs text-muted-foreground mt-1">Compact rating indicator (e.g., "★ 4.8"). Positioned near the title or image corner. Only shown if reviews exceed a certain threshold (e.g., &gt; 5 reviews).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Commerce */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Pricing & Commerce
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <DollarSign className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Price (Tabular Nums)</h3>
                <p className="text-xs text-muted-foreground mt-1">Uses `text-price`. Must always use tabular numerals for perfect alignment. Currency symbols are slightly de-emphasized compared to the primary value.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Percent className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Discount Logic</h3>
                <p className="text-xs text-muted-foreground mt-1">Original price is struck through and muted. Discounted price is highlighted in the semantic Accent or Primary color. A subtle "X% OFF" badge may overlay the image.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <PlusSquare className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Add Button / Quick Add</h3>
                <p className="text-xs text-muted-foreground mt-1">Primary action. On mobile, often an icon button (+). If item has variants (sizes, sides), it displays "Choose" instead of "Add".</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Heart className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Favorite (Wishlist)</h3>
                <p className="text-xs text-muted-foreground mt-1">Absolute positioned in the top-right corner of the image. Uses optimistic UI updates to feel instantaneous.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory & Status */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Inventory & Availability
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
              <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm text-orange-600 dark:text-orange-400">Limited Availability</h3>
                <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">Displays semantic warning text (e.g., "Only 3 left" or "Available until 11 AM"). Instills urgency without looking like an error.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border border-muted bg-muted/30">
              <XCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Sold Out State</h3>
                <p className="text-xs text-muted-foreground mt-1">Entire card opacity drops to `opacity-disabled`. Image becomes grayscale. Add button is disabled and replaced with "Sold Out" text.</p>
              </div>
            </div>
          </div>
        </div>

        {/* State Management & Ergonomics */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-teal-500" />
            State Management, UX & Accessibility
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <SquareDashed className="h-6 w-6 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Skeleton Loaders</h3>
              <p className="text-xs text-muted-foreground mt-1">Never show empty containers. Display a structural skeleton using `animate-pulse` that mimics the card's final dimensions to prevent layout shifts.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <h3 className="font-semibold text-sm">Action Loading</h3>
              <p className="text-xs text-muted-foreground mt-1">When adding to cart, show an inline spinner inside the button. Avoid blocking the whole UI. Use optimistic updates where possible.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Moon className="h-6 w-6 text-indigo-400" />
              <h3 className="font-semibold text-sm">Dark Mode Fidelity</h3>
              <p className="text-xs text-muted-foreground mt-1">In dark mode, the card uses `color-card` with a lighter border. Drop shadows are removed. Images may receive a subtle darkening overlay to reduce glare.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Accessibility className="h-6 w-6 text-rose-500" />
              <h3 className="font-semibold text-sm">Accessibility (a11y)</h3>
              <p className="text-xs text-muted-foreground mt-1">The entire card must be keyboard navigable. Images must have descriptive `alt` tags. Provide an `aria-label` like "Add [Product Name] to cart - [Price]".</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
