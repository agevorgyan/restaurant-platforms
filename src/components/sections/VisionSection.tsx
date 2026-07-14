export function VisionSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vision & Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Enterprise-grade Restaurant Platform architecture built for scale.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-2 bg-primary/5 border-primary/20">
          <h2 className="text-xl font-semibold text-primary">1. Vision & Core Philosophy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            We are building what will become one of the world's largest Restaurant SaaS platforms. 
            Every technical decision, architectural pattern, and code commit must support that future.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Starting with a premium QR Menu and Online Ordering experience, the architecture is designed as a multi-tenant platform capable of seamlessly integrating future modules (POS, Kitchen Display, CRM, Inventory, and Loyalty), scaling to support over 100,000 restaurants globally. We optimize for long-term maintainability over speed of development.
          </p>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">2. Architecture Principles</h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li><strong>Domain-Driven Design (DDD):</strong> Strict boundaries around core restaurant domains.</li>
            <li><strong>Clean Architecture:</strong> Separation of business logic from infrastructure/frameworks.</li>
            <li><strong>Event-Driven:</strong> Asynchronous communication between bounded contexts (e.g., Order Placed -&gt; KDS Updated).</li>
            <li><strong>API-First & Headless:</strong> Next.js frontend consumes NestJS APIs.</li>
            <li><strong>Multi-Tenant by Design:</strong> Tenant isolation at the database (row-level or schema) and caching layers.</li>
            <li><strong>SOLID Principles:</strong> Enforced at the code level for maintainability.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">3. Bounded Contexts & Domain Model</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium">Menu & Catalog</h3>
            <p className="text-xs text-muted-foreground mt-1">Categories, Items, Modifiers, Pricing, Availability, Media.</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium">Orders & Fulfillment</h3>
            <p className="text-xs text-muted-foreground mt-1">Order Lifecycle, Cart, Checkout, Tables, Delivery/Pickup.</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium">Payments & Billing</h3>
            <p className="text-xs text-muted-foreground mt-1">Stripe Integration, Refunds, Taxes, Tips, Subscriptions (SaaS).</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium">Identity & Access</h3>
            <p className="text-xs text-muted-foreground mt-1">Authentication, Roles (Owner, Staff, Admin), Tenants, Locations.</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium">Inventory (Future)</h3>
            <p className="text-xs text-muted-foreground mt-1">Stock levels, Recipes, Purchase Orders, Suppliers.</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium">CRM & Loyalty (Future)</h3>
            <p className="text-xs text-muted-foreground mt-1">Customer profiles, Points, Rewards, Marketing campaigns.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">4. Technology Stack & Deployment</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <ul>
            <li><strong>Frontend:</strong> Next.js (React), Tailwind CSS, shadcn/ui. Deployed on Cloudflare Pages/Workers for edge performance.</li>
            <li><strong>Backend:</strong> NestJS (Node.js). Containerized via Docker, orchestrated via Kubernetes or Cloud Run.</li>
            <li><strong>Database:</strong> PostgreSQL (managed) with Prisma ORM. Multi-tenant row-level security (RLS).</li>
            <li><strong>Caching & Events:</strong> Redis for fast read caching, session management, and pub/sub event brokering.</li>
            <li><strong>Monorepo:</strong> Turborepo to manage shared packages (UI, types, validation) across apps.</li>
            <li><strong>Storage:</strong> Cloudflare R2 for cost-effective, globally distributed asset storage (images, menus).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
