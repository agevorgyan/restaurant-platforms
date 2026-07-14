import { Separator } from "@/components/ui/separator";
import { 
  Building2, Menu as MenuIcon, ShoppingCart, Users, CreditCard, 
  Package, CalendarCheck, Receipt, Repeat, Bell, 
  Database, ArrowRightLeft, ShieldAlert, Network 
} from "lucide-react";

export function AggregateRootsSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aggregate Roots</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The core clusters of domain objects treated as single units for data changes, enforcing strict transactional boundaries.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Transactional Boundaries */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5 text-indigo-500" />
            Transactional Boundaries
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-rose-500/5 border-rose-500/20">
              <Database className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-rose-700 dark:text-rose-400">Strict Isolation</h3>
                <p className="text-xs text-muted-foreground mt-1">A single database transaction must <strong>only</strong> modify a single Aggregate Root. Modifying multiple ARs in one transaction tightly couples domains.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
              <ArrowRightLeft className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-700 dark:text-amber-400">Eventual Consistency</h3>
                <p className="text-xs text-muted-foreground mt-1">Cross-aggregate updates are handled via Domain Events (e.g., `OrderPlaced` event triggers `Inventory` stock depletion asynchronously).</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <ShieldAlert className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Enforcing Invariants</h3>
                <p className="text-xs text-muted-foreground mt-1">The AR is fully responsible for enforcing its internal business rules (e.g., an Order ensures total price matches line items + taxes).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Roots Grid */}
        <div className="space-y-6 md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Defined Aggregate Roots
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-sm">Restaurant</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates operating hours, tables, and settings.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Cannot activate without valid TZ and hours.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <MenuIcon className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-sm">Menu</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates Categories, Items, and Modifier Groups.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Mod group `min_selection` cannot exceed available modifiers.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
                <h3 className="font-bold text-sm">Order</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates Lines, Taxes, Discounts, and Fulfillment.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Cannot accept without fully funded Payment Intent.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-pink-500" />
                <h3 className="font-bold text-sm">Customer</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates contact info, preferences, and points.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Points ledger cannot drop below zero.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-teal-500" />
                <h3 className="font-bold text-sm">Payment</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates Intents, Transactions, and Refunds.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Total refunds cannot exceed original captured amount.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-sm">Inventory</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates Ingredients, Recipes, and Stock Movements.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Stock level must strictly match sum of all movements.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-sm">Reservation</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates timeframe, party size, and assigned tables.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Cannot assign overlapping time slots to same table.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-sm">Invoice</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates SaaS billing lines and payment status.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Once finalized, invoice becomes immutable.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-cyan-500" />
                <h3 className="font-bold text-sm">Subscription</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates active tier, cycle, and feature entitlements.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Tenant cannot have multiple concurrent active subscriptions.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-rose-500" />
                <h3 className="font-bold text-sm">Notification</h3>
              </div>
              <p className="text-xs text-muted-foreground">Encapsulates message payload, channels, and status.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Invariant:</strong> Can only be dispatched successfully once.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
