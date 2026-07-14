import { Separator } from "@/components/ui/separator";
import { ListChecks, GitPullRequest, Search, ShieldAlert, Cpu, Lightbulb, PenTool, LayoutTemplate } from "lucide-react";

export function ExecutionRulesSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Execution Rules</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The mandatory analytical process that must occur before a single line of code is written.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Principles */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <ShieldAlert className="h-5 w-5" />
            Think Before You Code
          </h2>
          <p className="text-lg">
            Never generate quick hacks. Every feature must be modular. Every decision must be future-proof. If a feature can affect future scalability, stop and redesign first.
          </p>
        </div>

        {/* The Pipeline */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            The Pre-Coding Pipeline
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Before writing any code, the following steps must be explicitly executed and documented:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 font-medium text-primary"><Search className="h-4 w-4" /> 1. Analyze the Request</div>
              <p className="text-xs text-muted-foreground">Deeply understand the domain requirements, edge cases, and business logic before technical planning.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 font-medium text-primary"><Cpu className="h-4 w-4" /> 2. Future Implications</div>
              <p className="text-xs text-muted-foreground">Identify how this feature will impact scaling to 100,000+ restaurants, database load, and multi-tenancy.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 font-medium text-primary"><LayoutTemplate className="h-4 w-4" /> 3. Explain Architecture</div>
              <p className="text-xs text-muted-foreground">Outline the architectural patterns (e.g. CQRS, Repositories, Event-Driven) that will be utilized.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 font-medium text-primary"><ListChecks className="h-4 w-4" /> 4. Implementation Plan</div>
              <p className="text-xs text-muted-foreground">Create a step-by-step breakdown of the modules, DTOs, schemas, and components to be created.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 font-medium text-primary"><ShieldAlert className="h-4 w-4" /> 5. Generate Risks</div>
              <p className="text-xs text-muted-foreground">Proactively highlight potential bottlenecks, security vulnerabilities, or single points of failure.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 font-medium text-primary"><GitPullRequest className="h-4 w-4" /> 6. Generate Alternatives</div>
              <p className="text-xs text-muted-foreground">Propose at least one alternative technical approach and justify why the chosen path is superior.</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
            <h3 className="font-semibold text-lg text-destructive flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              7. Only Then Write Code
            </h3>
            <p className="text-sm text-destructive/80 mt-1">Code generation is the final step, never the first.</p>
          </div>
        </div>

        {/* Stability & Compatibility */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2 border-primary/20 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            Stability & Compatibility
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">No Unjustified Rewrites</h3>
              <p className="text-sm text-muted-foreground">Never rewrite existing architecture without explaining why. Always justify architectural shifts.</p>
            </div>
            <Separator className="bg-primary/10" />
            <div>
              <h3 className="font-semibold text-lg">Preserve Contracts</h3>
              <p className="text-sm text-muted-foreground">Never break existing APIs. Always preserve backwards compatibility for clients and integrations.</p>
            </div>
            <Separator className="bg-primary/10" />
            <div>
              <h3 className="font-semibold text-lg">Zero Technical Debt</h3>
              <p className="text-sm text-muted-foreground">Never introduce technical debt. Do not sacrifice long-term maintainability for short-term velocity.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
