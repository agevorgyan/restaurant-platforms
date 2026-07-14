import { Separator } from "@/components/ui/separator";
import { Zap, Send, Mailbox, Repeat, AlertTriangle, ListOrdered, Shield, Hash, GitBranch, FileJson, Activity, Server } from "lucide-react";

export function EventDrivenArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Driven Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Asynchronous, decoupled communication for high availability and fault tolerance. Powers background workers, real-time updates, and eventual consistency.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Concepts */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500" />
            Core Concepts
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Activity className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Events</h3>
                <p className="text-xs text-muted-foreground mt-1">Immutable records of past state changes (e.g., OrderPlaced).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Send className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Publish / Subscribe</h3>
                <p className="text-xs text-muted-foreground mt-1">Producers publish to an Event Bus; Consumers subscribe to topics.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Server className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Async Processing</h3>
                <p className="text-xs text-muted-foreground mt-1">Non-blocking background execution (e.g., sending emails, generating PDFs).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reliability & Fault Tolerance */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              Reliability & Fault Tolerance
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Repeat className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Retries & DLQ</h3>
                  <p className="text-xs text-muted-foreground mt-1">Exponential backoff for transient failures. Exhausted retries go to a Dead Letter Queue for manual replay.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <ListOrdered className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Ordering</h3>
                  <p className="text-xs text-muted-foreground mt-1">Partition keys (e.g., OrderId) guarantee strict ordering for related events.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Shield className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Idempotency</h3>
                  <p className="text-xs text-muted-foreground mt-1">Consumers safely handle duplicate deliveries using an Idempotency Key (e.g., EventId).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Naming & Versioning */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Hash className="h-5 w-5 text-amber-500" />
            Naming & Versioning
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <Hash className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Naming Convention</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Pattern: <code>[domain].[entity].[action]</code> in past tense.<br/>
                  Example: <code>sales.order.placed</code>
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <GitBranch className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Versioning</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Breaking payload changes require version suffixes (e.g., <code>.v2</code>). Consumers must remain backwards compatible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Envelope Structure */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileJson className="h-5 w-5 text-teal-500" />
            Standard Event Envelope
          </h2>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto text-muted-foreground">
{`{
  "eventId": "evt_12345",
  "eventType": "sales.order.placed",
  "version": "v1",
  "timestamp": "2026-07-13T14:06:20Z",
  "tenantId": "rest_987",
  "correlationId": "req_abc",
  "data": { ... } // Type-safe domain payload
}`}
          </pre>
        </div>

      </div>
    </div>
  );
}
