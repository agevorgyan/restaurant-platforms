import { Separator } from "@/components/ui/separator";
import { Layers, MonitorSmartphone, Server, Database, Cloud, Blocks, Code2, Cpu } from "lucide-react";

export function TechStackArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approved Tech Stack</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The standardized and approved technologies for the Enterprise Restaurant Platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Frontend */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MonitorSmartphone className="h-5 w-5" />
            Frontend Architecture
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Core Framework</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Next.js</span> & <span className="font-medium text-foreground">React</span> using <span className="font-medium text-foreground">TypeScript</span> for strict type safety. Implemented as a PWA (Progressive Web App) for native-like experiences.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">UI & Styling</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">TailwindCSS</span> for utility-first styling. <span className="font-medium text-foreground">shadcn/ui</span> for accessible, unstyled component primitives. <span className="font-medium text-foreground">Motion</span> for fluid layout transitions and animations.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">State & Localization</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">TanStack Query</span> for server state synchronization and caching. <span className="font-medium text-foreground">Next Intl</span> for comprehensive internationalization and multi-lingual support.
              </p>
            </div>
          </div>
        </div>

        {/* Backend */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5" />
            Backend Architecture
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Core Framework</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">NestJS</span> utilizing <span className="font-medium text-foreground">Fastify</span> adapter for maximum throughput and performance. Built with strict TypeScript.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Data & ORM</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Prisma</span> ORM providing type-safe database access to the primary <span className="font-medium text-foreground">PostgreSQL</span> relational database.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Async & Real-time</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Redis</span> for caching and state tracking. <span className="font-medium text-foreground">BullMQ</span> for background job processing and queues. Native <span className="font-medium text-foreground">WebSocket</span> for real-time bi-directional events.
              </p>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Infrastructure & Operations
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Cpu className="h-4 w-4" /> Containerization & Deployment</h3>
                <p className="text-sm text-muted-foreground">Fully containerized with <span className="font-medium text-foreground">Docker</span>. Deployed and managed via <span className="font-medium text-foreground">Coolify</span> on self-hosted VPS infrastructure.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Blocks className="h-4 w-4" /> CI/CD</h3>
                <p className="text-sm text-muted-foreground">Automated testing, linting, and image builds orchestrated through <span className="font-medium text-foreground">GitHub Actions</span>.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Cloud className="h-4 w-4" /> Edge Network</h3>
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Cloudflare</span> utilized for global CDN caching, DDoS protection, and DNS management.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Database className="h-4 w-4" /> Object Storage</h3>
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Cloudflare R2</span> for zero-egress S3-compatible asset storage (images, documents).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Governance */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2 bg-muted/50">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Technical Governance
          </h2>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <strong>Latest Stable Versions:</strong> Always use the latest major stable releases for all frameworks and libraries.
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              <strong>No Deprecated Libraries:</strong> Strictly forbidden to introduce or maintain dependencies marked as deprecated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
