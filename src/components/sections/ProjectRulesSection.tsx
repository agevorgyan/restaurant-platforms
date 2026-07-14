import { Separator } from "@/components/ui/separator";
import { FolderGit2, BookOpen, CheckCircle, ShieldAlert, Activity, FileJson, Settings2, Braces, Code, Bug } from "lucide-react";

export function ProjectRulesSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Rules</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Strict guidelines for module implementation and code quality. No exceptions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Rule */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <FolderGit2 className="h-5 w-5" />
            The Golden Rule
          </h2>
          <p className="text-lg">
            Every feature <strong>must</strong> be implemented as an <strong>independent module</strong>. 
          </p>
        </div>

        {/* Documentation & Testing */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Documentation & Tests
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><BookOpen className="h-4 w-4" /> README</h3>
              <p className="text-sm text-muted-foreground">Comprehensive module documentation including architecture, setup, and usage examples.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Code className="h-4 w-4" /> API Documentation</h3>
              <p className="text-sm text-muted-foreground">OpenAPI/Swagger specs or detailed typed definitions for all exposed endpoints and methods.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Tests</h3>
              <p className="text-sm text-muted-foreground">Unit, integration, and e2e tests covering all critical paths and edge cases.</p>
            </div>
          </div>
        </div>

        {/* Safety & Observability */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Safety & Observability
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Validation</h3>
              <p className="text-sm text-muted-foreground">Strict runtime validation for all inputs (e.g., Zod schemas or class-validator).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><FileJson className="h-4 w-4" /> Logging</h3>
              <p className="text-sm text-muted-foreground">Structured JSON logging for audits, debugging, and tracing across distributed services.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Activity className="h-4 w-4" /> Monitoring Hooks</h3>
              <p className="text-sm text-muted-foreground">Metrics integration for APM, tracking latency, error rates, and custom business events.</p>
            </div>
          </div>
        </div>

        {/* Data & Configuration */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Data & Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Settings2 className="h-4 w-4" /> Configuration</h3>
              <p className="text-sm text-muted-foreground">Environment-specific configuration injected via dependency injection. No hardcoded secrets or settings.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Braces className="h-4 w-4" /> DTOs & Types</h3>
              <p className="text-sm text-muted-foreground">Data Transfer Objects to decouple internal domain models from API contracts. Strict TypeScript interfaces.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Bug className="h-4 w-4" /> Error Handling</h3>
              <p className="text-sm text-muted-foreground">Standardized error boundaries and domain-specific exception classes preventing stack trace leaks.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
