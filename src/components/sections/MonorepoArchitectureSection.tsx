import { Separator } from "@/components/ui/separator";
import { FolderTree, Server, LayoutTemplate, Database, Package, Smartphone, BrainCircuit, Globe, Store, Box, Users, Settings, Terminal, Container, Github, FileText, Wrench } from "lucide-react";

export function MonorepoArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monorepo Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Production-ready Turborepo structure designed for enterprise scalability and multi-tenant SaaS.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Architecture Overview */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <FolderTree className="h-5 w-5" />
            Workspace Structure (Turborepo)
          </h2>
          <p className="text-lg">
            This repository isolates applications and shared packages to ensure zero code duplication, strongly typed boundaries, and lightning-fast CI/CD pipeline cache hits.
          </p>
        </div>

        {/* Applications (apps/) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Applications (apps/)
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Independent, deployable frontend and backend applications.
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Server className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/api (NestJS + Fastify)</h3>
                <p className="text-xs text-muted-foreground mt-1">Core scalable backend serving REST, GraphQL, and WebSockets. Handles business logic, POS sync, and centralized ordering.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Store className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/dashboard (Next.js)</h3>
                <p className="text-xs text-muted-foreground mt-1">Tenant admin portal for restaurant owners to manage CRM, inventory, POS, and multi-location settings.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Globe className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/admin (Next.js)</h3>
                <p className="text-xs text-muted-foreground mt-1">Super-admin portal for platform operators to manage tenants, global billing, feature flags, and system health.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Smartphone className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/customer-menu (Next.js PWA)</h3>
                <p className="text-xs text-muted-foreground mt-1">Consumer-facing QR Menu for table ordering and digital menus. Highly optimized for mobile and speed.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Smartphone className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/customer-order (Next.js)</h3>
                <p className="text-xs text-muted-foreground mt-1">Consumer-facing Online Ordering application for delivery and pickup. Integrates deeply with loyalty and payments.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <LayoutTemplate className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/customer-kiosk (Next.js PWA)</h3>
                <p className="text-xs text-muted-foreground mt-1">Self-service kiosk application designed for large touchscreens. High performance and offline-capable.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Globe className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/landing (Next.js)</h3>
                <p className="text-xs text-muted-foreground mt-1">Public-facing SaaS marketing website. Optimized for SEO, speed, and conversion tracking.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <FileText className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">apps/docs (Next.js)</h3>
                <p className="text-xs text-muted-foreground mt-1">Developer and public API documentation, architectural decision records (ADRs), and integration guides.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages (packages/) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shared Packages (packages/)
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Internal modules shared across applications for consistency.
          </p>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <LayoutTemplate className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/ui</h3>
                <p className="text-xs text-muted-foreground mt-1">Shared React component library (TailwindCSS + shadcn/ui) ensuring visual consistency across all frontend apps.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Database className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/database</h3>
                <p className="text-xs text-muted-foreground mt-1">Centralized Prisma schema, migrations, and generated client. The single source of truth for all data shapes.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Users className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/auth</h3>
                <p className="text-xs text-muted-foreground mt-1">Authentication and authorization logic (e.g., JWT validation, tenant isolation, RBAC policies).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Settings className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/config</h3>
                <p className="text-xs text-muted-foreground mt-1">Shared ESLint, Prettier, TypeScript (tsconfig), and Tailwind configurations.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Box className="h-6 w-6 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/types</h3>
                <p className="text-xs text-muted-foreground mt-1">Global TypeScript interfaces and Zod schemas shared strictly across the API and all frontends.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Wrench className="h-6 w-6 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/utils</h3>
                <p className="text-xs text-muted-foreground mt-1">Shared business logic, pure formatting helpers, and standard utility functions.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Store className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/payments</h3>
                <p className="text-xs text-muted-foreground mt-1">Abstracted payment gateway integrations (Stripe, Square) for SaaS billing and consumer orders.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Server className="h-6 w-6 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/storage</h3>
                <p className="text-xs text-muted-foreground mt-1">Cloud storage abstractions (S3/R2) for handling menu images, tenant assets, and exports.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Globe className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/notifications</h3>
                <p className="text-xs text-muted-foreground mt-1">Multi-channel delivery module for WebSockets, Email, SMS, and Push notifications.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Terminal className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/analytics</h3>
                <p className="text-xs text-muted-foreground mt-1">Telemetry, event tracking, and centralized logging interfaces for observability integration.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <BrainCircuit className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">packages/ai</h3>
                <p className="text-xs text-muted-foreground mt-1">Shared LLM orchestrations, prompt templates, and AI utility functions for inventory prediction and insights.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Architecture Folders */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
           <h2 className="text-xl font-semibold flex items-center gap-2">
            <Box className="h-5 w-5" />
            Core Repository Organization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/30">
              <Settings className="h-6 w-6 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">configs/</h3>
                <p className="text-xs text-muted-foreground mt-1">Centralized ESLint, TypeScript, and Prettier configurations enforcing code standards.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/30">
              <Terminal className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">scripts/</h3>
                <p className="text-xs text-muted-foreground mt-1">Idempotent utility scripts for DB seeding, environment bootstrap, and CI operations.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/30">
              <Container className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">docker/</h3>
                <p className="text-xs text-muted-foreground mt-1">Multi-stage production Dockerfiles and local dev docker-compose setups.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/30">
              <Github className="h-6 w-6 text-zinc-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">.github/</h3>
                <p className="text-xs text-muted-foreground mt-1">Turborepo-optimized CI/CD workflows, PR templates, and CODEOWNERS boundaries.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/30">
              <FileText className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">docs/</h3>
                <p className="text-xs text-muted-foreground mt-1">Centralized knowledge base including API contracts and Architecture Decision Records (ADRs).</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/30">
              <Wrench className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">tools/</h3>
                <p className="text-xs text-muted-foreground mt-1">Bespoke internal CLIs and generators to enhance DX and enforce boilerplate consistency.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Infrastructure layer */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
           <h2 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5" />
            Infrastructure & Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
             <div className="p-4 rounded-lg border flex flex-col items-center justify-center text-center gap-2 bg-muted/20">
               <Database className="h-8 w-8 text-blue-600" />
               <h3 className="font-semibold">PostgreSQL</h3>
               <p className="text-xs text-muted-foreground">Primary transactional multi-tenant database</p>
             </div>
             <div className="p-4 rounded-lg border flex flex-col items-center justify-center text-center gap-2 bg-muted/20">
               <Server className="h-8 w-8 text-red-500" />
               <h3 className="font-semibold">Redis</h3>
               <p className="text-xs text-muted-foreground">Caching, WebSockets pub/sub, BullMQ job queues</p>
             </div>
             <div className="p-4 rounded-lg border flex flex-col items-center justify-center text-center gap-2 bg-muted/20">
               <Box className="h-8 w-8 text-cyan-600" />
               <h3 className="font-semibold">Docker</h3>
               <p className="text-xs text-muted-foreground">Containerized local dev and production deployments</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
