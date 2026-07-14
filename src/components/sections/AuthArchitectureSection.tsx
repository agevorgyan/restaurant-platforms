import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, KeyRound, Users, Lock, Fingerprint, Activity } from "lucide-react";

export function AuthArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Authentication & Identity</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Secure, multi-tenant identity and access management architecture.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tokens & Sessions */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Tokens & Sessions
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">JWT (Access Tokens)</h3>
              <p className="text-sm text-muted-foreground">Short-lived (15-60 minutes) stateless tokens used for API authorization. Contains `sub` (User ID), `tenant_id`, and `roles` to prevent database lookups on every request.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Refresh Tokens</h3>
              <p className="text-sm text-muted-foreground">Long-lived, opaque tokens stored securely (HttpOnly cookies or secure mobile storage). Used to obtain new JWTs. Stored in Redis with device fingerprinting to allow targeted revocation.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Device Sessions</h3>
              <p className="text-sm text-muted-foreground">Tracks active user sessions across devices. Users can view active devices (e.g., "iPhone 13, London") and remotely terminate them by invalidating the specific Refresh Token in Redis.</p>
            </div>
          </div>
        </div>

        {/* Authentication Methods */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Auth Methods
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Magic Links (Passwordless)</h3>
              <p className="text-sm text-muted-foreground">Primary login for restaurant staff and owners. Reduces support tickets for forgotten passwords. Secure, time-bound, one-time-use tokens delivered via email.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Google & Apple Sign-In</h3>
              <p className="text-sm text-muted-foreground">OAuth 2.0 / OIDC integrations primarily for end-customers during online ordering to reduce checkout friction, but also supported for tenant owners.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">B2B SSO (Future)</h3>
              <p className="text-sm text-muted-foreground">SAML / OIDC support for enterprise restaurant chains wanting to manage access via Okta, Entra ID, etc.</p>
            </div>
          </div>
        </div>

        {/* Authorization (RBAC) */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Authorization (RBAC)
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Roles</h3>
              <p className="text-sm text-muted-foreground">Hierarchical groupings of permissions (e.g., `SuperAdmin`, `TenantOwner`, `Manager`, `Cashier`). A user can have different roles across different branches.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Granular Permissions</h3>
              <p className="text-sm text-muted-foreground">Action-resource mapping. Examples: `menu:read`, `menu:write`, `order:refund`. Guards check these specific permissions, not just roles, ensuring flexibility.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Tenant Isolation Guard</h3>
              <p className="text-sm text-muted-foreground">Middleware that ensures a user`s JWT `tenant_id` matches the resource being accessed. Critical for preventing cross-tenant data leaks.</p>
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Rate Limits</h3>
              <p className="text-sm text-muted-foreground">Redis-backed sliding window rate limiting. Aggressive limits on auth endpoints (login, password reset) to prevent brute-force attacks.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Security Headers & Policies</h3>
              <p className="text-sm text-muted-foreground">Helmet.js for CSP, HSTS, X-Frame-Options. CORS strictly configured to allow only specific tenant domains.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Activity className="h-4 w-4 mr-1" />
                Audit Logs
              </h3>
              <p className="text-sm text-muted-foreground">Immutable tracking of sensitive actions (e.g., `role_changed`, `refund_issued`). Logs capture `actor_id`, `ip_address`, `action`, `resource`, and payload differences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
