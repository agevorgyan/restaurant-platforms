import { Separator } from "@/components/ui/separator";
import { 
  Zap, CalendarClock, MessageSquare, History, Tag, 
  Store, UtensilsCrossed, ShoppingBag, CreditCard, 
  XOctagon, CheckCircle2, UserPlus, Ticket, Server, 
  Workflow
} from "lucide-react";

export function DomainEventsSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Domain Events</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Business-significant occurrences capturing state changes. Events enforce eventual consistency and decouple Bounded Contexts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Naming Conventions */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5 text-indigo-500" />
            Naming Conventions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <History className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Past Tense Verb</h3>
                <p className="text-xs text-muted-foreground mt-1">Events represent things that have <strong>already happened</strong>. Use <code>OrderCreated</code>, never <code>CreateOrder</code>.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <MessageSquare className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Noun + Verb Pattern</h3>
                <p className="text-xs text-muted-foreground mt-1">Clearly identify the Aggregate or Entity followed by the action. e.g., <code>[Subject][Action]</code>.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Server className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Context Boundaries</h3>
                <p className="text-xs text-muted-foreground mt-1">Integration events crossing bounded contexts should be namespaced (e.g., <code>Billing.SubscriptionRenewed</code>).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Defined Events Grid */}
        <div className="space-y-6 md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Core Domain Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            
            <EventCard 
              icon={<Store className="text-blue-500" />} 
              name="RestaurantCreated" 
              desc="Emitted when a new tenant signs up."
              triggers="Triggers onboarding workflows, default role generation, and billing account creation."
            />
            <EventCard 
              icon={<Store className="text-emerald-500" />} 
              name="RestaurantActivated" 
              desc="Emitted when a restaurant goes live."
              triggers="Triggers SEO indexing and marketplace visibility."
            />

            <EventCard 
              icon={<UtensilsCrossed className="text-amber-500" />} 
              name="MenuPublished" 
              desc="Emitted when menu draft changes are finalized."
              triggers="Triggers cache invalidation at the Edge and QR code generation."
            />
            <EventCard 
              icon={<UtensilsCrossed className="text-purple-500" />} 
              name="ProductUpdated" 
              desc="Emitted when product details change."
              triggers="Triggers cart re-validation for active user sessions."
            />

            <EventCard 
              icon={<ShoppingBag className="text-indigo-500" />} 
              name="OrderCreated" 
              desc="Emitted when an order is initially assembled."
              triggers="Triggers inventory reservation (soft allocation) and fraud checks."
            />
            <EventCard 
              icon={<CheckCircle2 className="text-teal-500" />} 
              name="OrderConfirmed" 
              desc="Emitted when the restaurant officially accepts the order."
              triggers="Triggers ETA calculations and customer notifications."
            />
            <EventCard 
              icon={<CreditCard className="text-emerald-500" />} 
              name="OrderPaid" 
              desc="Emitted when payment gateway confirms funds capture."
              triggers="Triggers transition to the kitchen queue (KDS)."
            />
            <EventCard 
              icon={<XOctagon className="text-rose-500" />} 
              name="OrderCancelled" 
              desc="Emitted when an order is voided."
              triggers="Triggers stock release, automated refunds, and manager alerts."
            />
            <EventCard 
              icon={<CheckCircle2 className="text-blue-500" />} 
              name="OrderCompleted" 
              desc="Emitted when order is handed off or delivered."
              triggers="Triggers loyalty point accumulation and review solicitation."
            />

            <EventCard 
              icon={<UserPlus className="text-pink-500" />} 
              name="CustomerRegistered" 
              desc="Emitted when a new guest creates an account."
              triggers="Triggers welcome emails and initial loyalty point bonuses."
            />
            <EventCard 
              icon={<Ticket className="text-orange-500" />} 
              name="CouponApplied" 
              desc="Emitted when a discount code is attached to a cart."
              triggers="Triggers usage limit increments and analytics tracking."
            />

          </div>
        </div>

      </div>
    </div>
  );
}

function EventCard({ icon, name, desc, triggers }: { icon: React.ReactNode, name: string, desc: string, triggers: string }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors">
      <div className="flex items-center gap-2">
        <div className="[&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </div>
        <h3 className="font-bold text-sm text-foreground">{name}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
      <Separator className="my-1" />
      <div className="flex items-start gap-1.5">
        <Workflow className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-relaxed">
          {triggers}
        </p>
      </div>
    </div>
  );
}
