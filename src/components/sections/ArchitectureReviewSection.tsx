import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Workflow, Network, Database, ShieldAlert, GitBranch, Server, Zap, Scale, Layers } from "lucide-react";

export function ArchitectureReviewSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Architecture Review</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A critical analysis identifying coupling, scalability bottlenecks, and duplicated responsibilities, with mitigations to ensure enterprise-grade resilience.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Tight Coupling */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6 border-orange-500/20">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-orange-500" />
            Tight Coupling in Shared Types
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-orange-500/5">
              <AlertTriangle className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-orange-700 dark:text-orange-400">The Weakness</h3>
                <p className="text-xs text-muted-foreground mt-1">A monolithic `@platform/types` package creates a bottleneck. Changes in one domain (e.g., Menu) force recompilation and redeployment across unrelated domains (e.g., Billing).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <ShieldAlert className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Enterprise Mitigation</h3>
                <p className="text-xs text-muted-foreground mt-1">Migrate to <strong>Domain-Specific Contracts</strong>. Generate types from OpenAPI/AsyncAPI specs per Bounded Context. Only cross-domain integration events share a registry.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scalability Bottlenecks */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6 border-red-500/20">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-500" />
            Scalability Bottlenecks
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-red-500/5">
              <Database className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-red-700 dark:text-red-400">Database Contention</h3>
                <p className="text-xs text-muted-foreground mt-1"><strong>Risk:</strong> High write contention on `Orders` tables during peak hours. <br/><strong className="text-emerald-600 dark:text-emerald-400">Fix:</strong> Implement CQRS; route analytics to Read Replicas/OLAP.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-red-500/5">
              <Network className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-red-700 dark:text-red-400">WebSocket Overload</h3>
                <p className="text-xs text-muted-foreground mt-1"><strong>Risk:</strong> State saturation on single instances managing KDS sockets. <br/><strong className="text-emerald-600 dark:text-emerald-400">Fix:</strong> Redis Pub/Sub Backplane distributing WS connections.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edge Routing Latency */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500" />
            Edge Routing Latency
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Server className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">The Weakness</h3>
                <p className="text-xs text-muted-foreground mt-1">Tenant Resolution querying the DB for custom domains on every request adds overhead.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <Zap className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">Enterprise Mitigation</h3>
                <p className="text-xs text-muted-foreground mt-1">Push mapping to Edge via Cloudflare Workers & KV Storage. Edge injects `X-Tenant-ID`.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicated Responsibilities */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Workflow className="h-5 w-5 text-purple-500" />
            Duplicated Responsibilities
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <ShieldAlert className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-sm">RBAC vs. Feature Flags</h3>
              <p className="text-xs text-muted-foreground"><strong>Risk:</strong> Misusing flags for permissions or RBAC for incomplete features.</p>
              <Separator className="my-1" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"><strong>Fix:</strong> Strict sequential evaluation. Flag defines active path; RBAC defines user authority.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <GitBranch className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-sm">Audit Logs vs. Domain Events</h3>
              <p className="text-xs text-muted-foreground"><strong>Risk:</strong> Emitting dual events for auditing and business logic, causing desync.</p>
              <Separator className="my-1" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"><strong>Fix:</strong> Domain Event acts as single source of truth, forwarded to Event Store and sunk into Audit Log.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
