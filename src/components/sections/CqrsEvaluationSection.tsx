import { Separator } from "@/components/ui/separator";
import { 
  SplitSquareHorizontal, QrCode, ShoppingCart, 
  BrainCircuit, ShieldCheck, Building2, Bell,
  CheckCircle2, XCircle, ArrowRightLeft, Target, ShieldAlert
} from "lucide-react";

export function CqrsEvaluationSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CQRS Strategy Evaluation</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Command Query Responsibility Segregation (CQRS) introduces complexity. It must only be applied where asymmetric scaling or complex querying justifies the overhead.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* High Value (Mandatory) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Where CQRS is Highly Valuable (Apply Here)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <QrCode className="h-5 w-5" />
                <h3 className="font-bold text-sm">Catalog & Menus</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Extreme Read/Write Asymmetry</p>
              <Separator className="my-1 bg-emerald-500/20" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Menus are updated rarely but scanned by thousands of guests concurrently. Write models enforce complex modifier rules; Read models are flattened and pushed to edge CDN caches.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <ShoppingCart className="h-5 w-5" />
                <h3 className="font-bold text-sm">Ordering & POS</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">High Contention & Locking</p>
              <Separator className="my-1 bg-emerald-500/20" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Peak hour transactions require strict locking and validation. Separating reads prevents KDS polling and dashboard queries from slowing down critical order insertions.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <BrainCircuit className="h-5 w-5" />
                <h3 className="font-bold text-sm">Intelligence & Analytics</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Complex Aggregations</p>
              <Separator className="my-1 bg-emerald-500/20" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Joining millions of rows for daily reports will crash the transactional DB. Domain events project data into a dedicated OLAP database (ClickHouse) for lightning-fast reads.
              </p>
            </div>

          </div>
        </div>

        {/* Overkill (Standard CRUD) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <XCircle className="h-5 w-5 text-rose-500" />
            Where CQRS is Overkill (Use Standard CRUD)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-rose-500/5 border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-bold text-sm">Identity & Access (IAM)</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Simple Key Lookups</p>
              <Separator className="my-1 bg-rose-500/20" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                User management relies on simple lookups (findById, findByEmail) with infrequent updates. CQRS adds boilerplate with zero performance or scaling benefits.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-rose-500/5 border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                <Building2 className="h-5 w-5" />
                <h3 className="font-bold text-sm">Tenant & Billing Settings</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Low Throughput / Flat Data</p>
              <Separator className="my-1 bg-rose-500/20" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Managing operating hours or table layouts involves relational data with low throughput. A standard ORM/Repository approach is easier to maintain and reason about.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-rose-500/5 border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                <Bell className="h-5 w-5" />
                <h3 className="font-bold text-sm">Platform Foundation</h3>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Append-Only Logs</p>
              <Separator className="my-1 bg-rose-500/20" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Notification systems are mostly append-only logs of events. There is no complex read-model requirement that justifies separating the read/write paths.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
