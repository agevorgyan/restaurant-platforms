import { Separator } from "@/components/ui/separator";
import { LayoutTemplate, Image as ImageIcon, Type, Tag, Heart, PlusCircle, Settings2, Ghost, Activity, Loader2, AlertCircle, Accessibility, Moon } from "lucide-react";

export function ProductCardArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Card Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The heart of the Restaurant Platform. Designed for visual appetite, rapid scanning, and precise state communication across grid and list layouts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Layout & Anatomy */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-indigo-500" />
            Layout & Anatomy
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <LayoutTemplate className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Grid vs. List</h3>
                <p className="text-xs text-muted-foreground mt-1">Grid (Vertical) for visual menus/heroes with image on top. List (Horizontal) for dense scanning with image leading.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ImageIcon className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Image Ratio</h3>
                <p className="text-xs text-muted-foreground mt-1">1:1 (Square) for unified grids and lists. 4:3 or 16:9 for featured items. Must use `object-cover` to prevent distortion.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Type className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Typography & Spacing</h3>
                <p className="text-xs text-muted-foreground mt-1">Line-clamp title and description (max 2 lines) to prevent layout breakage. Generous internal padding decoupled from image edges.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Interactions */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-500" />
              Features & Actions
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-rose-500" />
                  <h3 className="font-semibold text-sm">Discount & Badges</h3>
                </div>
                <p className="text-xs text-muted-foreground">Original price crossed out. Badges for dietary/promotions placed over the image or next to title.</p>
              </div>
              <div className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <h3 className="font-semibold text-sm">Favorite</h3>
                </div>
                <p className="text-xs text-muted-foreground">Heart icon overlaid on image top trailing corner. Optimistic UI updates upon interaction.</p>
              </div>
              <div className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-indigo-500" />
                  <h3 className="font-semibold text-sm">Add Button</h3>
                </div>
                <p className="text-xs text-muted-foreground">Fixed to bottom trailing corner. Distinct hit target.</p>
              </div>
              <div className="flex flex-col gap-2 p-3 rounded-lg border bg-amber-500/10 border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Modifier Indicator</h3>
                </div>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">If modifiers exist, button reads "Customize". Clear indication that choices are required.</p>
              </div>
            </div>
          </div>
        </div>

        {/* States, Accessibility, & Theming */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-rose-500" />
            States, Accessibility, & Theming
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50 opacity-60">
              <Ghost className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Stock Status</h3>
                <p className="text-xs text-muted-foreground mt-1">Image gets grayscale filter. Card drops opacity to 50%. Add button replaced by "Sold Out" badge.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Loader2 className="h-6 w-6 text-primary animate-spin shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Loading & Error</h3>
                <p className="text-xs text-muted-foreground mt-1">Skeleton mimics layout exactly. Inline fallback for image load failure.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Activity className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Animations</h3>
                <p className="text-xs text-muted-foreground mt-1">Hover scales image (105%) and elevates card (-2px Y). Press scales down card (98%).</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50 md:col-span-2">
              <Accessibility className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Accessibility (Nested Focus)</h3>
                <p className="text-xs text-muted-foreground mt-1">Entire card is a focusable link (to details), but "Add" and "Favorite" buttons are distinct, nested focus targets. Clear `aria-label` where necessary.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Moon className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Dark Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">Soft borders and subtle background elevations (`bg-card`) to separate card from canvas cleanly.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
