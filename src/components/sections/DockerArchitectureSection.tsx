import { Separator } from "@/components/ui/separator";
import { Container, Server, Database, Layers, Network, Activity, HardDrive, ShieldCheck, Cog, Webhook, Box, Cloud, Clock } from "lucide-react";

export function DockerArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Docker Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Containerization strategy for local development and scalable production environments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Core Strategy */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Container className="h-5 w-5" />
            Environment Strategy
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-lg">Development Environment</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Optimized for Developer Experience (DX). Utilizes Docker Compose to orchestrate dependencies (PostgreSQL, Redis, local S3 mock) while applications run natively via Turborepo (`npm run dev`) for instantaneous Hot Module Replacement (HMR).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Production Environment</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Optimized for security, performance, and immutability. Every application is built into a standalone, multi-stage, rootless Docker image. Orchestrated via Coolify, Kubernetes, or Docker Swarm across isolated networks.
              </p>
            </div>
          </div>
        </div>

        {/* Application Containers */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Application Containers
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Server className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">API (NestJS)</h3>
                <p className="text-xs text-muted-foreground mt-1">Stateless backend services running via Node.js clusters. Horizontally scalable. Connects to PostgreSQL and Redis.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Box className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Next.js Applications</h3>
                <p className="text-xs text-muted-foreground mt-1">Independent containers for Admin, Dashboard, Menu, and Docs. Built as standalone Next.js servers to minimize image size.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Cog className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Background Workers</h3>
                <p className="text-xs text-muted-foreground mt-1">Dedicated containers executing BullMQ jobs off the Redis queue. Handles report generation, webhooks, and email dispatch without blocking the API.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Clock className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Scheduler</h3>
                <p className="text-xs text-muted-foreground mt-1">Singleton container responsible for dispatching recurring CRON jobs (e.g., daily settlement, inventory sync) to the queue.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Containers */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Infrastructure Containers
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Database className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">PostgreSQL (Primary DB)</h3>
                <p className="text-xs text-muted-foreground mt-1">Runs with connection pooling (e.g., PgBouncer). Configured with persistent volumes and automated daily WAL archiving.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Activity className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Redis (Cache & Queue)</h3>
                <p className="text-xs text-muted-foreground mt-1">In-memory datastore for BullMQ, WebSocket Pub/Sub adapters, and high-speed multi-tenant caching.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Webhook className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Reverse Proxy (Traefik/Nginx)</h3>
                <p className="text-xs text-muted-foreground mt-1">Edge router handling SSL termination, rate limiting, and dynamic path-based routing to internal container endpoints.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Cloud className="h-6 w-6 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Object Storage (MinIO)</h3>
                <p className="text-xs text-muted-foreground mt-1">Local S3-compatible storage used in development to emulate AWS S3/Cloudflare R2 for asset uploads.</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Operations */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Operations & Orchestration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg border flex flex-col gap-2 bg-muted/30">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Network className="h-5 w-5" />
                Networking
              </div>
              <p className="text-sm text-muted-foreground">
                Containers operate within isolated Docker Bridge networks. Databases and Redis are inaccessible from the public internet. Only the Reverse Proxy binds to host ports (80/443).
              </p>
            </div>

            <div className="p-4 rounded-lg border flex flex-col gap-2 bg-muted/30">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <HardDrive className="h-5 w-5" />
                Volumes
              </div>
              <p className="text-sm text-muted-foreground">
                Named Docker volumes persist PostgreSQL data, Redis dumps, and MinIO uploads across container restarts. Application containers remain strictly stateless and immutable.
              </p>
            </div>

            <div className="p-4 rounded-lg border flex flex-col gap-2 bg-muted/30">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <ShieldCheck className="h-5 w-5" />
                Health Checks
              </div>
              <p className="text-sm text-muted-foreground">
                Native Docker health checks utilize `/api/health` endpoints and `pg_isready` to ensure traffic is only routed to ready instances, enabling zero-downtime rolling deployments.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
