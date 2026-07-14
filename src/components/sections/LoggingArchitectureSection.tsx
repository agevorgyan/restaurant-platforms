import { Separator } from "@/components/ui/separator";
import { FileJson, ListOrdered, Target, Clock, ShieldAlert, History, Activity, TerminalSquare, Eye, Lock } from "lucide-react";

export function LoggingArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enterprise Logging Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Designed for high observability, auditing, and debugging across a distributed SaaS environment. Relies exclusively on structured JSON logging.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Structured Context */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileJson className="h-5 w-5 text-indigo-500" />
            Structured JSON Context
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Activity className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Trace & Request ID</h3>
                <p className="text-xs text-muted-foreground mt-1">Trace ID spans distributed services. Request ID identifies execution within a single service.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Target className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Correlation ID</h3>
                <p className="text-xs text-muted-foreground mt-1">Business-level identifier linking related operations (e.g., Order ID tying payments to fulfillment).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <TerminalSquare className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Tenant ID</h3>
                <p className="text-xs text-muted-foreground mt-1">The Restaurant ID. Essential for isolating and analyzing logs in a multi-tenant environment.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Eye className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">User ID</h3>
                <p className="text-xs text-muted-foreground mt-1">Identity of the actor performing the action (Admin, Customer, Worker, System).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Streams */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-emerald-500" />
              Specialized Log Streams
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Clock className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Performance Logs</h3>
                  <p className="text-xs text-muted-foreground mt-1">Tracks execution time, query durations, and latency metrics. Used to generate APM traces and alert on bottlenecks.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <History className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Audit Logs</h3>
                  <p className="text-xs text-muted-foreground mt-1">Immutable records of critical business events ("Who, What, When, Previous State"). Retained strictly for compliance.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Security Logs</h3>
                  <p className="text-xs text-muted-foreground mt-1">Tracks auth attempts, authorization denials, API key usage, and rate-limiting. Forwarded to SIEM for anomaly detection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Levels */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            Error Levels & Alerting
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-red-500/10 border-red-500/20">
              <h3 className="font-bold text-sm text-red-600 dark:text-red-400">FATAL</h3>
              <p className="text-xs text-red-600/80 dark:text-red-400/80">System-level failures. Triggers immediate PagerDuty alerts.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-orange-500/10 border-orange-500/20">
              <h3 className="font-bold text-sm text-orange-600 dark:text-orange-400">ERROR</h3>
              <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Unhandled exceptions or transaction failures. Monitored.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-amber-500/10 border-amber-500/20">
              <h3 className="font-bold text-sm text-amber-600 dark:text-amber-400">WARN</h3>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Expected anomalies, retries, or API deprecations.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-blue-500/10 border-blue-500/20">
              <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">INFO / DEBUG</h3>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Normal lifecycle events. Debug disabled in production.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
