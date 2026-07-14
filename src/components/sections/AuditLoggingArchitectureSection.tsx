import { Separator } from "@/components/ui/separator";
import { ScrollText, FileClock, ShieldCheck, Database, History, Eye, Users, Store, Receipt, CreditCard, Menu, Settings, Key, UserCog, Lock } from "lucide-react";

export function AuditLoggingArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logging Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Provides a definitive, immutable record of all critical state changes and security events for accountability, compliance, and forensics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Core Concepts */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-indigo-500" />
            Core Concepts
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Lock className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Immutability</h3>
                <p className="text-xs text-muted-foreground mt-1">Logs are append-only. They cannot be modified or deleted, ensuring a tamper-proof history.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Eye className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Contextual Enrichment</h3>
                <p className="text-xs text-muted-foreground mt-1">Captures Who, What, When, Where, and Why (User ID, IP, Action, Timestamp, Diff).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50 sm:col-span-2">
              <History className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Asynchronous Processing</h3>
                <p className="text-xs text-muted-foreground mt-1">Audit logs are emitted as events and processed by background workers to avoid blocking primary business transactions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Storage & Compliance */}
        <div className="space-y-6 md:col-span-12 lg:col-span-4">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-rose-500" />
              Storage & Security
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Database className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Hot vs Cold Storage</h3>
                  <p className="text-xs text-muted-foreground mt-1">Recent logs in fast JSONB/Elasticsearch. Archived logs in cold storage (S3 Glacier).</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <ShieldCheck className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">PII Redaction</h3>
                  <p className="text-xs text-muted-foreground mt-1">Sensitive data (CC numbers, passwords) is never logged. Emails are obfuscated where possible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracked Events */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileClock className="h-5 w-5 text-emerald-500" />
            Tracked Events & Domains
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Key className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-sm">Authentication</h3>
              <p className="text-xs text-muted-foreground">Logins, logouts, MFA, and failed attempts.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <UserCog className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-sm">Users & RBAC</h3>
              <p className="text-xs text-muted-foreground">Role assignments, permission changes, and user management.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Store className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm">Restaurants</h3>
              <p className="text-xs text-muted-foreground">Onboarding, billing changes, and operating hours.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Settings className="h-5 w-5 text-gray-500" />
              <h3 className="font-bold text-sm">Settings</h3>
              <p className="text-xs text-muted-foreground">Modifications to global tenant configurations.</p>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Menu className="h-5 w-5 text-orange-500" />
              <h3 className="font-bold text-sm">Menu Changes</h3>
              <p className="text-xs text-muted-foreground">Price updates, availability, and allergen modifications.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Receipt className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-sm">Orders</h3>
              <p className="text-xs text-muted-foreground">State transitions (placed, fulfilled, canceled).</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <CreditCard className="h-5 w-5 text-teal-500" />
              <h3 className="font-bold text-sm">Payments</h3>
              <p className="text-xs text-muted-foreground">Refunds issued and gateway interactions.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
