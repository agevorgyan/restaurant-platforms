import { Separator } from "@/components/ui/separator";
import { FolderTree, Folder, File, FolderGit2, Settings, Terminal, Container, Book, Package, LayoutTemplate, Server, Database, Users, Box, CreditCard, HardDrive, Bell, LineChart, BrainCircuit, Wrench, Palette, Network, Share2, Globe, ShieldCheck, Anchor } from "lucide-react";

export function DirectoryStructureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Structure</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          The complete filesystem hierarchy of the Restaurant SaaS Platform monorepo.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm overflow-hidden">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-primary">
          <FolderTree className="h-5 w-5" />
          restaurant-platform/
        </h2>
        
        <div className="font-mono text-sm space-y-1.5 pl-4">
          
          {/* Apps */}
          <div className="flex items-center gap-2 text-foreground">
            <Folder className="h-4 w-4 text-blue-500" />
            <span>apps/</span>
          </div>
          <div className="pl-6 space-y-1.5 border-l border-border ml-2 my-1">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Settings className="h-4 w-4 text-slate-500" />
              <span>admin/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Super-admin portal</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <LayoutTemplate className="h-4 w-4 text-emerald-500" />
              <span>dashboard/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Tenant CRM & Inventory</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Server className="h-4 w-4 text-red-500" />
              <span>api/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Core NestJS backend</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Smartphone className="h-4 w-4 text-amber-500" />
              <span>customer-menu/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Consumer QR menu</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Smartphone className="h-4 w-4 text-indigo-500" />
              <span>customer-order/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Consumer Online Ordering</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <LayoutTemplate className="h-4 w-4 text-teal-500" />
              <span>customer-kiosk/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Self-service kiosk</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Book className="h-4 w-4 text-rose-500" />
              <span>landing/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Public marketing website</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Book className="h-4 w-4 text-slate-500" />
              <span>docs/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Public API & developer docs</span>
            </div>
          </div>

          {/* Packages */}
          <div className="flex items-center gap-2 text-foreground mt-4">
            <Package className="h-4 w-4 text-purple-500" />
            <span>packages/</span>
          </div>
          <div className="pl-6 space-y-1.5 border-l border-border ml-2 my-1">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <LayoutTemplate className="h-4 w-4 text-teal-500" />
              <span>ui/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- React components & Tailwind</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Palette className="h-4 w-4 text-pink-500" />
              <span>theme/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Design tokens and global styling</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Network className="h-4 w-4 text-blue-500" />
              <span>api-client/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Typed API SDKs & data fetching</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Database className="h-4 w-4 text-indigo-500" />
              <span>database/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Prisma schema & clients</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Users className="h-4 w-4 text-orange-500" />
              <span>auth/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- RBAC & tenant isolation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Box className="h-4 w-4 text-sky-500" />
              <span>types/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Global TS interfaces & Zod schemas</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Settings className="h-4 w-4 text-slate-500" />
              <span>config/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Shared ESLint/Prettier/TS configs</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Wrench className="h-4 w-4 text-gray-500" />
              <span>utils/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Shared business logic & helpers</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <LineChart className="h-4 w-4 text-purple-500" />
              <span>analytics/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Telemetry & event tracking</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <CreditCard className="h-4 w-4 text-green-500" />
              <span>payments/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Payment gateway integrations</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <HardDrive className="h-4 w-4 text-cyan-500" />
              <span>storage/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Cloud storage abstractions (S3)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Bell className="h-4 w-4 text-rose-500" />
              <span>notifications/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Multi-channel delivery (SMS/Email/Push)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <BrainCircuit className="h-4 w-4 text-pink-500" />
              <span>ai/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- LLM orchestration & prompts</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Share2 className="h-4 w-4 text-amber-500" />
              <span>shared/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Code shared across apps & packages</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Globe className="h-4 w-4 text-emerald-500" />
              <span>localization/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- i18n translations & formatters</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <ShieldCheck className="h-4 w-4 text-teal-500" />
              <span>validation/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Centralized input & form validation schemas</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="w-4 border-b border-border mr-1 inline-block -ml-6"></span>
              <Anchor className="h-4 w-4 text-blue-400" />
              <span>hooks/</span> <span className="text-xs opacity-50 ml-2 hidden sm:inline">- Custom React hooks library</span>
            </div>
          </div>

          {/* Root Folders */}
          <div className="flex items-center gap-2 text-foreground mt-4">
            <Container className="h-4 w-4 text-blue-400" />
            <span>docker/</span>
          </div>
          <div className="flex items-center gap-2 text-foreground mt-2">
            <Book className="h-4 w-4 text-amber-500" />
            <span>docs/</span>
          </div>
          <div className="flex items-center gap-2 text-foreground mt-2">
            <Terminal className="h-4 w-4 text-green-500" />
            <span>scripts/</span>
          </div>
          <div className="flex items-center gap-2 text-foreground mt-2">
            <FolderGit2 className="h-4 w-4 text-zinc-700 dark:text-zinc-400" />
            <span>.github/</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function Smartphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}
