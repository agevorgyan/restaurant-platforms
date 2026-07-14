import { Separator } from "@/components/ui/separator";
import { 
  ShieldAlert, Activity, ArrowRightLeft, Layers, 
  Database, Network, Zap, CheckCircle2, AlertTriangle, 
  DatabaseBackup, Workflow, Eye, RefreshCw, XCircle
} from "lucide-react";

export function DomainArchReviewSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Domain Architecture Review</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Identification of future scalability bottlenecks, tight coupling risks, and the enterprise-grade patterns required to resolve them.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Anti-Pattern 1 */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-rose-500" />
            1. The "God Aggregate" Risk
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex gap-3 text-sm">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-semibold text-rose-700 dark:text-rose-400">Anti-Pattern</p>
                <p className="text-muted-foreground mt-1">
                  The <code>Restaurant</code> aggregate physically holds collections of all its Branches, Employees, and Products. Loading the Restaurant consumes massive memory and causes severe lock contention.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">Enterprise Fix: Strict ID-Only References</p>
                <p className="text-muted-foreground mt-1">
                  Aggregates must <strong>NEVER</strong> hold object references to other Aggregate Roots. They must only hold the ID (e.g., <code>restaurant_id</code>). A Product belongs to a Restaurant via its foreign key, keeping the Restaurant aggregate small and fast.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Pattern 2 */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            2. The Dual-Write Problem
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex gap-3 text-sm">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-semibold text-rose-700 dark:text-rose-400">Anti-Pattern (Event Loss)</p>
                <p className="text-muted-foreground mt-1">
                  Saving to the DB and publishing a Domain Event to Kafka sequentially. If the DB commits but Kafka fails, the system is left permanently inconsistent.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">Enterprise Fix: Transactional Outbox + CDC</p>
                <p className="text-muted-foreground mt-1">
                  Domain events are written to an <code>outbox_events</code> table in the <strong>same database transaction</strong> as the mutation. A Change Data Capture (CDC) process (e.g., Debezium) tails the WAL to reliably push events to Kafka.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Pattern 3 */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-500" />
            3. Synchronous Inter-Context Coupling
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex gap-3 text-sm">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-semibold text-rose-700 dark:text-rose-400">Anti-Pattern (Cascading Failures)</p>
                <p className="text-muted-foreground mt-1">
                  The Ordering context makes synchronous HTTP/gRPC calls to the Identity context for customer data. If Identity is down, Ordering fails.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">Enterprise Fix: Local Read Projections</p>
                <p className="text-muted-foreground mt-1">
                  Bounded Contexts must be autonomous. Ordering must listen to <code>CustomerUpdated</code> events and keep a read-only, local projection of necessary customer data within its own database schema.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Pattern 4 */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-500" />
            4. Eventual Consistency UX Degradation
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex gap-3 text-sm">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-semibold text-rose-700 dark:text-rose-400">Anti-Pattern (Missing Data)</p>
                <p className="text-muted-foreground mt-1">
                  With CQRS, a user places an order, the page refreshes, and the order is missing because the Read Model hasn't updated yet.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">Enterprise Fix: Optimistic UI & WebSockets</p>
                <p className="text-muted-foreground mt-1">
                  The frontend applies optimistic state mutations immediately. It subscribes to a WebSocket channel with the transaction's <code>Correlation ID</code>. The backend pushes a confirmation event to finalize the UI state.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
