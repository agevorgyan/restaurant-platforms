import { Separator } from "@/components/ui/separator";
import { Server, ShieldCheck, Activity, Database, GitMerge, Cloud, Boxes, HardDrive } from "lucide-react";

export function DevOpsArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DevOps & Infrastructure</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Production-grade deployment, CI/CD, monitoring, and scaling strategies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Deployment & CI/CD */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Deployment & CI/CD
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">GitHub Actions</h3>
              <p className="text-sm text-muted-foreground">Automated pipelines for linting, testing, and building Docker images. Enforces quality gates before any code is merged into the main branch.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Docker & Containerization</h3>
              <p className="text-sm text-muted-foreground">Multi-stage Dockerfiles for Next.js frontend and NestJS backend. Ensures identical environments across local development, staging, and production.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Coolify (Production Deployment)</h3>
              <p className="text-sm text-muted-foreground">Self-hosted Heroku/Vercel alternative. Manages Git-based deployments, automatic SSL provisioning, and environment variables across multiple VPS instances.</p>
            </div>
          </div>
        </div>

        {/* Cloudflare & Edge */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Edge, CDN & Storage
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Cloudflare (CDN & DNS)</h3>
              <p className="text-sm text-muted-foreground">Global CDN caching static assets and Edge rules for routing custom domains. Acts as the first line of defense with its Web Application Firewall (WAF).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Cloudflare R2 (Object Storage)</h3>
              <p className="text-sm text-muted-foreground">S3-compatible, zero-egress-fee storage for restaurant assets (menu images, logos). Served globally via Cloudflare CDN for lightning-fast image loading.</p>
            </div>
          </div>
        </div>

        {/* Data Layer */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Layer & Scaling
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">PostgreSQL</h3>
              <p className="text-sm text-muted-foreground">Primary relational database. Configured with connection pooling (PgBouncer) to handle thousands of concurrent serverless connections.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Redis</h3>
              <p className="text-sm text-muted-foreground">In-memory data store for stateful cart sessions, rate limiting, and pub/sub events for real-time WebSocket communication (KDS).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Scaling Strategy</h3>
              <p className="text-sm text-muted-foreground">Stateless application containers scale horizontally behind a load balancer. Database scales vertically initially, with read-replicas introduced for heavy reporting loads.</p>
            </div>
          </div>
        </div>

        {/* Monitoring & Security */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Operations & Security
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4" /> Monitoring & Logging</h3>
                <p className="text-sm text-muted-foreground">Centralized logging using tools like Datadog or ELK stack. Real-time application performance monitoring (APM) and alerting for API errors or latency spikes.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2"><HardDrive className="h-4 w-4" /> Automated Backups</h3>
                <p className="text-sm text-muted-foreground">Continuous Archiving and Point-in-Time Recovery (PITR) for PostgreSQL. Nightly database dumps securely pushed to encrypted off-site object storage.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Security Posture</h3>
                <p className="text-sm text-muted-foreground">VPC isolation for databases and Redis (not exposed to the public internet). Strict IAM roles, secrets management, and regular dependency vulnerability scanning.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Boxes className="h-4 w-4" /> Infrastructure as Code</h3>
                <p className="text-sm text-muted-foreground">Server provisioning and configuration managed via declarative code (e.g., Terraform or Ansible) to ensure reproducible and documented environments.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
