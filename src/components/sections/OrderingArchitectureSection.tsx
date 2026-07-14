import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChefHat, CreditCard, Bell, Truck, Utensils } from "lucide-react";

export function OrderingArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordering & Fulfillment</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          End-to-end lifecycle from cart to kitchen display, payments, and notifications.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cart & Checkout */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart & Checkout
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Stateful Cart</h3>
              <p className="text-sm text-muted-foreground">Persists across sessions using Redis. Handles complex modifier validation, stock checks, and minimum order requirements in real-time.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Coupons & Discounts</h3>
              <p className="text-sm text-muted-foreground">Dynamic pricing engine. Supports percentage-based, fixed-amount discounts, BOGO offers, and time-restricted promotional codes.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Tax Computation</h3>
              <p className="text-sm text-muted-foreground">Multi-region tax engine. Calculates complex tax rates based on order type (Dine-in vs Takeaway), specific item categories (e.g., Alcohol), and location.</p>
            </div>
          </div>
        </div>

        {/* Order Types */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Fulfillment Modes
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Table Orders (Dine-In)</h3>
              <p className="text-sm text-muted-foreground">Tied to a specific table. Supports open tabs, split bills, and course sequencing (e.g., "Starters first, Mains later").</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Pickup (Takeaway)</h3>
              <p className="text-sm text-muted-foreground">Scheduled or ASAP pickup. Calculates estimated prep time based on current kitchen load. Alerts staff upon customer arrival.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Delivery</h3>
              <p className="text-sm text-muted-foreground">Manages delivery zones (polygons) and dynamic fee calculation. Integrates with third-party logistics APIs (e.g., DoorDash Drive, Stuart) or internal driver fleets.</p>
            </div>
          </div>
        </div>

        {/* Kitchen & Real-time */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Kitchen & Real-time (KDS)
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Kitchen Display System (KDS)</h3>
              <p className="text-sm text-muted-foreground">Tablet-optimized view for chefs. Splits orders by prep station (e.g., Grill vs. Drinks). Color-codes orders based on waiting time.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">WebSockets</h3>
              <p className="text-sm text-muted-foreground">Bi-directional event streaming using Socket.io or natively over WebSockets. Pushes new orders instantly to the KDS and POS without polling.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Status Lifecycle</h3>
              <p className="text-sm text-muted-foreground">Strict state machine: `Pending` → `Accepted` → `Preparing` → `Ready` → `Completed`. Emits events at each transition to trigger notifications.</p>
            </div>
          </div>
        </div>

        {/* Payments & Financials */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Financials & Operations
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Payments Processing</h3>
              <p className="text-sm text-muted-foreground">Stripe Connect integration for multi-party routing. Handles Apple Pay, Google Pay, and physical terminal integrations (Stripe Terminal).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Invoices & Receipts</h3>
              <p className="text-sm text-muted-foreground">Generates PDF tax invoices compliant with regional authorities. Sends automated email receipts using SendGrid or Postmark.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 mr-1" />
                Notifications
              </h3>
              <p className="text-sm text-muted-foreground">Omnichannel alerts. Sends order confirmation via Email, status updates via SMS (Twilio), and push notifications to staff apps via Firebase (FCM).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
