import { Separator } from "@/components/ui/separator";
import { Globe, Languages, Coins, Clock, CalendarDays, ArrowLeftRight, MessagesSquare, Users, Building, AlertCircle } from "lucide-react";

export function LocalizationArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Localization Architecture (i18n)</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ensures global accessibility by supporting diverse languages, regional formats, RTL layouts, and contextual translations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Concepts */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Languages className="h-5 w-5 text-indigo-500" />
            Core Language Features
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <MessagesSquare className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Translation Keys & Pluralization</h3>
                <p className="text-xs text-muted-foreground mt-1">No hardcoded text. Nested keys (`checkout.button`). Full ICU pluralization support.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <AlertCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Fallback Strategy</h3>
                <p className="text-xs text-muted-foreground mt-1">Graceful fallback to the default language (English) if a translation key is missing.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ArrowLeftRight className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">RTL Ready</h3>
                <p className="text-xs text-muted-foreground mt-1">UI framework and Tailwind CSS configured for dynamic Right-to-Left language support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Formatting */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-500" />
              Regional Formatting
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Coins className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Currencies</h3>
                  <p className="text-xs text-muted-foreground mt-1">Stored as cents. Formatted on client based on locale and Restaurant currency.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Clock className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Time Zones</h3>
                  <p className="text-xs text-muted-foreground mt-1">Backend uses UTC. Converted to Restaurant TZ for reports, or Customer TZ for tracking.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <CalendarDays className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Date Formats</h3>
                  <p className="text-xs text-muted-foreground mt-1">Formatted according to locale standards (e.g., DD/MM/YYYY vs MM/DD/YYYY).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual Languages */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Contextual Languages
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Building className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Restaurant Languages</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Default language set by the tenant. Used for staff UI, Kitchen Display Systems (KDS), and admin dashboards.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Users className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Customer Languages</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Resolved via `Accept-Language` or manual switch. Storefronts are translated, while kitchen tickets remain in the Restaurant's language.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
