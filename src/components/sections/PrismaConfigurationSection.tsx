import { Separator } from "@/components/ui/separator";
import { 
  Database, Server, Layers, ShieldCheck, 
  Activity, Zap, Key, Link as LinkIcon
} from "lucide-react";

export function PrismaConfigurationSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prisma ORM Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Centralized data access layer providing strongly typed database interactions, repository abstraction, and robust tenant isolation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Schema Design */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-7 border-blue-500/20">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Schema Design
          </h2>
          
          <div className="space-y-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-blue-500/5">
              <ShieldCheck className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400">Strict Tenant Isolation</h3>
                <p className="text-xs text-muted-foreground mt-1">Multi-tenant architecture with a shared database. The <code>Tenant</code> model is the absolute root, and all data mutations validate against the tenant context.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Key className="h-6 w-6 text-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">UUID Primary Keys</h3>
                <p className="text-xs text-muted-foreground mt-1">UUIDs obscure sequential data, prevent enumeration attacks, and enable decentralized, collision-free ID generation.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <LinkIcon className="h-6 w-6 text-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Cascading Deletes</h3>
                <p className="text-xs text-muted-foreground mt-1"><code>onDelete: Cascade</code> is configured at the DB level for entity graphs, maintaining referential integrity automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Repository Pattern */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-5 border-emerald-500/20">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-500" />
            Repository Pattern
          </h2>
          
          <div className="space-y-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-emerald-500/5">
              <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Data Access Objects (DAOs)</h3>
              <Separator className="my-1 bg-emerald-500/20" />
              <p className="text-xs text-muted-foreground">Concrete repositories (<code>UserRepository</code>) wrap Prisma calls. This provides a clean API and prevents leaking the ORM directly into business logic.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <h3 className="font-bold text-sm text-foreground">Singleton Client</h3>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground"><code>PrismaClient</code> is instantiated as a singleton to prevent connection exhaustion during HMR and serverless execution.</p>
            </div>
          </div>
        </div>

        {/* Infrastructure Integrations */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-purple-500" />
            Infrastructure Integrations
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-500" />
                <h3 className="font-bold text-sm text-foreground">Health Probes</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">An explicit <code>$queryRaw</code> ping validates actual query execution capability, powering Docker and Kubernetes readiness probes.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-sm text-foreground">Idempotent Seeding</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">A robust seeding script uses <code>upsert</code> to provision a baseline Tenant, Admin User, and sample Products immediately after migrations.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
