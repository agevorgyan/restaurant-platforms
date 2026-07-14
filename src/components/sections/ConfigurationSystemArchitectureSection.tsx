import { Separator } from "@/components/ui/separator";
import { Settings, ShieldCheck, Database, FileJson, ToggleLeft, GitMerge, CheckCircle2, Lock, Terminal, MonitorPlay, Beaker } from "lucide-react";

export function ConfigurationSystemArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration System Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A centralized, strongly typed, and strictly validated configuration engine. Manages everything from static environment variables to dynamic, tenant-specific runtime settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Domains */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileJson className="h-5 w-5 text-indigo-500" />
            Configuration Domains
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Terminal className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Environment Variables</h3>
                <p className="text-xs text-muted-foreground mt-1">OS-level `.env` injected at build or deploy time.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Lock className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Secrets Management</h3>
                <p className="text-xs text-muted-foreground mt-1">Secure injection of API keys/credentials via Vault/Secrets Manager.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Database className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Restaurant (Tenant)</h3>
                <p className="text-xs text-muted-foreground mt-1">Runtime settings fetched from DB (e.g., hours, taxes, menus).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ToggleLeft className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Feature Configuration</h3>
                <p className="text-xs text-muted-foreground mt-1">Granular feature flags and A/B test toggles.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typing & Validation */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Validation & Typing
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Strict Runtime Validation</h3>
                  <p className="text-xs text-muted-foreground mt-1">Zod/Joi schemas validate all configurations on startup. Fast-fails if env vars are missing or malformed to prevent broken deployments.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <FileJson className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Typed Config</h3>
                  <p className="text-xs text-muted-foreground mt-1">Transforms raw strings into strongly-typed TypeScript interfaces, enabling IDE autocomplete and type safety across the monorepo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hierarchy & Overrides */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-purple-500" />
            Hierarchy & Overrides
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">Resolution strictly follows precedence (Highest to Lowest):</p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li className="font-medium text-foreground">Runtime Overrides <span className="text-muted-foreground font-normal">(Admin Dashboard overrides)</span></li>
              <li className="font-medium text-foreground">Restaurant Config <span className="text-muted-foreground font-normal">(Database/Cache)</span></li>
              <li className="font-medium text-foreground">Environment Variables <span className="text-muted-foreground font-normal">(OS/Container)</span></li>
              <li className="font-medium text-foreground">Env-Specific Config <span className="text-muted-foreground font-normal">(e.g., config.prod.json)</span></li>
              <li className="font-medium text-foreground">Default App Config <span className="text-muted-foreground font-normal">(Base fallbacks)</span></li>
            </ol>
          </div>
        </div>

        {/* Lifecycles */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MonitorPlay className="h-5 w-5 text-amber-500" />
            Environment Lifecycles
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 border-amber-500/20">
              <MonitorPlay className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Development</h3>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">Relies on local `.env` and personal overrides for rapid iteration.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 border-emerald-500/20">
              <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Production</h3>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Immutable deploy-time variables. Secrets injected by infrastructure. Cached runtime configs.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Beaker className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Testing</h3>
                <p className="text-xs text-muted-foreground mt-1">Mocked configs and deterministic seeds for strict isolation.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
