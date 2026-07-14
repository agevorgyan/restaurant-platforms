import { Separator } from "@/components/ui/separator";
import { 
  Database, DatabaseBackup, ArrowLeftRight, Zap, 
  Search, Filter, ArrowDownUp, Layers, HardDrive,
  SplitSquareHorizontal, FileJson, ListFilter
} from "lucide-react";

export function RepositoryArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Repository Architecture & Standards</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Strict standards for data access, separating reads from writes, managing transactions, and ensuring scalable querying.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* CQRS Separation */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <SplitSquareHorizontal className="h-5 w-5 text-indigo-500" />
            CQRS Separation
          </h2>
          
          <div className="space-y-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-rose-500/5 border-rose-500/20">
              <Database className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-rose-700 dark:text-rose-400">Write Repositories (Commands)</h3>
                <p className="text-xs text-muted-foreground mt-1">Responsible purely for state mutations. Loads full Aggregate Roots from the primary database to enforce invariants and apply changes.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <DatabaseBackup className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Read Repositories (Queries)</h3>
                <p className="text-xs text-muted-foreground mt-1">Bypasses heavy Aggregate hydration. Queries directly into optimized DTOs from Read Replicas, Caches, or Search Indices.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions & Caching */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          
          <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <ArrowLeftRight className="h-5 w-5 text-amber-500" />
              Transactions
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" /><strong>Unit of Work:</strong> Repositories do not manage transactions internally. Handled at the Use Case level.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" /><strong>Single Aggregate Rule:</strong> One transaction = one mutated Aggregate Root.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" /><strong>Outbox Pattern:</strong> Mutations and resulting Domain Events are saved atomically.</li>
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-purple-500" />
              Caching Strategy
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /><strong>Read-Through:</strong> Implemented for highly requested, static aggregates (e.g., Menus).</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /><strong>Event-Driven Invalidation:</strong> Domain Events strictly control cache purges.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /><strong>Stale-While-Revalidate:</strong> Fast reads with asynchronous background rehydration.</li>
            </ul>
          </div>

        </div>

        {/* Querying Standards */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-blue-500" />
            Querying Standards
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Layers className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-sm text-foreground">Pagination</h3>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">Standardized on <strong>Cursor-based</strong> pagination for deep scrolling and performance. Offset pagination strictly limited to small bounded lists.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Filter className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm text-foreground">Filtering</h3>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">Criteria passed via generic <code>Specification</code> objects to prevent repository bloat (e.g., hundreds of <code>findBy...</code> methods).</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <ArrowDownUp className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-sm text-foreground">Sorting</h3>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">Explicitly whitelisted fields only to prevent index misses. Multi-column sorting restricted to pre-indexed combinations.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Search className="h-5 w-5 text-rose-500" />
              <h3 className="font-bold text-sm text-foreground">Searching</h3>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">No SQL <code>LIKE</code> clauses for full-text. Search queries routed to dedicated search engines (Elasticsearch) synced via Domain Events.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
