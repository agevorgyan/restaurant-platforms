import { Separator } from "@/components/ui/separator";

export function UXArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UX Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Inspired by Apple, Stripe, Linear, Notion, and MenuForma.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Design Principles</h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li><strong>Minimalism:</strong> Let the food imagery be the hero. Interfaces fade into the background.</li>
            <li><strong>Large Spacing:</strong> Generous whitespace creates an elegant, uncluttered feel.</li>
            <li><strong>Rounded Cards:</strong> Soft corners (large radii) on images and containers for approachability.</li>
            <li><strong>Glass Effect:</strong> Used sparingly (e.g., sticky bottom cart, sticky headers) to maintain context without visual noise.</li>
            <li><strong>Smooth Animations:</strong> Layout transitions, drawer slides, and button presses feel physical and intentional.</li>
            <li><strong>One-Hand Mobile:</strong> Critical actions (cart, checkout, filtering) accessible at the bottom of the screen.</li>
            <li><strong>Ultra Fast:</strong> Skeleton loaders that match the layout exactly. Zero layout shift.</li>
          </ul>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Information Architecture (Customer Flow)</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-medium">1</span>
              <span><strong>Landing/Menu:</strong> Header (Brand), Categories (Sticky Scroll), Item Grid, Floating Cart.</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-medium">2</span>
              <span><strong>Item Detail (Drawer/Sheet):</strong> Large Image, Title/Price, Modifiers (Radio/Checkbox), Add to Cart button (sticky bottom).</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-medium">3</span>
              <span><strong>Cart/Checkout (Drawer or Page):</strong> Order Summary, Tip Selection, Total Breakdown, Apple/Google Pay integration.</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-medium">4</span>
              <span><strong>Order Status:</strong> Live updates (Received &gt; Preparing &gt; Ready).</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg">Typography System</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Sans-Serif (Inter/SF Pro):</strong> Clean, legible at small sizes. Used for all UI elements, buttons, and descriptions.<br/><br/>
            <strong>Display (Optional Serif/Grotesk):</strong> For Restaurant names and high-level section headers to add character.
          </p>
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg">Color System</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Monochrome Base:</strong> White background, gray-50 to gray-100 for subtle card backgrounds. Black for primary text.<br/><br/>
            <strong>Brand Accent:</strong> A single, customizable primary color (e.g., Stripe Blurple or Brand Orange) used for primary buttons and active states.
          </p>
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg">Interaction & Motion</h3>
          <p className="text-sm text-muted-foreground">
            <strong>Drawer vs Dialog:</strong> Use bottom sheets (drawers) on mobile for item details and cart. Use dialogs (modals) on desktop.<br/><br/>
            <strong>Spring Physics:</strong> Use `motion` for bouncy, natural-feeling interactions rather than linear easing.
          </p>
        </div>
      </div>
    </div>
  );
}
