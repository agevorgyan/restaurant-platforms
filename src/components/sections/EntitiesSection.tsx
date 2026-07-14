import { Separator } from "@/components/ui/separator";
import { 
  Building2, Store, Table2, LayoutList, Pizza, PlusCircle, 
  ShoppingCart, ListOrdered, CreditCard, Users, MapPin, 
  Ticket, Star, UserCog, Shield, KeySquare, Database, ArrowDownToLine 
} from "lucide-react";

export function EntitiesSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Domain Entities & Ownership</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The core data structures of the platform and the strict ownership rules that govern their lifecycles, cascades, and constraints.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Entities Grid */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-500" />
            Core Entities
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <EntityBadge icon={<Building2 />} name="Restaurant" desc="Tenant account" />
            <EntityBadge icon={<Store />} name="Branch" desc="Physical location" />
            <EntityBadge icon={<Table2 />} name="Table" desc="Dining spot" />
            <EntityBadge icon={<LayoutList />} name="Category" desc="Product grouping" />
            <EntityBadge icon={<Pizza />} name="Product" desc="Sellable item" />
            <EntityBadge icon={<PlusCircle />} name="Modifier" desc="Customizations" />
            <EntityBadge icon={<ShoppingCart />} name="Order" desc="Customer purchase" />
            <EntityBadge icon={<ListOrdered />} name="Order Item" desc="Product in order" />
            <EntityBadge icon={<CreditCard />} name="Payment" desc="Financial record" />
            <EntityBadge icon={<Users />} name="Customer" desc="End user" />
            <EntityBadge icon={<MapPin />} name="Address" desc="Physical location" />
            <EntityBadge icon={<Ticket />} name="Coupon" desc="Discount rule" />
            <EntityBadge icon={<Star />} name="Review" desc="Customer feedback" />
            <EntityBadge icon={<UserCog />} name="Employee" desc="Staff member" />
            <EntityBadge icon={<Shield />} name="Role" desc="Permission set" />
            <EntityBadge icon={<KeySquare />} name="Permission" desc="Granular access" />
          </div>
        </div>

        {/* Rules Concept */}
        <div className="space-y-6 md:col-span-12 lg:col-span-4">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5 text-emerald-500" />
              Ownership Rules
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                In Domain-Driven Design, entity ownership defines the lifecycle. An "owned" entity cannot exist without its parent.
              </p>
              <p>
                Ownership dictates database cascades (e.g., deleting an Order automatically deletes its Order Items) and helps enforce strict transactional boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Specific Rules */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Lifecycle Boundaries
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 text-indigo-500 mb-1">
                <Building2 className="h-5 w-5" />
                <h3 className="font-bold text-sm text-foreground">Restaurant Ownership</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns</p>
              <p className="text-xs">Branches, Categories, Products, Modifiers, Coupons, Roles, Employees (Global).</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 leading-relaxed">
                <strong>Rule:</strong> Deleting a Restaurant cascades to all owned entities. They cannot exist orphaned.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <Store className="h-5 w-5" />
                <h3 className="font-bold text-sm text-foreground">Branch Ownership</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns</p>
              <p className="text-xs">Tables, Orders, Payments, Employees (Local).</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-relaxed">
                <strong>Rule:</strong> Tables are strictly bound to a Branch. Orders belong to the Branch where fulfilled.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 text-purple-500 mb-1">
                <ShoppingCart className="h-5 w-5" />
                <h3 className="font-bold text-sm text-foreground">Order Ownership</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns</p>
              <p className="text-xs">Order Items, Payments.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-purple-600 dark:text-purple-400 leading-relaxed">
                <strong>Rule:</strong> Order Items have no meaning outside their parent Order. Payments are strictly bound to Order lifecycle.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 text-rose-500 mb-1">
                <Users className="h-5 w-5" />
                <h3 className="font-bold text-sm text-foreground">Customer Ownership</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns</p>
              <p className="text-xs">Addresses, Reviews.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-relaxed">
                <strong>Rule:</strong> An Address is part of the Customer profile. Reviews are authored by Customers.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Pizza className="h-5 w-5" />
                <h3 className="font-bold text-sm text-foreground">Catalog Ownership</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns</p>
              <p className="text-xs">Shared lifecycle between Categories and Products.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed">
                <strong>Rule:</strong> Deleting a Category does not delete the Product, but deleting a Product removes it from all Categories.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 text-cyan-500 mb-1">
                <Shield className="h-5 w-5" />
                <h3 className="font-bold text-sm text-foreground">IAM Ownership</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns</p>
              <p className="text-xs">Roles own Permissions. Employees own Roles.</p>
              <Separator className="my-1" />
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400 leading-relaxed">
                <strong>Rule:</strong> Permissions are global constants. Roles are tenant-specific.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function EntityBadge({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </div>
        <span className="font-semibold text-sm">{name}</span>
      </div>
      <span className="text-[10px] text-muted-foreground truncate">{desc}</span>
    </div>
  );
}
