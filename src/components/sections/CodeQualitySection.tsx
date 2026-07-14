import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ShieldCheck, Zap, Globe, Accessibility, AlertTriangle, FileCheck, Code2 } from "lucide-react";

export function CodeQualitySection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Code Quality & Standards</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Non-negotiable coding standards ensuring reliability, performance, and maintainability.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Principles */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Core Principles
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Accessibility className="h-4 w-4" /> Accessibility First</h3>
              <p className="text-sm text-muted-foreground">Every component must meet WCAG standards. Screen readers, keyboard navigation, and contrast ratios are not afterthoughts.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Zap className="h-4 w-4" /> Performance First</h3>
              <p className="text-sm text-muted-foreground">Optimize Core Web Vitals. Code-split bundles, defer non-critical JS, and utilize efficient caching strategies.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Security First</h3>
              <p className="text-sm text-muted-foreground">Implement CSRF/XSS protection, rate limiting, secure cookies, and strict input validation on all boundaries.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Globe className="h-4 w-4" /> SEO First</h3>
              <p className="text-sm text-muted-foreground">Semantic HTML, structured metadata, and fast Time-to-First-Byte (TTFB) ensuring maximum search visibility.</p>
            </div>
          </div>
        </div>

        {/* Linting & Formatting */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Linting & Tooling
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">ESLint & Prettier</h3>
              <p className="text-sm text-muted-foreground">Strict configuration enforced in CI pipelines. Automated formatting ensures consistent code style across the entire repository.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> No Console.log</h3>
              <p className="text-sm text-muted-foreground">Use dedicated structured logging mechanisms instead of `console.log`. Pre-commit hooks will reject leftover debug statements.</p>
            </div>
          </div>
        </div>

        {/* Component Architecture */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            React Architecture
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Server Components by Default</h3>
              <p className="text-sm text-muted-foreground">Maximize React Server Components (RSC) to reduce client JS payloads, fetch data closer to the database, and improve initial load performance.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Client Components Sparingly</h3>
              <p className="text-sm text-muted-foreground">Only utilize `"use client"` when strictly necessary for interactivity, hooks (e.g., `useState`), or browser APIs.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg text-amber-500">Error Boundaries</h3>
              <p className="text-sm text-muted-foreground">Wrap independent UI modules in error boundaries to prevent a single component failure from crashing the entire application.</p>
            </div>
          </div>
        </div>

        {/* TypeScript Standards */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm border-primary/20 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Code2 className="h-5 w-5" />
            TypeScript Strictness
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Strict TypeScript</h3>
              <p className="text-sm text-muted-foreground">The <code className="bg-muted px-1 rounded">strict: true</code> flag is enabled in `tsconfig.json`. Implicit defaults or loose typings are rejected.</p>
            </div>
            <Separator className="bg-primary/20" />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> No 'any'</h3>
              <p className="text-sm text-muted-foreground">The <code className="bg-destructive/10 text-destructive px-1 rounded">any</code> type is strictly forbidden. Use <code className="bg-muted px-1 rounded">unknown</code> if types are truly dynamic, followed by type narrowing or Zod parsing.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
