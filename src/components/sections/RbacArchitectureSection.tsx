import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Users, Key, Target, Layers, Network, Lock, FileKey } from "lucide-react";

export function RbacArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enterprise RBAC Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Secure, flexible, and granular permission system designed to scale from simple roles to complex organizational hierarchies, with future ABAC support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Concepts */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Key className="h-5 w-5 text-indigo-500" />
            Core Concepts
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <FileKey className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Permissions</h3>
                <p className="text-xs text-muted-foreground mt-1">Granular access rights (e.g., `orders:read`). Immutable strings representing actions on resources.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Users className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Roles</h3>
                <p className="text-xs text-muted-foreground mt-1">Named collections of permissions (e.g., `Manager`, `Cashier`). Assigned to users.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Target className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Scopes</h3>
                <p className="text-xs text-muted-foreground mt-1">Boundaries for roles. A user can be `Manager` at Restaurant A, but `Viewer` at Tenant level.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ShieldCheck className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Policies</h3>
                <p className="text-xs text-muted-foreground mt-1">Rules aggregating Roles and Scopes. Binds a User to a Role within a specific Scope.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Future ABAC */}
        <div className="space-y-6 md:col-span-12 lg:col-span-4">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-rose-500" />
              Future ABAC Support
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Network className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Attribute-Based Control</h3>
                  <p className="text-xs text-muted-foreground mt-1">Engine accepts a Context object. Future policies can include conditions (e.g., allow refund ONLY IF amount &lt; $50).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inheritance */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-500" />
            Inheritance & Hierarchy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Users className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Role Inheritance</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Roles inherit permissions from other roles (e.g., `Manager` inherits `Staff` permissions). Reduces duplication.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Target className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Scope Inheritance</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Permissions at a higher scope (Tenant) cascade down to child scopes (Restaurants), unless overridden.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
