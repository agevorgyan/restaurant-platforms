import { Separator } from "@/components/ui/separator";
import { FileJson, ArrowRightLeft, ShieldCheck, ListOrdered, Filter, Search, SortDesc, FileBadge2, AlertCircle, FileCheck2, GitBranch } from "lucide-react";

export function ApiContractStandardsSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Contract Standards</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Strict rules for designing, documenting, and implementing RESTful APIs. Ensures consistency for front-end, mobile, and third-party clients.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* REST & OpenAPI */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-indigo-500" />
            REST & OpenAPI
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <FileJson className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">RESTful Principles</h3>
                <p className="text-xs text-muted-foreground mt-1">Resources as nouns (`/orders`). Standard HTTP methods (GET, POST, PUT, PATCH, DELETE).</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <FileBadge2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">OpenAPI 3.0+ Specification</h3>
                <p className="text-xs text-muted-foreground mt-1">Single source of truth. Client SDKs and TypeScript types are auto-generated from the spec.</p>
              </div>
            </div>
          </div>
        </div>

        {/* DTOs & Validation */}
        <div className="space-y-6 md:col-span-12 lg:col-span-6">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              DTOs & Validation
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <FileJson className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Data Transfer Objects (DTOs)</h3>
                  <p className="text-xs text-muted-foreground mt-1">Define exact request/response shapes, separating contracts from internal DB schemas.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <ShieldCheck className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Strict Validation</h3>
                  <p className="text-xs text-muted-foreground mt-1">All inputs (body, query, params) validated via Zod/class-validator. Fails fast with 400 Bad Request.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-amber-500" />
            Collection Endpoints
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <ListOrdered className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-sm">Pagination</h3>
              <p className="text-xs text-muted-foreground">Cursor or Offset/Limit. `?limit=20&page=2`.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Filter className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm">Filtering</h3>
              <p className="text-xs text-muted-foreground">Exact match or operators. `?price[gte]=10`.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <SortDesc className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-sm">Sorting</h3>
              <p className="text-xs text-muted-foreground">`sort` parameter. Prefix `-` for desc. `?sort=-createdAt`.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Search className="h-5 w-5 text-rose-500" />
              <h3 className="font-bold text-sm">Searching</h3>
              <p className="text-xs text-muted-foreground">`q` parameter for full-text. `?q=burger`.</p>
            </div>
          </div>
        </div>

        {/* Formats & Versioning */}
        <div className="space-y-6 md:col-span-12">
           <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-emerald-500" />
                  Response Formats
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                      <FileCheck2 className="h-4 w-4" /> Success Format
                    </h3>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`{
  "success": true,
  "data": { ... },
  "meta": { ... } // Optional
}`}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                      <AlertCircle className="h-4 w-4" /> Error Format
                    </h3>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input.",
    "details": [...]
  },
  "meta": { "requestId": "req_123" }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-500" />
                  Versioning
                </h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                    <GitBranch className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm">URL Versioning</h3>
                      <p className="text-xs text-muted-foreground mt-1">Major versions are included in the URL path (e.g., `/api/v1/orders`).</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                    <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm">Backwards Compatibility</h3>
                      <p className="text-xs text-muted-foreground mt-1">Minor additions must not break clients. Breaking changes require a new major version.</p>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
