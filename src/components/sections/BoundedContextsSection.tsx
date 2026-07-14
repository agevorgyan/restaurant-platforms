import { Separator } from "@/components/ui/separator";
import { 
  Building2, QrCode, ShoppingCart, ChefHat, 
  Package, Users, CreditCard, BrainCircuit, 
  Bell, FileText, ArrowRight, ShieldCheck, 
  Map, History, Code2, Database, LayoutTemplate 
} from "lucide-react";
import { ReactNode } from "react";

export function BoundedContextsSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bounded Contexts (DDD)</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The 16 core platform capabilities are grouped into 10 highly cohesive, loosely coupled Domain-Driven Design (DDD) Bounded Contexts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Context 1 */}
        <ContextCard
          icon={<ShieldCheck className="h-6 w-6 text-indigo-500" />}
          title="Identity & Access (IAM)"
          responsibilities="Authentication, RBAC, tenant resolution, user profiles."
          entities={["User", "Role", "Permission", "Session"]}
          events={["UserRegistered", "UserLoggedOut", "RoleAssigned"]}
          api={["POST /auth/login", "GET /users/me", "PUT /users/{id}/roles"]}
          dependencies="None"
          rules="A user can belong to multiple tenants. Passwords never stored in plaintext."
          scalability="Move to external IDP (Auth0) or stateless microservice for global scale."
        />

        {/* Context 2 */}
        <ContextCard
          icon={<Building2 className="h-6 w-6 text-blue-500" />}
          title="Tenant & Billing"
          responsibilities="Restaurant management, tables, SaaS subscriptions."
          entities={["Tenant", "Location", "Table", "Subscription", "Invoice"]}
          events={["TenantCreated", "LocationOpened", "SubscriptionRenewed"]}
          api={["GET /locations", "POST /locations/{id}/tables", "PUT /billing/subscription"]}
          dependencies="Identity, Payments"
          rules="A location cannot accept orders without an active subscription."
          scalability="Geo-partitioning tenant data by region for latency and compliance."
        />

        {/* Context 3 */}
        <ContextCard
          icon={<QrCode className="h-6 w-6 text-emerald-500" />}
          title="Catalog & Menus"
          responsibilities="Menu items, QR codes, pricing, modifiers, allergens."
          entities={["Category", "MenuItem", "ModifierGroup", "PriceTier", "QRCode"]}
          events={["MenuItemCreated", "PriceUpdated", "MenuPublished"]}
          api={["GET /catalog/menus", "POST /catalog/items", "PUT /catalog/modifiers"]}
          dependencies="Tenant"
          rules="Prices vary by location. Modifiers respect min/max cardinality rules."
          scalability="Aggressive CDN edge-caching for massive read-heavy QR menu traffic."
        />

        {/* Context 4 */}
        <ContextCard
          icon={<ShoppingCart className="h-6 w-6 text-purple-500" />}
          title="Ordering & POS"
          responsibilities="Cart, order creation, POS sessions, discounting, taxes."
          entities={["Order", "OrderLine", "Cart", "PosSession", "TaxRule"]}
          events={["OrderPlaced", "OrderUpdated", "OrderCanceled"]}
          api={["POST /orders", "GET /orders/{id}", "POST /pos/sessions/start"]}
          dependencies="Catalog, Payments, Guest"
          rules="Online orders require a valid payment intent. Taxes based on location."
          scalability="Event Sourcing for Orders to handle complex concurrent state transitions."
        />

        {/* Context 5 */}
        <ContextCard
          icon={<ChefHat className="h-6 w-6 text-rose-500" />}
          title="Fulfillment (KDS)"
          responsibilities="Order routing to stations, prep times, ticket management."
          entities={["Ticket", "Station", "PrepTask"]}
          events={["TicketRouted", "TicketStarted", "TicketCompleted"]}
          api={["GET /kds/tickets", "POST /kds/tickets/{id}/bump"]}
          dependencies="Ordering"
          rules="Tickets routed to correct prep station based on item tags (e.g., Grill)."
          scalability="Redis Pub/Sub WebSocket backplane for real-time sync across iPads."
        />

        {/* Context 6 */}
        <ContextCard
          icon={<Package className="h-6 w-6 text-amber-500" />}
          title="Inventory"
          responsibilities="Stock levels, recipes (BOM), purchase orders, suppliers."
          entities={["Ingredient", "Recipe", "StockMovement", "Supplier", "PurchaseOrder"]}
          events={["StockDepleted", "POReceived", "RecipeUpdated"]}
          api={["GET /inventory/stock", "POST /inventory/movements", "POST /inventory/pos"]}
          dependencies="Fulfillment, Catalog"
          rules="Stock cannot fall below zero unless explicitly allowed by location."
          scalability="Eventual consistency for stock depletion to avoid locking during peak hours."
        />

        {/* Context 7 */}
        <ContextCard
          icon={<Users className="h-6 w-6 text-pink-500" />}
          title="Guest Experience (CRM)"
          responsibilities="Profiles, history, loyalty points, table bookings."
          entities={["Guest", "Reward", "PointsLedger", "Reservation"]}
          events={["GuestCreated", "PointsEarned", "ReservationConfirmed"]}
          api={["GET /crm/guests", "POST /loyalty/redeem", "POST /reservations"]}
          dependencies="Ordering, Tenant"
          rules="Reservations check capacity in Tenant context. Points expire per tenant."
          scalability="Graph databases for guest relationships and recommendation engines."
        />

        {/* Context 8 */}
        <ContextCard
          icon={<CreditCard className="h-6 w-6 text-teal-500" />}
          title="Financials & Payments"
          responsibilities="Gateways, refunds, tipping, payouts, ledgers."
          entities={["PaymentIntent", "Transaction", "Refund", "Payout"]}
          events={["PaymentSucceeded", "RefundIssued", "PayoutProcessed"]}
          api={["POST /payments/intent", "POST /payments/refund"]}
          dependencies="Ordering"
          rules="Refunds cannot exceed original amount. All actions must be idempotent."
          scalability="Idempotency keys enforced at API gateway to prevent double-charging."
        />

        {/* Context 9 */}
        <ContextCard
          icon={<BrainCircuit className="h-6 w-6 text-cyan-500" />}
          title="Intelligence (AI & Analytics)"
          responsibilities="Metrics, reporting, ML inference, demand prediction."
          entities={["AnalyticsReport", "Metric", "AiPrompt", "DemandForecast"]}
          events={["ReportGenerated", "ForecastCompleted"]}
          api={["GET /analytics/sales", "POST /ai/predict-demand"]}
          dependencies="All (as event consumer)"
          rules="Analytics are read-only. AI predictions are asynchronous."
          scalability="Dedicated OLAP clusters (ClickHouse); Serverless GPU inference."
        />

        {/* Context 10 */}
        <ContextCard
          icon={<Bell className="h-6 w-6 text-orange-500" />}
          title="Platform Foundation"
          responsibilities="Emails, SMS, webhooks, media asset storage."
          entities={["NotificationEvent", "WebhookEndpoint", "Asset"]}
          events={["NotificationSent", "AssetUploaded", "WebhookFired"]}
          api={["POST /notifications/send", "POST /assets/upload"]}
          dependencies="None"
          rules="All uploaded files must be scanned for malware."
          scalability="Decoupled message queues (BullMQ) for guaranteed notification delivery."
        />

      </div>
    </div>
  );
}

