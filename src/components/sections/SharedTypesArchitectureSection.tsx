import { Separator } from "@/components/ui/separator";
import { Type, Fingerprint, Banknote, MapPin, Globe, CalendarClock, Users, Store, Receipt, FolderClosed, Layers } from "lucide-react";

export function SharedTypesArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shared Types Architecture</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Foundational domain primitives and entity shapes used across the monorepo. Ensures a ubiquitous, strongly-typed language between all services and clients.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Domain Primitives */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 lg:col-span-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Type className="h-5 w-5 text-indigo-500" />
            Domain Primitives (Value Objects)
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Fingerprint className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">IDs & Identifiers</h3>
                <p className="text-xs text-muted-foreground mt-1">Branded/Opaque types (e.g., UUID, ULID) preventing accidental mixing of RestaurantId and OrderId.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Banknote className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Money & Currency</h3>
                <p className="text-xs text-muted-foreground mt-1">Stored as integers (cents) to avoid floating point errors, paired with ISO 4217 currency codes.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Globe className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Language & Country</h3>
                <p className="text-xs text-muted-foreground mt-1">ISO 639-1 language codes and ISO 3166-1 alpha-2 country codes for i18n and compliance.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <MapPin className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Coordinates & Address</h3>
                <p className="text-xs text-muted-foreground mt-1">Lat/Lng pairs and structured addresses (Street, City, Zip, Country) for routing and geocoding.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CalendarClock className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Date & Time</h3>
                <p className="text-xs text-muted-foreground mt-1">Strict ISO 8601 strings or UTC timestamps avoiding local timezone ambiguities at the contract level.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Type className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Phone & Email</h3>
                <p className="text-xs text-muted-foreground mt-1">Validated E.164 phone formats and strict email structures.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Utilities */}
        <div className="space-y-6 md:col-span-12 lg:col-span-4">
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-500" />
              Contract Utilities
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
                <FolderClosed className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Pagination Data</h3>
                  <p className="text-xs text-muted-foreground mt-1">Standardized request shapes (limit, cursor) and response metadata (total, nextCursor).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Entities */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Store className="h-5 w-5 text-rose-500" />
            Core Entities
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Globe className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-sm">Tenant</h3>
              <p className="text-xs text-muted-foreground">The top-level billing and data isolation boundary (e.g., franchise group).</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Store className="h-5 w-5 text-rose-500" />
              <h3 className="font-bold text-sm">Restaurant</h3>
              <p className="text-xs text-muted-foreground">Physical/virtual location tied to a Tenant, with localized settings and menus.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold text-sm">User</h3>
              <p className="text-xs text-muted-foreground">Customer, Staff, or Admin holding credentials and role-based permissions.</p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
              <Receipt className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm">Order</h3>
              <p className="text-xs text-muted-foreground">Transactional record aggregating items, taxes, discounts, and payment status.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
