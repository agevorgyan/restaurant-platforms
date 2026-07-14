import { Separator } from "@/components/ui/separator";
import { Settings, Lock, ShieldAlert, Server, TestTube, CloudFog, Rocket, FileCode2, CheckCircle } from "lucide-react";

export function EnvironmentConfigSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Environment & Configuration</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Strict, type-safe environment management ensuring zero hardcoded secrets and robust deployment lifecycles.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Core Environments */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Server className="h-5 w-5" />
            Deployment Environments
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-blue-500" />
                Development
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Local engineer machines. Uses `.env.local` files, local Docker Compose infrastructure (PostgreSQL, Redis), and mock third-party services.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TestTube className="h-4 w-4 text-emerald-500" />
                Testing
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Ephemeral CI environments (GitHub Actions). Uses `.env.test` with isolated, throwaway databases for automated unit and E2E tests.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CloudFog className="h-4 w-4 text-purple-500" />
                Staging
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Production-like replica for QA and UAT. Connects to sandbox environments of payment gateways (e.g., Stripe Test Mode) and external APIs.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Rocket className="h-4 w-4 text-rose-500" />
                Production
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Live, customer-facing environment. Connects to real payment gateways and live databases. Strictly isolated from all other environments.
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Strategy */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Strategy
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Environment Validation (Zod)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Environment variables are strictly validated using Zod schemas at startup (`env.ts`). If a required variable is missing or malformed, the application will crash immediately (fail-fast) rather than running in an undefined state.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Settings className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Global `.env.example`</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  The repository must maintain an up-to-date `.env.example` file documenting all required variables. Real secrets are NEVER committed to version control.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secret Management */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Secret Management
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border border-rose-500/30 bg-rose-500/5">
              <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400">Never Hardcode Secrets</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  API keys, database credentials, JWT secrets, and any sensitive data must be injected entirely via environment variables. Hardcoding secrets is a critical security violation.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Lock className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Vault / Manager</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  In staging and production, secrets are injected at deployment time using a secure secret manager (e.g., GitHub Secrets, Infisical, AWS Secrets Manager, or Coolify Environment Variables).
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