function ContextCard({ 
  icon, title, responsibilities, entities, events, api, dependencies, rules, scalability 
}: { 
  icon: ReactNode, title: string, responsibilities: string, entities: string[], events: string[], api: string[], dependencies: string, rules: string, scalability: string 
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col space-y-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-muted rounded-lg shrink-0">
          {icon}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="flex-1 space-y-4 text-sm">
        <div>
          <span className="font-semibold text-foreground block mb-1">Responsibilities</span>
          <p className="text-muted-foreground leading-relaxed">{responsibilities}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold text-foreground block mb-1">Owned Entities</span>
            <ul className="text-muted-foreground list-disc list-inside space-y-0.5">
              {entities.map(e => <li key={e}>{e}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-foreground block mb-1">Key Events</span>
            <ul className="text-muted-foreground list-disc list-inside space-y-0.5">
              {events.map(e => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <span className="font-semibold text-foreground block mb-1">Public API Examples</span>
          <div className="flex flex-wrap gap-2">
            {api.map(a => (
              <span key={a} className="bg-muted px-2 py-1 rounded font-mono text-[10px] text-muted-foreground">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="font-semibold text-foreground block mb-1">Dependencies</span>
          <p className="text-muted-foreground">{dependencies}</p>
        </div>

        <div className="pt-2 border-t space-y-3">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
            <span className="font-semibold text-orange-700 dark:text-orange-400 block mb-1 text-xs uppercase tracking-wider">Business Rules</span>
            <p className="text-orange-800/80 dark:text-orange-200/80 leading-relaxed text-xs">{rules}</p>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1 text-xs uppercase tracking-wider">Future Scalability</span>
            <p className="text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed text-xs">{scalability}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
