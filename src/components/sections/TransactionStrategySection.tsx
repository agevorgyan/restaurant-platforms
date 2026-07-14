import { Separator } from "@/components/ui/separator";
import { 
  Database, RefreshCw, Network, ShieldAlert, 
  RotateCcw, Repeat, Lock, Zap, ServerOff, CheckSquare,
  ArrowRightLeft, AlertTriangle
} from "lucide-react";

export function TransactionStrategySection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction Strategy & Standards</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Balancing strong consistency within boundaries and eventual consistency across them, fortified by resilient failure handling and idempotency.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Consistency Models */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6 border-indigo-500/20">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-indigo-500" />
            Consistency Models
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-indigo-500/5">
              <Lock className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-indigo-700 dark:text-indigo-400">Strong Consistency</h3>
                <p className="text-xs text-muted-foreground mt-1">Applied strictly <strong>within</strong> a single Aggregate Root. A single DB transaction ensures all invariants are satisfied before committing.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <RefreshCw className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Eventual Consistency</h3>
                <p className="text-xs text-muted-foreground mt-1">Applied <strong>across</strong> Aggregates and Bounded Contexts. State changes are communicated asynchronously via Domain Events.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Distributed Transactions */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6 border-rose-500/20">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5 text-rose-500" />
            Distributed Transactions
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-rose-500/5">
              <ServerOff className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-rose-700 dark:text-rose-400">No 2-Phase Commit (2PC)</h3>
                <p className="text-xs text-muted-foreground mt-1">Strictly forbidden due to database locking, latency, and poor fault tolerance across microservices.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
              <Zap className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-700 dark:text-amber-400">Saga Pattern</h3>
                <p className="text-xs text-muted-foreground mt-1">Cross-service workflows are orchestrated using Sagas. Each step executes a local transaction and publishes an event.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rollback & Compensation */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-purple-500" />
            Rollback & Compensation
          </h2>
          
          <div className="space-y-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <h3 className="font-bold text-sm text-foreground">Compensating Transactions</h3>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">Upstream steps cannot be "rolled back" via DB mechanics. We execute compensatory actions (e.g., <code>RefundPayment</code>) to semantically undo previous steps.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <h3 className="font-bold text-sm text-foreground">Forward Recovery</h3>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">For non-critical failures (e.g., sending an email), we do not roll back. We rely on retrying the failed step until it eventually succeeds.</p>
            </div>
          </div>
        </div>

        {/* Retries & Idempotency */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-7">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-teal-500" />
            Retries & Idempotency
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50 sm:col-span-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-teal-500" />
                <h3 className="font-bold text-sm text-foreground">Strict Idempotency</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">Every command, event handler, and API endpoint MUST be idempotent. Applying the same operation multiple times must yield the exact same state as applying it once. Enforced via <code>Idempotency-Key</code> headers and deduplication tables.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-sm text-foreground">Exponential Backoff</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">Transient failures are retried automatically using exponential backoff with jitter to prevent thundering herd scenarios.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-sm text-foreground">Dead Letter Queues (DLQ)</h3>
              </div>
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">If a handler fails after max retries, the "poison pill" is routed to a DLQ for manual intervention, preventing queue blockage.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
