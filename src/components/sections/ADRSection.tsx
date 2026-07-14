import { Separator } from "@/components/ui/separator";
import { BookOpen, Zap, Server, Database, Container, Cloud, GitMerge, FileText } from "lucide-react";

export function ADRSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Architecture Decision Records (ADRs)</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Historical records of the core architectural choices that shape the Restaurant SaaS Platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Why Turborepo */}
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Why Turborepo?
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Decision:</strong> Use Turborepo for monorepo management over Nx, Lerna, or Yarn Workspaces.
          </p>
          <p className="text-sm">
            <strong>Rationale:</strong> Turborepo offers unmatched execution speed through intelligent remote caching and task pipelining. It is highly optimized for Next.js and TypeScript ecosystems without the steep learning curve or heavy configuration overhead of Nx. It ensures we can share packages (UI, DB, Auth) safely while keeping CI/CD times under 3 minutes, even at scale.
          </p>
        </div>

        {/* Why Next.js */}
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-slate-900 dark:text-white" />
            Why Next.js?
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Decision:</strong> Use Next.js (App Router) for all frontend applications (Web, Dashboard, POS, Menu).
          </p>
          <p className="text-sm">
            <strong>Rationale:</strong> Next.js provides the best hybrid rendering capabilities (SSR/SSG/CSR) out of the box. For the consumer-facing QR Menu and public website, SEO and initial load performance (SSR/SSG) are critical. For the Dashboard and POS, Client Components provide rich interactivity. React Server Components (RSC) allow us to reduce JavaScript bundle sizes shipped to mobile devices in restaurants.
          </p>
        </div>

        {/* Why NestJS & Fastify */}
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-red-500" />
            Why NestJS & Fastify?
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Decision:</strong> Use NestJS with the Fastify adapter for the core backend API over Express.
          </p>
          <p className="text-sm">
            <strong>Rationale:</strong> NestJS enforces a strict, opinionated, Angular-like architecture (Modules, Services, Dependency Injection) which is crucial for large teams maintaining complex domains (multi-tenant CRM, POS sync). Using the Fastify adapter instead of Express yields up to 2x better throughput, which is essential for handling massive concurrent order spikes during peak restaurant hours.
          </p>
        </div>

        {/* Why PostgreSQL & Prisma */}
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Why PostgreSQL & Prisma?
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Decision:</strong> Use PostgreSQL as the primary RDBMS and Prisma as the ORM.
          </p>
          <p className="text-sm">
            <strong>Rationale:</strong> PostgreSQL is the most robust, ACID-compliant database for handling transactional financial data (orders, payments) and multi-tenancy (Row-Level Security). Prisma provides unparalleled developer experience with end-to-end type safety, automated migrations, and auto-generated TypeScript clients, eliminating a massive class of runtime errors.
          </p>
        </div>

        {/* Why Redis & Event Driven */}
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-rose-500" />
            Why Redis & Event-Driven Architecture?
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Decision:</strong> Use Redis for caching and BullMQ, paired with an Event-Driven Architecture.
          </p>
          <p className="text-sm">
            <strong>Rationale:</strong> Restaurant operations are highly asynchronous (e.g., placing an order triggers kitchen printing, inventory deduction, and push notifications). An Event-Driven approach decouples these domains. Redis provides the high-performance backbone for BullMQ (background job queues) and WebSocket pub/sub (real-time POS updates), preventing the main API thread from blocking during heavy loads.
          </p>
        </div>

        {/* Why Docker & Cloudflare */}
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Cloud className="h-5 w-5 text-cyan-500" />
            Why Docker & Cloudflare?
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong>Decision:</strong> Containerize everything with Docker and use Cloudflare for Edge/CDN.
          </p>
          <p className="text-sm">
            <strong>Rationale:</strong> Docker ensures absolute parity between local development, staging, and production, eliminating "works on my machine" bugs. Cloudflare acts as the edge security layer (WAF, DDoS protection) and CDN. For a global restaurant platform, caching static menu assets at the Cloudflare edge significantly reduces latency for end-users scanning QR codes.
          </p>
        </div>

      </div>
    </div>
  );
}
