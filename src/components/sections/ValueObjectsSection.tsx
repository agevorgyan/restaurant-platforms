import { Separator } from "@/components/ui/separator";
import { 
  BadgeDollarSign, Banknote, Mail, Phone, MapPin, 
  Map, Languages, Palette, Paintbrush, Tag, 
  Hash, Percent, Receipt, PercentDiamond, Star, 
  Clock, CheckCircle2, ShieldCheck, Diamond
} from "lucide-react";

export function ValueObjectsSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Value Objects & Validation</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Immutable characteristics and attributes of entities. They encapsulate domain logic and strict validation rules.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Principles */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Diamond className="h-5 w-5 text-indigo-500" />
            Core Principles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Always Valid</h3>
                <p className="text-xs text-muted-foreground mt-1">A Value Object cannot be instantiated in an invalid state. Validation happens inside the constructor.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border bg-muted/50">
              <CheckCircle2 className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Immutability & Equality</h3>
                <p className="text-xs text-muted-foreground mt-1">They have no identity (no IDs). They are strictly immutable, and equality is based purely on their internal values.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Objects Grid */}
        <div className="space-y-6 md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-blue-500" />
            Defined Value Objects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            
            <VOItem 
              icon={<Banknote className="text-emerald-500" />} 
              name="Money" 
              desc="Encapsulates amount (cents) and Currency."
              validation="Amount must be integer. Cannot mix currencies in math."
            />
            <VOItem 
              icon={<BadgeDollarSign className="text-emerald-500" />} 
              name="Currency" 
              desc="ISO 4217 currency code."
              validation="Must match ISO 4217 exactly (3 uppercase letters)."
            />
            <VOItem 
              icon={<Tag className="text-emerald-500" />} 
              name="Price" 
              desc="Cost of a good (Money)."
              validation="Amount cannot be negative."
            />

            <VOItem 
              icon={<Mail className="text-blue-500" />} 
              name="Email" 
              desc="Email address string."
              validation="Strict RFC 5322 regex. Auto-lowercased & trimmed."
            />
            <VOItem 
              icon={<Phone className="text-blue-500" />} 
              name="Phone" 
              desc="Phone number string."
              validation="Conforms strictly to E.164 international format."
            />
            
            <VOItem 
              icon={<MapPin className="text-rose-500" />} 
              name="Address" 
              desc="Street, City, Zip, Country."
              validation="ISO 3166-1 alpha-2 country. Valid Zip format."
            />
            <VOItem 
              icon={<Map className="text-rose-500" />} 
              name="GeoLocation" 
              desc="Latitude and Longitude."
              validation="Lat: -90 to 90. Lng: -180 to 180."
            />

            <VOItem 
              icon={<Hash className="text-purple-500" />} 
              name="Quantity" 
              desc="Measurable amount."
              validation="Cannot be negative. Integer for discrete items."
            />
            <VOItem 
              icon={<Percent className="text-purple-500" />} 
              name="Percentage" 
              desc="Fraction of 100."
              validation="Typically 0.0 to 100.0."
            />
            <VOItem 
              icon={<Star className="text-purple-500" />} 
              name="Rating" 
              desc="Customer feedback score."
              validation="Strictly between 1 and 5 (integer/fraction)."
            />

            <VOItem 
              icon={<Receipt className="text-amber-500" />} 
              name="Tax" 
              desc="Tax rate and type."
              validation="Valid type (INCLUSIVE/EXCLUSIVE). 0-100%."
            />
            <VOItem 
              icon={<PercentDiamond className="text-amber-500" />} 
              name="Discount" 
              desc="Fixed or percentage reduction."
              validation="Percentage 0-100. Fixed amount <= target Price."
            />
            
            <VOItem 
              icon={<Clock className="text-indigo-500" />} 
              name="Working Hours" 
              desc="Weekly open/close schedule."
              validation="Close > Open. No overlapping slots. HH:mm format."
            />
            <VOItem 
              icon={<Languages className="text-indigo-500" />} 
              name="Language" 
              desc="IETF BCP 47 language tag."
              validation="Must match valid registry formats (e.g., en-US)."
            />

            <VOItem 
              icon={<Palette className="text-pink-500" />} 
              name="Theme" 
              desc="Active visual mode."
              validation="Must be LIGHT, DARK, or SYSTEM."
            />
            <VOItem 
              icon={<Paintbrush className="text-pink-500" />} 
              name="Color" 
              desc="Hex code or RGB."
              validation="Starts with #, followed by 3 or 6 hex chars."
            />

          </div>
        </div>

      </div>
    </div>
  );
}

function VOItem({ icon, name, desc, validation }: { icon: React.ReactNode, name: string, desc: string, validation: string }) {
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
      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-relaxed">
        <strong>Validation:</strong> {validation}
      </p>
    </div>
  );
}
