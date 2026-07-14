import { Separator } from "@/components/ui/separator";
import { AlertOctagon, ShieldX, Database, CreditCard, Bug, UserX, Network, LogOut, Terminal, Activity } from "lucide-react";

export function ErrorHandlingArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Error Handling Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A unified strategy ensuring consistent reporting, secure masking of internal details, and structured recovery paths.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Error Hierarchy */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-indigo-500" />
            Error Hierarchy
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <UserX className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Auth & Authz</h3>
                <p className="text-xs text-muted-foreground mt-1">Authentication (401) and Authorization (403) errors.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CreditCard className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Payment Errors</h3>
                <p className="text-xs text-muted-foreground mt-1">Declines, insufficient funds, and gateway timeouts.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ShieldX className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Validation & Business</h3>
                <p className="text-xs text-muted-foreground mt-1">Malformed input or domain rule violations (e.g., out of stock).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 border-red-500/20">
              <Bug className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-red-600 dark:text-red-400">Unexpected & DB</h3>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">Connection drops, null pointers. Handled securely without leaking details.</p>
              </div>
            </div>
          </div>
        </div>

        {/* HTTP Mapping */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Network className="h-5 w-5 text-emerald-500" />
              HTTP Mapping Strategy
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">Global exception filters map domain errors to standard HTTP codes:</p>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="font-medium text-blue-600 dark:text-blue-400">400 Bad Request</span>
                  <span className="text-muted-foreground text-xs">Validation Errors</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="font-medium text-amber-600 dark:text-amber-400">401 / 403</span>
                  <span className="text-muted-foreground text-xs">Auth & Authorization</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="font-medium text-purple-600 dark:text-purple-400">409 / 422</span>
                  <span className="text-muted-foreground text-xs">Business Logic Rules</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50 border border-red-500/20">
                  <span className="font-medium text-red-600 dark:text-red-400">500 Internal Server Error</span>
                  <span className="text-muted-foreground text-xs text-right">Unexpected / Database<br/>(Payload strictly masked)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logging & Recovery */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Logging & Recovery Strategy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Terminal className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Logging Separation</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Operational (Expected)</strong> errors are logged at INFO/WARN and do not alert. <br/><br/>
                  <strong>Unexpected</strong> errors are logged at ERROR/FATAL with full stack traces, Request/Tenant IDs, and trigger immediate engineering alerts.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <LogOut className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Client & Server Recovery</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Client:</strong> Global React Error Boundaries catch UI crashes. API interceptors handle token refreshes (401) and exponential backoff retries (503).<br/><br/>
                  <strong>Server:</strong> Graceful crash and restart (via PM2/K8s) for unhandled Promise rejections to prevent corrupted state.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
