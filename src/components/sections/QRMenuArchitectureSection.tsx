import { Separator } from "@/components/ui/separator";
import { QrCode, Grid, Search, Globe, Smartphone, Accessibility, Palette } from "lucide-react";

export function QRMenuArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Menu Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          High-performance, accessible, and customizable digital menu experience.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Menu Structure */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Core Structure
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Categories & Products</h3>
              <p className="text-sm text-muted-foreground">Hierarchical menu organization. Categories support nested sub-categories. Products feature high-res images, descriptions, and dietary labels (e.g., Vegan, Gluten-Free).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Variants & Modifiers</h3>
              <p className="text-sm text-muted-foreground">Complex product configurations. Variants define base types (e.g., Size: Small/Large). Modifiers are add-ons (e.g., Extra Cheese) with min/max selection rules and nested dependencies.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Search & Filters</h3>
              <p className="text-sm text-muted-foreground">Fuzzy text search for instant product discovery. Filters based on dietary preferences, spice levels, and allergens. Faceted search powered by Redis/Elasticsearch.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Contexts & Types */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Types & Contexts
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Table QR</h3>
              <p className="text-sm text-muted-foreground">Context-aware QR codes tied to specific tables. Enables direct "Dine-in" ordering, table-tab merging, and call-waiter functionality.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Hotel & Room Service QR</h3>
              <p className="text-sm text-muted-foreground">Tied to room numbers. Supports scheduled delivery times, service charges, and guest authentication integration.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Delivery & Pickup QR</h3>
              <p className="text-sm text-muted-foreground">Static QRs printed on marketing materials. Routes users to location-aware pickup or third-party delivery flows.</p>
            </div>
          </div>
        </div>

        {/* User Experience */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            User Experience
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Recommendations & Upsells</h3>
              <p className="text-sm text-muted-foreground">AI-driven cross-selling ("Frequently bought with") and dynamic upsells ("Make it a meal") based on cart contents and order history.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Favorites & Self Select</h3>
              <p className="text-sm text-muted-foreground">Users can mark items as favorites (stored locally or via account). "Self Select" allows users to build a custom multi-course flow or filter by their specific dietary profile.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Display Modes</h3>
              <p className="text-sm text-muted-foreground">Supports different layouts: List View (high density, text-heavy), Grid View (image-focused), and Story Mode (immersive full-screen product showcases).</p>
            </div>
          </div>
        </div>

        {/* Global & Accessibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Globalization & Compliance
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">Languages & Localization</h3>
                <p className="text-sm text-muted-foreground">Multi-lingual support with auto-detection based on browser locale. Currency formatting and dynamic tax calculations per region.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4 mr-1" />
                  Themes & Branding
                </h3>
                <p className="text-sm text-muted-foreground">White-label capability. Restaurants can customize colors, typography, logos, and button styles to match brand guidelines without writing code.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Accessibility className="h-4 w-4 mr-1" />
                  Accessibility (a11y)
                </h3>
                <p className="text-sm text-muted-foreground">WCAG 2.1 AA compliant. High contrast modes, screen reader support (ARIA labels), scalable typography, and keyboard navigable for kiosks.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2">SEO & Discovery</h3>
                <p className="text-sm text-muted-foreground">Server-Side Rendered (SSR) public menus. Structured Data (Schema.org) for Restaurant and Menu items to enable rich snippets in Google Search results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
