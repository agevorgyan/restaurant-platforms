import { Separator } from "@/components/ui/separator";
import { 
  Database, Server, Search, History, ShieldCheck, 
  Trash2, Zap, Layers, Activity, FileJson, Key,
  Lock, ArrowUpRight, CopyCheck
} from "lucide-react";

export function DatabaseStrategySection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Strategy & Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Balancing strict data integrity with high-performance querying, historical auditing, and scalable search architectures.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Architecture */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-7">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-500" />
            Core Relational Architecture
          </h2>
          
          <div className="space-y-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Layers className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Normalization (3NF) & Strategic Denormalization</h3>
                <p className="text-xs text-muted-foreground mt-1">OLTP DB is strictly normalized (3NF). We selectively denormalize into JSONB <strong>only</strong> for immutable snapshotting (e.g., locking prices inside historical orders).</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Tenant Isolation (RLS)</h3>
                <p className="text-xs text-muted-foreground mt-1">Every tenant table has a <code>tenant_id</code>. Row-Level Security (RLS) is strictly enforced at the database level to prevent data leaks.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Key className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Indexing & UUIDv7</h3>
                <p className="text-xs text-muted-foreground mt-1">Primary keys use UUIDv7 for lexicographical sorting to reduce index fragmentation. Extensive use of Composite and Partial indexes for frequent queries.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Lifecycle */}
        <div className="space-y-6 md:col-span-12 lg:col-span-5">
          <div className="rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-rose-500" />
              Data Lifecycle
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2 p-4 rounded-lg border bg-rose-500/5 border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <Trash2 className="h-4 w-4" />
                  <h3 className="font-bold text-sm">Soft Deletes</h3>
                </div>
                <p className="text-xs text-muted-foreground">Hard deletes (<code>DELETE</code>) are strictly forbidden for domain entities to preserve audit trails. We use <code>deleted_at</code> timestamps and filtered partial indexes.</p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-lg border bg-purple-500/5 border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Lock className="h-4 w-4" />
                  <h3 className="font-bold text-sm">Optimistic Concurrency (Versioning)</h3>
                </div>
                <p className="text-xs text-muted-foreground">High-contention entities (Inventory, Orders) use a <code>version</code> column. Updates fail if versions mismatch, preventing lost updates without heavy row locking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Storage */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            Specialized Architectures
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-sm text-foreground">Audit & History</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground mb-2">DB-level triggers record all mutations to append-only <code>audit_logs</code>.</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400"><strong>Event Sourcing:</strong> Critical aggregates (Ledgers, Inventory) append immutable domain events rather than mutating state in-place.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-foreground">Search Engine</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground mb-2">Offloading complex text search from PostgreSQL to Elasticsearch or Typesense.</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400"><strong>Sync:</strong> Kept eventually consistent via Domain Events consumed by background workers.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-sm text-foreground">Caching</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground mb-2">Multi-tier: L1 (In-Memory) for static config, L2 (Redis) for session and materialized read models.</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400"><strong>Stampede Prevention:</strong> Utilizes probabilistic early expiration (XFetch) to regenerate keys safely.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
