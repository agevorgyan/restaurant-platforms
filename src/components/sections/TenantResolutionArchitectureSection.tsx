import { Separator } from "@/components/ui/separator";
import { Globe, Link, AppWindow, Cpu, Network, Shield, ArrowRightLeft, RadioReceiver, Layers, Map } from "lucide-react";

export function TenantResolutionArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenant Resolution Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The critical mechanism for identifying tenant context across HTTP requests, WebSockets, and background workers to ensure strict data isolation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Routing Mechanisms */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-500" />
            Routing Mechanisms
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <AppWindow className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Subdomain Routing</h3>
                <p className="text-xs text-muted-foreground mt-1">Parsed from the Host header (e.g., `tenant.platform.com`). Standard for hosted storefronts.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Link className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Custom Domain</h3>
                <p className="text-xs text-muted-foreground mt-1">Host header mapped via an edge-cached lookup table (e.g., `www.restaurant.com` &rarr; `Tenant ID`).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 sm:col-span-2">
              <ArrowRightLeft className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">API Resolution</h3>
                <p className="text-xs text-muted-foreground mt-1">Clients pass an `X-Tenant-ID` header. Fallback is extracting the tenant context from the authenticated user's JWT token.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Isolation */}
        <div className="space-y-6 md:col-span-12 lg:col-span-4">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-rose-500" />
              Context Isolation
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-red-500/10 border-red-500/20">
                <Shield className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-red-600 dark:text-red-400">Strict Isolation</h3>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">Tenant ID is injected into AsyncLocalStorage. All DB queries and cache lookups implicitly use this context to prevent data leaks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Async & Stateful Resolution */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <RadioReceiver className="h-5 w-5 text-amber-500" />
            Asynchronous & Stateful Resolution
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Cpu className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Background Jobs & Workers</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Jobs pulled from queues lack HTTP context. The `TenantId` <strong>must</strong> be explicitly embedded in the root payload of every event or job struct for workers to establish context.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Network className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">WebSockets</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Resolved during the initial HTTP Upgrade handshake via query params or tokens. Once established, the socket object is statefully bound to the Tenant ID in memory.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
