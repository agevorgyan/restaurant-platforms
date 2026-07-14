import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Key, Link2 } from "lucide-react";

export function DatabaseArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Production-ready multi-tenant PostgreSQL schema (Prisma-optimized).
        </p>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm overflow-x-auto">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Entity Relationship Diagram (Mermaid)
        </h2>
        <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
          {`erDiagram
    %% Core SaaS / Identity
    RESTAURANT ||--o{ BRANCH : "has many"
    RESTAURANT ||--o{ USER : "employs"
    RESTAURANT ||--|| SUBSCRIPTION : "has one"
    RESTAURANT ||--o{ CUSTOMER : "serves"
    RESTAURANT ||--o{ MEDIA : "owns"
    USER }|--|{ ROLE : "assigned"
    ROLE }|--|{ PERMISSION : "contains"
    
    %% Branch & Physical
    BRANCH ||--o{ TABLE : "contains"
    BRANCH ||--o{ MENU : "serves"
    BRANCH ||--o{ TAX : "applies"
    BRANCH }|--|{ LANGUAGE : "supports"
    BRANCH }|--|{ CURRENCY : "accepts"

    %% Catalog / Menu
    MENU ||--o{ CATEGORY : "contains"
    CATEGORY ||--o{ PRODUCT : "contains"
    PRODUCT ||--o{ MODIFIER_GROUP : "has"
    MODIFIER_GROUP ||--o{ MODIFIER : "contains"

    %% Ordering
    CUSTOMER ||--o{ ORDER : "places"
    BRANCH ||--o{ ORDER : "receives"
    TABLE ||--o{ ORDER : "hosts"
    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER_ITEM ||--o{ ORDER_MODIFIER : "includes"
    ORDER ||--|| PAYMENT : "processed via"
    ORDER ||--o{ COUPON : "can apply"

    %% System
    RESTAURANT ||--o{ AUDIT_LOG : "generates"
    BRANCH ||--o{ ANALYTICS : "tracks"`}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Core Tenancy & Identity</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="outline">Restaurant</Badge></h3>
              <p className="text-sm text-muted-foreground">The root tenant. All data (except super-admin) is scoped to a Restaurant ID. Represents the legal business entity.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="outline">Branch (Location)</Badge></h3>
              <p className="text-sm text-muted-foreground">Physical locations. Has specific business hours, taxes, supported currencies, and active menus.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="outline">Users, Roles & Permissions</Badge></h3>
              <p className="text-sm text-muted-foreground">RBAC system. Staff, Managers, and Owners. Roles are linked to granular permissions (e.g., `refund:create`, `menu:edit`).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="outline">Subscription</Badge></h3>
              <p className="text-sm text-muted-foreground">Stripe-linked SaaS billing state (Tier, Status, Stripe Customer ID) for the Restaurant.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Menu & Catalog</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="secondary">Menus & Categories</Badge></h3>
              <p className="text-sm text-muted-foreground">Menus (e.g., "Breakfast", "Dinner") belong to Branches. Menus have hierarchical Categories.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="secondary">Products</Badge></h3>
              <p className="text-sm text-muted-foreground">Base food items. Includes prices, descriptions, allergy tags, and links to Media.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="secondary">Modifiers & Groups</Badge></h3>
              <p className="text-sm text-muted-foreground">Nested options (e.g., Group: "Meat Temp" -&gt; Modifiers: "Rare", "Medium"). Enforces min/max selection logic.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Transactions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge className="bg-emerald-500 hover:bg-emerald-600">Orders & Items</Badge></h3>
              <p className="text-sm text-muted-foreground">Tracks order lifecycle (Draft, Paid, Preparing, Completed). Contains JSON snapshots of items at time of purchase to prevent historical data corruption if menu changes.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge className="bg-emerald-500 hover:bg-emerald-600">Payments</Badge></h3>
              <p className="text-sm text-muted-foreground">Stripe Payment Intents, Refunds, and breakdown of tips/taxes.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge className="bg-emerald-500 hover:bg-emerald-600">Coupons & Tables</Badge></h3>
              <p className="text-sm text-muted-foreground">QR mapping to Tables. Discount logic applied at the Order level.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">System & Cross-Cutting</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="outline">Media</Badge></h3>
              <p className="text-sm text-muted-foreground">Central registry of all Cloudflare R2 bucket URLs (Images/Videos) used by products or restaurant branding.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="outline">Audit Logs</Badge></h3>
              <p className="text-sm text-muted-foreground">Immutable ledger tracking `actor_id`, `action`, `target_resource`, and `timestamp` for compliance.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Badge variant="outline">Analytics</Badge></h3>
              <p className="text-sm text-muted-foreground">Pre-aggregated materialized views/tables for fast dashboard loading (e.g., Daily Revenue, Top Items).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Separator() {
  return <div className="h-px bg-border w-full" />;
}
