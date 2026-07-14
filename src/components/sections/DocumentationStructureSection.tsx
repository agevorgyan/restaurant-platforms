import { Separator } from "@/components/ui/separator";
import { Book, FileText, Users, Network, Code, Rocket, Shield, Database, Palette, ListChecks, Map as MapIcon, History } from "lucide-react";

export function DocumentationStructureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation Structure</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Centralized knowledge base architecture. Every document serves a distinct purpose to align engineering, product, and design.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Core Project Documents */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Book className="h-5 w-5" />
            Core Repository Documents
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                README.md
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                The entry point. Contains the high-level vision, tech stack overview, prerequisite installations, and commands to spin up the local development environment.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500" />
                CONTRIBUTING.md
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Onboarding guide for new engineers. Details the Git branching strategy, semantic versioning rules, PR requirements, and code review etiquette.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <History className="h-4 w-4 text-amber-500" />
                CHANGELOG.md
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Chronological list of notable changes for each release. Auto-generated from semantic commits to provide transparency to stakeholders.
              </p>
            </div>
          </div>
        </div>

        {/* Engineering & Architecture */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5" />
            Engineering & Architecture
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Network className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">ARCHITECTURE.md</h3>
                <p className="text-xs text-muted-foreground mt-1">Explains the system design, boundaries between apps/packages, event-driven flows, and links to specific ADRs.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Code className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">API.md</h3>
                <p className="text-xs text-muted-foreground mt-1">Defines the REST/GraphQL contracts, authentication flows, rate limits, and WebSocket payload structures.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Database className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">DATABASE.md</h3>
                <p className="text-xs text-muted-foreground mt-1">Documents the Prisma schema rationale, multi-tenant isolation strategy (Row-Level Security), caching layers, and backup policies.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ops, Standards & Vision */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Ops, Standards & Vision
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Rocket className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">DEPLOYMENT.md</h3>
                <p className="text-xs text-muted-foreground mt-1">Step-by-step CI/CD pipeline documentation, Docker container orchestration, and rollback procedures for zero-downtime releases.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Shield className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">SECURITY.md</h3>
                <p className="text-xs text-muted-foreground mt-1">Outlines secret management, vulnerability reporting processes, compliance standards (PCI/GDPR), and audit logging.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <ListChecks className="h-6 w-6 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">CODING_STANDARDS.md</h3>
                <p className="text-xs text-muted-foreground mt-1">Strict naming conventions, folder structures, testing mandates, and architectural patterns (DDD, CQRS) that must be followed.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Palette className="h-6 w-6 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">UI_GUIDELINES.md</h3>
                <p className="text-xs text-muted-foreground mt-1">Design philosophy, Tailwind conventions, accessibility (a11y) requirements, and motion/animation principles.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <MapIcon className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">ROADMAP.md</h3>
                <p className="text-xs text-muted-foreground mt-1">High-level product vision, upcoming epics, and technical debt reduction strategies over the next 3-4 quarters.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
