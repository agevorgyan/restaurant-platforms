import { Separator } from "@/components/ui/separator";
import { Package, Database, Shield, Layout, Settings, Activity, Code2, Link, Zap, Globe, HardDrive, Bell, CheckCircle, FileCode, Layers } from "lucide-react";

export function PackagesArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Packages Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A scalable monorepo structure modularizing the codebase into discrete, reusable packages. Enforces strict dependency boundaries and enables maximum code sharing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core & Domain */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            Core & Domain
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Code2 className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">core & types</h3>
                <p className="text-xs text-muted-foreground mt-1">Fundamental business logic, pure domain models, and shared TS interfaces.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Settings className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">config</h3>
                <p className="text-xs text-muted-foreground mt-1">Global schemas, env parsing, and shared settings.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Link className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">contracts</h3>
                <p className="text-xs text-muted-foreground mt-1">API schemas, request/response DTOs, and RPC definitions.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">events</h3>
                <p className="text-xs text-muted-foreground mt-1">Event-driven payloads, topic names, and messaging contracts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure & Services */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-500" />
              Infrastructure & Services
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Database className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">database & storage</h3>
                  <p className="text-xs text-muted-foreground mt-1">ORM schemas, migrations, S3/R2 cloud storage abstractions.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Shield className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">auth-sdk</h3>
                  <p className="text-xs text-muted-foreground mt-1">Authentication helpers, JWT verification, and session management.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Globe className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">api-client & payments</h3>
                  <p className="text-xs text-muted-foreground mt-1">Strongly-typed SDKs, payment gateways, and billing logic.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Bell className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">notifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">Email, SMS, and Push notification templates and dispatchers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frontend & UI */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layout className="h-5 w-5 text-rose-500" />
            Frontend & UI
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Layout className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">ui & theme</h3>
                <p className="text-xs text-muted-foreground mt-1">Shared component library, headless logic, and CSS theme engine.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <FileCode className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">hooks & validation</h3>
                <p className="text-xs text-muted-foreground mt-1">React state management and shared Zod/Yup validation schemas.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 sm:col-span-2">
              <Package className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">design-tokens & i18n</h3>
                <p className="text-xs text-muted-foreground mt-1">Platform-agnostic design tokens and internationalization dictionaries.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Observability & Utils */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-500" />
            Observability & Utils
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Activity className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">monitoring & logger</h3>
                <p className="text-xs text-muted-foreground mt-1">Performance metrics, Sentry error tracking, and structured Pino logs.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">analytics & flags</h3>
                <p className="text-xs text-muted-foreground mt-1">Telemetry dispatchers, A/B testing, and progressive rollouts.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 sm:col-span-2">
              <Shield className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">security & utils</h3>
                <p className="text-xs text-muted-foreground mt-1">Cryptography, input sanitization, date/time formatting, and functional helpers.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
