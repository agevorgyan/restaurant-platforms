import { Separator } from "@/components/ui/separator";
import { ToggleLeft, Globe, Store, CreditCard, FlaskConical, Beaker, GitCommit, Activity, Server, Clock, Trash2, ArrowRight } from "lucide-react";

export function FeatureFlagArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feature Flag Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Decouples code deployment from feature release. Enables safe rollouts, A/B testing, and granular control over tenant capabilities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Scopes & Contexts */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ToggleLeft className="h-5 w-5 text-indigo-500" />
            Flag Scopes & Contexts
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Globe className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Global Flags</h3>
                <p className="text-xs text-muted-foreground mt-1">System-wide toggles affecting everyone simultaneously. Used for kill switches or big-bang releases.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Store className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Restaurant (Tenant) Flags</h3>
                <p className="text-xs text-muted-foreground mt-1">Toggles scoped to a specific Restaurant ID. Allows opting individual locations into specific behaviors.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CreditCard className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Subscription Flags</h3>
                <p className="text-xs text-muted-foreground mt-1">Features enabled dynamically based on the tenant's billing tier (e.g., 'Pro' features).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rollout Strategies */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-emerald-500" />
              Rollout Strategies
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Beaker className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Beta Features (Opt-in)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Allows users to explicitly opt-in to experimental features before general availability.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Activity className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Gradual Rollout (Canary)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Percent-based rollouts (e.g., 5% &rarr; 20% &rarr; 100%) to monitor performance safely.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <FlaskConical className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Experiments (A/B Testing)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Traffic split between variants to measure business impact (e.g., conversion rates).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture & Evaluation */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-amber-500" />
            Architecture & Evaluation
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Server className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-sm">Central Provider</h3>
              <p className="text-xs text-muted-foreground">LaunchDarkly, Unleash, or Redis-backed service storing flag rules.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <ArrowRight className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm">Evaluation Context</h3>
              <p className="text-xs text-muted-foreground">Clients provide `{ ['restaurantId', 'planId'] }` to compute state.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Clock className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-sm">Caching & Fallbacks</h3>
              <p className="text-xs text-muted-foreground">Edge caching or SSE to prevent latency. Fast-fail to safe codebase defaults.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50 border-orange-500/20">
              <Trash2 className="h-5 w-5 text-orange-500" />
              <h3 className="font-bold text-sm text-orange-600 dark:text-orange-400">Lifecycle Cleanup</h3>
              <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Flags are technical debt. Must be removed from code once 100% rolled out.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
