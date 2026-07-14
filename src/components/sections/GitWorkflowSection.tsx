import { Separator } from "@/components/ui/separator";
import { GitBranch, GitCommit, GitMerge, GitPullRequest, ShieldCheck, Tag, TerminalSquare, CheckCircle2, AlertTriangle, Route } from "lucide-react";

export function GitWorkflowSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Git & CI/CD Workflow</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Enterprise Git Flow, Semantic Versioning, and strict Pull Request guidelines to ensure zero regressions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Branching Strategy */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12 border-primary/50 bg-primary/5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
            <GitBranch className="h-5 w-5" />
            Branching Strategy (Git Flow)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Route className="h-4 w-4 text-blue-500" />
                main
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                The absolute source of truth. Always stable, always deployable to production. Direct commits are strictly forbidden.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Route className="h-4 w-4 text-emerald-500" />
                develop
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                The primary integration branch. All features merge here first. Deploys to the staging environment for QA.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Route className="h-4 w-4 text-purple-500" />
                feature/*
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Created from `develop`. Used for new features or local tasks. e.g., `feature/pos-offline-sync`.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Route className="h-4 w-4 text-amber-500" />
                release/*
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Created from `develop` when preparing for a production release. Only bug fixes are allowed here before merging to `main`.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Route className="h-4 w-4 text-rose-500" />
                hotfix/*
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Created directly from `main` to patch critical production bugs. Merges back to both `main` and `develop`.
              </p>
            </div>
          </div>
        </div>

        {/* Commits & Versioning */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Commits & Versioning
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <TerminalSquare className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Conventional Commits</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Enforced via Husky & commitlint. Format: `type(scope): description`.<br />
                  Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`.<br />
                  Example: `feat(api): add pos sync endpoint`.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <Tag className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Semantic Versioning (SemVer)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Automated versioning based on commit types.
                  `feat` = MINOR (1.1.0), `fix` = PATCH (1.0.1), `BREAKING CHANGE` = MAJOR (2.0.0).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PR & Merge Rules */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" />
            Pull Request Rules
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">PR Requirements</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Every PR must include a linked issue, a clear description of the "Why" and "How", and a filled-out testing checklist. Linear history is required.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg border bg-muted/50">
              <GitMerge className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Merge Strategy</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Squash and Merge is strictly enforced for all feature branches merging into `develop` or `main`. Keep the commit history clean and atomic.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review & Protection */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-12">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Review & Branch Protection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg border flex flex-col gap-2 bg-muted/30">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <ShieldCheck className="h-5 w-5" />
                Branch Protection (main & develop)
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4 mt-2">
                <li>Require pull request reviews before merging (Minimum: 2 approvals).</li>
                <li>Require status checks to pass before merging (Lint, Test, Build, E2E).</li>
                <li>Require linear history (No merge commits).</li>
                <li>Include administrators (Admins cannot bypass rules).</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border flex flex-col gap-2 bg-muted/30">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <AlertTriangle className="h-5 w-5" />
                Code Review Etiquette
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4 mt-2">
                <li><strong>Architectural first:</strong> Review the design and scalability before nitpicking syntax.</li>
                <li><strong>No rubber-stamping:</strong> If you don't understand the code, do not approve it.</li>
                <li><strong>Automate the rest:</strong> Let ESLint and Prettier handle styling arguments.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
