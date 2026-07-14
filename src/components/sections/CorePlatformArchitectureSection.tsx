import { Separator } from "@/components/ui/separator";
import { Server, Shield, Layers, Workflow, Blocks, Power, Activity, Replace, LayoutTemplate } from "lucide-react";

export function CorePlatformArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Core Platform Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The framework-independent heart of the SaaS. Enforces business rules and domain logic across Admin, Dashboard, Kiosk, API, and Mobile apps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Responsibilities & Rules */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            Responsibilities & Rules
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Shield className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Inward Dependency Rule</h3>
                <p className="text-xs text-muted-foreground mt-1">Outer layers (UI, DB) depend on Core. Core depends on NOTHING. No frameworks (Next.js, NestJS) inside Core.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Layers className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Multi-Tenancy & Domain</h3>
                <p className="text-xs text-muted-foreground mt-1">Enforces business rules (pricing, tax) and contextualizes operations strictly by Restaurant ID.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Replace className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Dependency Injection</h3>
                <p className="text-xs text-muted-foreground mt-1">External dependencies (Database, Stripe) are injected via abstract Port interfaces.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Boundaries */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Blocks className="h-5 w-5 text-emerald-500" />
              Module Boundaries
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <LayoutTemplate className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">entities & value-objects</h3>
                  <p className="text-xs text-muted-foreground mt-1">Pure domain models (Restaurant, Order) and immutable concepts (Money, GeoLocation) without persistence logic.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Workflow className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">use-cases & ports</h3>
                  <p className="text-xs text-muted-foreground mt-1">Application logic orchestrating entities, and interfaces defining external world interactions (IPaymentGateway).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flow & Lifecycle */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Power className="h-5 w-5 text-amber-500" />
            Initialization & Lifecycle
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Server className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">1. Bootstrapping</h3>
                <p className="text-xs text-muted-foreground mt-1">Host app (Next.js/Nest) starts, instantiates concrete DB/API adapters.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Activity className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">2. Core Registry</h3>
                <p className="text-xs text-muted-foreground mt-1">Host injects adapters into Core DI. Core validates compliance and emits `SystemReady`.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Power className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">3. Graceful Shutdown</h3>
                <p className="text-xs text-muted-foreground mt-1">Core intercepts termination signals and commands adapters to close connections cleanly.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
