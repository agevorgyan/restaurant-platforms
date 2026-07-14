import { Separator } from "@/components/ui/separator";
import { ShieldAlert, Lock, Key, Globe, FileCode, Shield, Webhook, Fingerprint, Database, FormInput, Network } from "lucide-react";

export function SecurityArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Foundational defenses protecting tenant data and end-users. Security is deeply integrated into the platform framework to prevent vulnerabilities by default.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Application Security */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-500" />
            Application Security
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Globe className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Headers & CORS</h3>
                <p className="text-xs text-muted-foreground mt-1">Strict CSP, HSTS, and X-Content-Type-Options. CORS restricted to verified tenant domains.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Network className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Rate Limiting</h3>
                <p className="text-xs text-muted-foreground mt-1">IP and Tenant-based limits prevent brute force and noisy neighbors. Strict limits on auth endpoints.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Shield className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">CSRF & XSS</h3>
                <p className="text-xs text-muted-foreground mt-1">SameSite cookies and tokens for CSRF. UI frameworks auto-escape rendering to prevent XSS.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Database className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">SQL Injection</h3>
                <p className="text-xs text-muted-foreground mt-1">Prevented globally via ORM (Prisma/Drizzle). Raw queries require parameterized inputs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="space-y-6 md:col-span-12 lg:col-span-4">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-500" />
              Data Protection
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <Lock className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Encryption</h3>
                  <p className="text-xs text-muted-foreground mt-1">AES-256 for data at rest. TLS 1.2+ strictly enforced for data in transit (HTTPS/WSS).</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <FileCode className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Secrets Management</h3>
                  <p className="text-xs text-muted-foreground mt-1">Never hardcoded. Injected at runtime via secure vaults (AWS Secrets Manager).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication & Integration */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Key className="h-5 w-5 text-rose-500" />
            Authentication & Integration
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Fingerprint className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-sm">Password Policy</h3>
              <p className="text-xs text-muted-foreground">Strong policies, breached password checks (HIBP), and bcrypt/Argon2 hashing.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Key className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm">API Keys</h3>
              <p className="text-xs text-muted-foreground">Scoped, easily revokable. Stored as cryptographic hashes; raw keys shown only once.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Webhook className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-sm">Webhooks</h3>
              <p className="text-xs text-muted-foreground">Outbound events signed with cryptographic HMAC signatures to ensure origin and integrity.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
