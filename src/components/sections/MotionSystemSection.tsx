import { Separator } from "@/components/ui/separator";
import { Zap, Move, LayoutPanelTop, MousePointerClick, ShoppingCart, PanelBottom, AppWindow, Loader2, SquareDashed, FastForward, Focus, Activity, Accessibility } from "lucide-react";

export function MotionSystemSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Motion System Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A purposeful, rapid, and spatial motion language designed to guide attention and provide immediate physical feedback without slowing down the user.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Philosophy */}
        <div className="space-y-6 rounded-xl border border-primary/50 bg-primary/5 p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Focus className="h-5 w-5" />
            Animation Philosophy
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Motion must serve a functional purpose: providing feedback, explaining spatial relationships, or masking load times. It must never feel gratuitous or act as a barrier to interaction.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <FastForward className="h-6 w-6 text-indigo-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Rapid Execution</h3>
                <p className="text-xs text-muted-foreground mt-1">Animations should rarely exceed 300ms. Micro-interactions must complete in 150ms or less to feel instantaneous.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Activity className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Physicality</h3>
                <p className="text-xs text-muted-foreground mt-1">Elements should mimic physical weight. Use spring physics for interactive components rather than linear easings.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg border bg-card">
              <Zap className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Spatial Logic</h3>
                <p className="text-xs text-muted-foreground mt-1">Motion should explain where elements come from and where they go. A drawer from the bottom implies it can be swiped away downwards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Micro-Interactions */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MousePointerClick className="h-5 w-5 text-blue-500" />
            Micro-Interactions
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <MousePointerClick className="h-6 w-6 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Button Press</h3>
                <p className="text-xs text-muted-foreground mt-1">Immediate scale-down (e.g., 96%) upon press to simulate a physical push. Restores scale on release with a slight spring.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Move className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Card Hover</h3>
                <p className="text-xs text-muted-foreground mt-1">Subtle elevation increase (shadow gets larger) and a very slight translation upwards (-2px). Must feel weightless but tangible on desktop.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ShoppingCart className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Cart Animation</h3>
                <p className="text-xs text-muted-foreground mt-1">When adding an item, the cart icon should "pop" (briefly scale up to 120% then back to 100% with a spring) to confirm the action without blocking the UI.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout & Structure */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutPanelTop className="h-5 w-5 text-purple-500" />
            Macro Layout & Overlay
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <LayoutPanelTop className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Page Transition</h3>
                <p className="text-xs text-muted-foreground mt-1">Subtle crossfade combined with a very short upward translation (e.g., slide-in-from-bottom-4). Avoid full-page slides which can induce motion sickness.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <PanelBottom className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Bottom Sheet / Drawer</h3>
                <p className="text-xs text-muted-foreground mt-1">Slides in from the bottom edge using a damping spring. Must support touch-drag gestures to dismiss, tracking the user's finger 1:1 before snapping closed.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <AppWindow className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Modal</h3>
                <p className="text-xs text-muted-foreground mt-1">Fades in while scaling up slightly from 95% to 100%. The backdrop fades in concurrently. Creates a feeling of depth and focus.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading States */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Loading & Perception
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
              <SquareDashed className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-orange-700 dark:text-orange-400">Skeleton Loaders</h3>
                <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">Use a smooth, low-contrast `animate-pulse` or a subtle shimmering wave effect. Skeletons must exactly match the structural footprint of the loaded content to prevent layout shifts.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border border-muted bg-muted/30">
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Inline Loading</h3>
                <p className="text-xs text-muted-foreground mt-1">For buttons and localized actions, replace the icon or text with a smooth, continuous rotation (linear easing). Do not block the entire screen for localized actions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility & Safety */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-teal-500" />
            Motion Accessibility
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <h3 className="font-semibold text-sm text-foreground">Prefers Reduced Motion</h3>
              <p className="text-xs text-muted-foreground mt-1">All spatial animations (sliding, scaling, springing) MUST check for the `prefers-reduced-motion` media query. For users with vestibular disorders, fall back to simple opacity crossfades or instantaneous transitions.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <h3 className="font-semibold text-sm text-foreground">No Parallax or Endless Loops</h3>
              <p className="text-xs text-muted-foreground mt-1">Avoid heavy parallax scrolling and looping animations (other than tiny loading spinners) that cannot be paused. Motion must be triggered by user action, not environmental noise.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
