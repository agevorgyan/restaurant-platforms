import { Separator } from "@/components/ui/separator";
import { Code2, FileCode, FolderClosed, Type, FileJson, Component, Database, Network, TestTube, FileText, Zap } from "lucide-react";

export function CodingStandardsSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coding Standards</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Strict naming conventions and architectural patterns to guarantee consistency across the monorepo.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Naming Conventions */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <Type className="h-5 w-5" />
            General Naming Conventions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Folders</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">kebab-case</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `feature-modules`, `auth-guards`</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Files (Logic)</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">kebab-case.ts</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `user.service.ts`, `string-utils.ts`</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Files (React Components)</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">PascalCase.tsx</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `Button.tsx`, `UserProfile.tsx`</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Variables & Functions</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">camelCase</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `calculateTotal()`, `isUserActive`</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Constants</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">UPPER_SNAKE_CASE</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `MAX_RETRY_COUNT`, `API_URL`</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Interfaces & Types</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">PascalCase</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `UserData`, `OrderState` (No 'I' prefix)</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">Enums</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">PascalCase (Keys: UPPER_SNAKE_CASE)</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `enum OrderStatus { PENDING, PAID }`</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-sm">React Hooks</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">camelCase (use*)</p>
              <p className="text-xs text-muted-foreground mt-2">e.g., `useUserData()`, `useTranslation()`</p>
            </div>
          </div>
        </div>

        {/* Backend & Domain (NestJS / CQRS) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5" />
            Backend & Domain Architecture
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Code2 className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Services & Repositories</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Services:</strong> Named `[Entity]Service` (e.g., `OrderService`). Handle orchestration.<br/>
                  <strong>Repositories:</strong> Named `[Entity]Repository` (e.g., `UserRepository`). Handle DB access. Never inject Repositories directly into Controllers.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Network className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Controllers & DTOs</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Controllers:</strong> Named `[Entity]Controller`. Handle HTTP transport only.<br/>
                  <strong>DTOs:</strong> Named `[Action][Entity]Dto` (e.g., `CreateUserDto`). Placed in `dto/` folder. Validated strictly via `class-validator` / Zod.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Zap className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">CQRS (Commands, Queries, Events)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Commands:</strong> `[Action][Entity]Command` (e.g., `CreateOrderCommand`). Mutate state.<br/>
                  <strong>Queries:</strong> `Get[Entity]Query` (e.g., `GetOrderDetailsQuery`). Read state.<br/>
                  <strong>Events:</strong> `[Entity][ActionPastTense]Event` (e.g., `OrderCreatedEvent`). Trigger side-effects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Frontend (React) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Component className="h-5 w-5" />
            Frontend Architecture (React)
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Component className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Components</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Server Components by default in Next.js App Router. Use `'use client'` only at the leaf nodes where interactivity or hooks are strictly required. Keep components pure.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Code2 className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Hooks</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Extract complex state logic into custom hooks. Do not fetch data directly inside UI components; use TanStack Query hooks (e.g., `useGetOrders()`).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality & Docs */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Testing & Documentation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg border flex flex-col gap-2 bg-muted/30">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <TestTube className="h-5 w-5" />
                Testing Standards
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4 mt-2">
                <li><strong>Files:</strong> Named `*.spec.ts` (Unit) or `*.e2e-spec.ts` (End-to-End).</li>
                <li><strong>Unit Tests:</strong> Every service, utility, and complex hook must have unit tests. Focus on testing logic, not framework internals.</li>
                <li><strong>Integration/E2E:</strong> Test critical business flows (e.g., Checkout, POS Sync) against a real (containerized) database.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border flex flex-col gap-2 bg-muted/30">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <FileText className="h-5 w-5" />
                Documentation
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4 mt-2">
                <li><strong>API Docs:</strong> All public REST endpoints must be decorated with OpenAPI/Swagger metadata.</li>
                <li><strong>Code Docs:</strong> Use JSDoc/TSDoc comments for complex public functions, interfaces, and classes. Explain the "Why", not just the "What".</li>
                <li><strong>READMEs:</strong> Every app and package must have an up-to-date `README.md` explaining setup and architecture.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
