import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function PRDSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Requirements Document (PRD)</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Module 1: Premium QR Menu & Online Ordering
        </p>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
          <TabsTrigger value="goals" className="py-2">Goals & Users</TabsTrigger>
          <TabsTrigger value="requirements" className="py-2">Requirements</TabsTrigger>
          <TabsTrigger value="scope" className="py-2">Scope & Future</TabsTrigger>
          <TabsTrigger value="acceptance" className="py-2">Acceptance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-6 mt-6">
          <div className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Business Goals</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Launch a premium, frictionless QR menu and ordering experience for dine-in and takeout.</li>
              <li>Establish the foundational multi-tenant architecture to support 100k+ restaurants.</li>
              <li>Achieve sub-second load times for menus to prevent customer drop-off.</li>
              <li>Provide seamless onboarding for Restaurant Owners.</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Target Users</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <Badge variant="secondary" className="mb-2">Customer</Badge>
                <p className="text-sm text-muted-foreground">Wants to scan a QR code, view beautiful food imagery, customize their order, and pay quickly via Apple Pay/Google Pay without downloading an app.</p>
              </div>
              <div className="rounded-lg border p-4">
                <Badge variant="secondary" className="mb-2">Restaurant Owner</Badge>
                <p className="text-sm text-muted-foreground">Needs an easy-to-use dashboard to manage menus, track live orders, view basic analytics, and configure Stripe payouts.</p>
              </div>
              <div className="rounded-lg border p-4">
                <Badge variant="secondary" className="mb-2">Restaurant Staff</Badge>
                <p className="text-sm text-muted-foreground">Requires a live, auto-updating order queue (tablet/web) to prepare and fulfill orders without missing a beat.</p>
              </div>
              <div className="rounded-lg border p-4">
                <Badge variant="secondary" className="mb-2">Super Admin</Badge>
                <p className="text-sm text-muted-foreground">Platform operator managing tenant onboarding, subscription billing, and global platform health.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold">Functional Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Menu Management:</strong> Create categories, items, and modifier groups (required/optional, max/min selections).</li>
                <li><strong>Ordering Flow:</strong> Cart management, tipping, tax calculation, checkout via Stripe.</li>
                <li><strong>Order Management:</strong> Real-time dashboard for staff (New, Preparing, Ready, Completed).</li>
                <li><strong>Tenant Config:</strong> Custom branding (logo, primary color), operating hours, table management.</li>
              </ul>
            </div>
            <div className="space-y-4 rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold">Non-Functional Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Performance:</strong> Menu load under 1s (Edge caching via Cloudflare).</li>
                <li><strong>Scalability:</strong> Architecture supports 100,000 tenants without degradation.</li>
                <li><strong>Availability:</strong> 99.9% uptime SLA. Offline resilience for staff tablets (future POS prep).</li>
                <li><strong>Security:</strong> PCI compliance (via Stripe elements), strict tenant data isolation.</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scope" className="space-y-6 mt-6">
           <div className="space-y-4 rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold">MVP Scope (Release 1)</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>QR Dine-in Orders</Badge>
                <Badge>Pickup Orders</Badge>
                <Badge>Stripe Payments</Badge>
                <Badge>Menu Management</Badge>
                <Badge>Live Order Queue</Badge>
              </div>
              <h2 className="text-xl font-semibold mt-6">Out of Scope / Future</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Native Mobile POS</Badge>
                <Badge variant="outline">Hardware KDS integration</Badge>
                <Badge variant="outline">Advanced Inventory Routing</Badge>
                <Badge variant="outline">Loyalty Points</Badge>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="acceptance" className="space-y-6 mt-6">
           <div className="space-y-4 rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold">Acceptance Criteria (Key Flows)</h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <div className="font-medium text-foreground w-24 shrink-0">Customer:</div>
                  <div>Given I scan a table QR code, When the page loads, Then I see the correct restaurant menu in under 1 second, and the cart is bound to my specific table number.</div>
                </li>
                <li className="flex gap-2">
                  <div className="font-medium text-foreground w-24 shrink-0">Checkout:</div>
                  <div>Given I have items in my cart with modifiers, When I checkout, Then taxes and tips are calculated correctly, and I can pay via Apple Pay seamlessly.</div>
                </li>
                <li className="flex gap-2">
                  <div className="font-medium text-foreground w-24 shrink-0">Staff:</div>
                  <div>Given a new order is placed, When I am looking at the Order Dashboard, Then the order appears immediately without requiring a page refresh (Event-driven).</div>
                </li>
              </ul>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
