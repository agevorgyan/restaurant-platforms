import { Separator } from "@/components/ui/separator";
import { Folder, FolderOpen, AlertCircle, Maximize2, ShieldAlert, Network, FileCode, CheckSquare } from "lucide-react";

export function FolderRulesSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Folder Rules</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Strict folder organization principles for scalability and maintainability.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Rule */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <ShieldAlert className="h-5 w-5" />
            The Isolation Principle
          </h2>
          <p className="text-lg">
            <strong>Never place unrelated code together.</strong> Every feature must be completely self-contained.
          </p>
        </div>

        {/* Feature Ownership */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Network className="h-5 w-5" />
            Feature Ownership
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Every feature must own its complete vertical slice. A feature directory must contain:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">components</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">hooks</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">types</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">schemas</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">api</span></div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">tests</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">styles</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">config</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">utils</span></div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"><FileCode className="h-4 w-4 text-primary" /><span className="text-sm font-medium">docs</span></div>
          </div>
        </div>

        {/* Nesting Rules */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Maximize2 className="h-5 w-5" />
            Nesting Limits
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><CheckSquare className="h-4 w-4 text-green-500" /> Keep It Reasonable</h3>
              <p className="text-sm text-muted-foreground">Maximum folder nesting must be kept reasonable. Do not create deeply nested chains of single-file directories. Flatten when possible.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><FolderOpen className="h-4 w-4" /> Control Growth</h3>
              <p className="text-sm text-muted-foreground">Keep every folder under strict control. Periodically review and refactor folders that become too large or unwieldy.</p>
            </div>
          </div>
        </div>

        {/* Anti-Patterns */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm border-destructive/20 bg-destructive/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Anti-Patterns
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">No "Misc" Folders</h3>
              <p className="text-sm text-muted-foreground">Never create a <code className="bg-destructive/10 px-1 py-0.5 rounded text-destructive">misc</code>, <code className="bg-destructive/10 px-1 py-0.5 rounded text-destructive">other</code>, or <code className="bg-destructive/10 px-1 py-0.5 rounded text-destructive">common</code> folder for unrelated items. Every file must have a semantic home based on its domain or function.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
