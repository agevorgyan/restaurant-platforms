import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Database, Shield, Zap, Cloud, Network } from "lucide-react";

export function MultiTenantArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enterprise Multi-Tenant Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Strategies for scaling to 100,000+ restaurants while ensuring strict data isolation, high performance, and custom branding.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Database Strategy & Isolation */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Strategy & Restaurant Isolation
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">Logical Isolation (Pooled Database)</h3>
                <p className="text-sm text-muted-foreground">All tenants share the same database and schemas, but every table has a mandatory `restaurant_id`. This approach minimizes infrastructure overhead and simplifies schema migrations across 100k+ restaurants.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2">Row-Level Security (RLS)</h3>
                <p className="text-sm text-muted-foreground">PostgreSQL RLS policies enforce isolation at the database level. Even if application logic fails, a query missing the correct tenant context cannot access another restaurant's data.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">Prisma Client Extensions</h3>
                <p className="text-sm text-muted-foreground">A custom Prisma extension automatically injects the `restaurant_id` into the `where` clause of every query based on the active Request Context (AsyncLocalStorage), preventing developer errors.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2">Connection Pooling (PgBouncer/Prisma Accelerate)</h3>
                <p className="text-sm text-muted-foreground">Essential for handling thousands of concurrent serverless frontend connections and backend service queries to the PostgreSQL database.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edge & Networking (Cloudflare) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Edge & Networking (Cloudflare)
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Subdomains & Custom Domains</h3>
              <p className="text-sm text-muted-foreground">Restaurants get a default subdomain (e.g., `burgerjoint.platform.com`). Enterprise plans allow Custom Domains (e.g., `order.burgerjoint.com`) mapped via CNAME.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Cloudflare SSL for SaaS</h3>
              <p className="text-sm text-muted-foreground">Automatically provisions and renews TLS/SSL certificates for thousands of custom restaurant domains dynamically without manual intervention.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Edge Routing & WAF</h3>
              <p className="text-sm text-muted-foreground">Cloudflare handles DDoS protection, bot mitigation, and routes requests to the Next.js edge network based on domain.</p>
            </div>
          </div>
        </div>

        {/* Middleware & Resolution */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5" />
            Tenant Resolver & Middleware
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Next.js Edge Middleware</h3>
              <p className="text-sm text-muted-foreground">Intercepts incoming requests, inspects the `Host` header (subdomain or custom domain), and rewrites the URL to a tenant-specific internal route (e.g., `/[tenantId]/menu`).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">NestJS Tenant Interceptor</h3>
              <p className="text-sm text-muted-foreground">On the backend, extracts the Tenant ID from the JWT payload (for staff) or the `x-tenant-id` header (for public API calls) and binds it to the Dependency Injection scope.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Fallback & Validation</h3>
              <p className="text-sm text-muted-foreground">If a domain doesn't exist, middleware serves a branded 404 page. Inactive or suspended tenants are intercepted at the edge to save backend load.</p>
            </div>
          </div>
        </div>

        {/* Performance & Scaling */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance & Caching
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Edge Caching</h3>
              <p className="text-sm text-muted-foreground">Public QR menus are aggressively cached at the Cloudflare Edge and Next.js ISR cache. Invalidated via webhooks only when the owner publishes menu changes.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Tenant-Aware Redis Caching</h3>
              <p className="text-sm text-muted-foreground">Redis keys are strictly prefixed with the Tenant ID (e.g., `tenant:{"{id}"}:menu:active`). Allows flushing a single restaurant's cache without affecting others.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Horizontal Scaling</h3>
              <p className="text-sm text-muted-foreground">Stateless Node.js/NestJS containers scale infinitely. Background workers (BullMQ) scale independently from the web API to process heavy tasks.</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Data Encryption</h3>
              <p className="text-sm text-muted-foreground">Data at rest encrypted via cloud provider (AES-256). Sensitive PII and API keys (e.g., Stripe) encrypted at the application level before database insertion.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Strict CORS & CSP</h3>
              <p className="text-sm text-muted-foreground">APIs reject requests originating from non-whitelisted custom domains. Content Security Policies restrict script execution and iframe embedding to prevent clickjacking.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Noisy Neighbor Mitigation</h3>
              <p className="text-sm text-muted-foreground">Tenant-specific API rate limiting prevents a single high-traffic restaurant (or DDoS target) from exhausting database connections and degrading performance for others.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
