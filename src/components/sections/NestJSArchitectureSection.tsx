import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Server, FolderTree, Layers, GitBranch, Zap, ShieldCheck } from "lucide-react";

export function NestJSArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NestJS Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Scalable backend architecture for the multi-tenant Enterprise Restaurant Platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Architecture */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Core Architecture
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Modules</h3>
              <p className="text-sm text-muted-foreground">Domain-driven feature modules (e.g., OrdersModule, MenuModule, IdentityModule). Encapsulates cohesive business logic.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Controllers</h3>
              <p className="text-sm text-muted-foreground">API entry points. Handles HTTP routing, input extraction, and delegates work to Services. Kept thin and devoid of business logic.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Services</h3>
              <p className="text-sm text-muted-foreground">The heart of the application. Contains business rules, orchestrates data flow, and calls external services or repositories.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Repositories</h3>
              <p className="text-sm text-muted-foreground">Data access layer (wrapping Prisma). Abstracts database queries, ensuring Services remain database-agnostic.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">DTOs & Validation</h3>
              <p className="text-sm text-muted-foreground">Data Transfer Objects defining shape of incoming/outgoing data. Uses class-validator for strict input sanitization.</p>
            </div>
          </div>
        </div>

        {/* Async & Real-time */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Async & Real-time
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Events (Event Emitter)</h3>
              <p className="text-sm text-muted-foreground">In-memory pub/sub for decoupling domains (e.g., emit `OrderCreated` to trigger notifications without blocking the request).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">BullMQ (Job Queues)</h3>
              <p className="text-sm text-muted-foreground">Redis-backed persistent message queues for heavy lifting: processing webhook payloads, generating reports, sending batched emails.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Redis</h3>
              <p className="text-sm text-muted-foreground">Used as a primary caching layer (Menu caching per branch), session store, and backbone for BullMQ and WebSocket adapters.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">WebSockets</h3>
              <p className="text-sm text-muted-foreground">Real-time bi-directional communication. Pushes order updates instantly to Kitchen Display Systems (KDS) and Customer tracking screens.</p>
            </div>
          </div>
        </div>

        {/* Cross-Cutting */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Cross-Cutting Concerns
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">Guards</h3>
                <p className="text-sm text-muted-foreground">Authentication (JWT verification) and Authorization (Role-Based Access Control / RBAC) applied before route execution.</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">Interceptors</h3>
                <p className="text-sm text-muted-foreground">Hooks into request/response cycle. Used for global response formatting, logging execution times, and caching responses.</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">API Versioning</h3>
                <p className="text-sm text-muted-foreground">URI-based versioning (e.g., `/v1/orders`). Ensures backward compatibility for mobile apps and third-party integrations.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">Filters</h3>
                <p className="text-sm text-muted-foreground">Global Exception Filters catch unhandled errors, log them, and transform them into standard JSON error responses.</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">Middleware</h3>
                <p className="text-sm text-muted-foreground">Request pre-processing: tenant resolution (extracting Tenant ID from headers/tokens), IP whitelisting, and rate limiting.</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">Swagger</h3>
                <p className="text-sm text-muted-foreground">Auto-generated OpenAPI specification through NestJS decorators. Acts as the source of truth for frontend API clients.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Folder Structure */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Folder Structure
          </h2>
          <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre">
            {`src/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── core/
│   ├── database/
│   ├── redis/
│   └── config/
├── modules/
│   ├── orders/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── events/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   └── menu/
├── app.module.ts
└── main.ts`}
          </div>
        </div>

        {/* QA & Standards */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            QA, CI & Standards
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Testing Strategy</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Unit Tests (Jest):</strong> Fast, isolated tests for Services and pure functions. Mocking Repositories.<br/>
                <strong>e2e Tests (Supertest):</strong> Spinups a test database. Hits Controllers, tests validation, DB writes, and responses.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">CI/CD Pipeline</h3>
              <p className="text-sm text-muted-foreground">
                GitHub Actions: Lint -&gt; Typecheck -&gt; Unit Tests -&gt; e2e Tests -&gt; Docker Build -&gt; Push to Registry -&gt; Deploy.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Coding Standards</h3>
              <p className="text-sm text-muted-foreground">
                Strict TypeScript. ESLint + Prettier. No \`any\` types. Max complexity rules. Mandatory DTOs for all endpoints. Consistent naming conventions (camelCase variables, PascalCase classes).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
