import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisionSection } from "@/components/sections/VisionSection";
import { PRDSection } from "@/components/sections/PRDSection";
import { UXArchitectureSection } from "@/components/sections/UXArchitectureSection";
import { DesignSystemSection } from "@/components/sections/DesignSystemSection";
import { DatabaseArchitectureSection } from "@/components/sections/DatabaseArchitectureSection";
import { NestJSArchitectureSection } from "@/components/sections/NestJSArchitectureSection";
import { AuthArchitectureSection } from "@/components/sections/AuthArchitectureSection";
import { MultiTenantArchitectureSection } from "@/components/sections/MultiTenantArchitectureSection";
import { QRMenuArchitectureSection } from "@/components/sections/QRMenuArchitectureSection";
import { OrderingArchitectureSection } from "@/components/sections/OrderingArchitectureSection";
import { AIArchitectureSection } from "@/components/sections/AIArchitectureSection";
import { TechStackArchitectureSection } from "@/components/sections/TechStackArchitectureSection";
import { DevOpsArchitectureSection } from "@/components/sections/DevOpsArchitectureSection";
import { ProjectRulesSection } from "@/components/sections/ProjectRulesSection";
import { FolderRulesSection } from "@/components/sections/FolderRulesSection";
import { CodeQualitySection } from "@/components/sections/CodeQualitySection";
import { DesignPhilosophySection } from "@/components/sections/DesignPhilosophySection";
import { ExecutionRulesSection } from "@/components/sections/ExecutionRulesSection";
import { MonorepoArchitectureSection } from "@/components/sections/MonorepoArchitectureSection";
import { DockerArchitectureSection } from "@/components/sections/DockerArchitectureSection";
import { GitWorkflowSection } from "@/components/sections/GitWorkflowSection";
import { EnvironmentConfigSection } from "@/components/sections/EnvironmentConfigSection";
import { CodingStandardsSection } from "@/components/sections/CodingStandardsSection";
import { ADRSection } from "@/components/sections/ADRSection";
import { DocumentationStructureSection } from "@/components/sections/DocumentationStructureSection";
import { ArchitectureReviewSection } from "@/components/sections/ArchitectureReviewSection";
import { DirectoryStructureSection } from "@/components/sections/DirectoryStructureSection";
import { DesignTokensSection } from "@/components/sections/DesignTokensSection";
import { TypographySystemSection } from "@/components/sections/TypographySystemSection";
import { ColorSystemSection } from "@/components/sections/ColorSystemSection";
import { ProductCardUXSection } from "@/components/sections/ProductCardUXSection";
import { CategoryNavigationUXSection } from "@/components/sections/CategoryNavigationUXSection";
import { BottomNavigationUXSection } from "@/components/sections/BottomNavigationUXSection";
import { CheckoutFlowUXSection } from "@/components/sections/CheckoutFlowUXSection";
import { MotionSystemSection } from "@/components/sections/MotionSystemSection";
import { DesignSystemReviewSection } from "@/components/sections/DesignSystemReviewSection";
import { ComponentLibrarySection } from "@/components/sections/ComponentLibrarySection";
import { UIKitArchitectureSection } from "@/components/sections/UIKitArchitectureSection";
import { ButtonArchitectureSection } from "@/components/sections/ButtonArchitectureSection";
import { ProductCardArchitectureSection } from "@/components/sections/ProductCardArchitectureSection";
import { FloatingCartArchitectureSection } from "@/components/sections/FloatingCartArchitectureSection";
import { BottomSheetArchitectureSection } from "@/components/sections/BottomSheetArchitectureSection";
import { SearchArchitectureSection } from "@/components/sections/SearchArchitectureSection";
import { MenuNavigationArchitectureSection } from "@/components/sections/MenuNavigationArchitectureSection";
import { ThemeEngineArchitectureSection } from "@/components/sections/ThemeEngineArchitectureSection";
import { PackagesArchitectureSection } from "@/components/sections/PackagesArchitectureSection";
import { CorePlatformArchitectureSection } from "@/components/sections/CorePlatformArchitectureSection";
import { ConfigurationSystemArchitectureSection } from "@/components/sections/ConfigurationSystemArchitectureSection";
import { LoggingArchitectureSection } from "@/components/sections/LoggingArchitectureSection";
import { ErrorHandlingArchitectureSection } from "@/components/sections/ErrorHandlingArchitectureSection";
import { ApiContractStandardsSection } from "@/components/sections/ApiContractStandardsSection";
import { SharedTypesArchitectureSection } from "@/components/sections/SharedTypesArchitectureSection";
import { EventDrivenArchitectureSection } from "@/components/sections/EventDrivenArchitectureSection";
import { FeatureFlagArchitectureSection } from "@/components/sections/FeatureFlagArchitectureSection";
import { TenantResolutionArchitectureSection } from "@/components/sections/TenantResolutionArchitectureSection";
import { RbacArchitectureSection } from "@/components/sections/RbacArchitectureSection";
import { LocalizationArchitectureSection } from "@/components/sections/LocalizationArchitectureSection";
import { SecurityArchitectureSection } from "@/components/sections/SecurityArchitectureSection";
import { AuditLoggingArchitectureSection } from "@/components/sections/AuditLoggingArchitectureSection";
import { BoundedContextsSection } from "@/components/sections/BoundedContextsSection";
import { ArchitectureReviewSection as PlatformArchitectureReviewSection } from "@/components/sections/ArchitectureReviewSection";
import { AggregateRootsSection } from "@/components/sections/AggregateRootsSection";
import { EntitiesSection } from "@/components/sections/EntitiesSection";
import { ValueObjectsSection } from "@/components/sections/ValueObjectsSection";
import { RepositoryArchitectureSection } from "@/components/sections/RepositoryArchitectureSection";
import { DomainEventsSection } from "@/components/sections/DomainEventsSection";
import { TransactionStrategySection } from "@/components/sections/TransactionStrategySection";
import { CqrsEvaluationSection } from "@/components/sections/CqrsEvaluationSection";
import { DatabaseStrategySection } from "@/components/sections/DatabaseStrategySection";
import { DomainArchReviewSection } from "@/components/sections/DomainArchReviewSection";
import { Building2, FileText, PenTool, Component, Server, QrCode, Sparkles, ServerCog, Folder, CheckSquare, BookOpen, Shield, Users, CreditCard, Box, Settings, Bell, LayoutDashboard, Store, Paintbrush, Receipt, BarChart3, ChevronRight, Menu, X, ArrowRight, Zap, Globe, Lock, Code2, Database, ShoppingCart, Layers, Palette, ListChecks, FolderTree, Container, GitBranch, BookOpen as BookOpenIcon, Book, ShieldCheck, AlignLeft, Brush, Type, PaintBucket, LayoutTemplate, Navigation, Smartphone, Activity, ShieldAlert, Package, MousePointerClick, LayoutList, ShoppingBag, PanelBottomClose, Search, Anchor, Workflow, ScrollText, AlertOctagon, Network, Library, ToggleLeft, Map, Key, Languages, History, ClipboardCheck, Cuboid, Diamond, DatabaseBackup, ActivitySquare, RefreshCw, SplitSquareHorizontal, HardDrive } from "lucide-react";

const navigation = [
  { id: "vision", name: "Vision & Architecture", icon: Building2, component: <VisionSection /> },
  { id: "boundedcontexts", name: "Bounded Contexts", icon: LayoutDashboard, component: <BoundedContextsSection /> },
  { id: "aggregateroots", name: "Aggregate Roots", icon: Database, component: <AggregateRootsSection /> },
  { id: "entities", name: "Domain Entities", icon: Cuboid, component: <EntitiesSection /> },
  { id: "valueobjects", name: "Value Objects", icon: Diamond, component: <ValueObjectsSection /> },
  { id: "domainevents", name: "Domain Events", icon: ActivitySquare, component: <DomainEventsSection /> },
  { id: "repositoryarch", name: "Repository Arch", icon: DatabaseBackup, component: <RepositoryArchitectureSection /> },
  { id: "transactionstrategy", name: "Transaction Strategy", icon: RefreshCw, component: <TransactionStrategySection /> },
  { id: "cqrsevaluation", name: "CQRS Evaluation", icon: SplitSquareHorizontal, component: <CqrsEvaluationSection /> },
  { id: "databasestrategy", name: "Database Strategy", icon: HardDrive, component: <DatabaseStrategySection /> },
  { id: "domainarchreview", name: "Domain Arch Review", icon: Shield, component: <DomainArchReviewSection /> },
  { id: "platformarchreview", name: "Architecture Review", icon: ClipboardCheck, component: <PlatformArchitectureReviewSection /> },
  { id: "auditloggingarch", name: "Audit Logging Arch", icon: History, component: <AuditLoggingArchitectureSection /> },
  { id: "securityarch", name: "Security Architecture", icon: ShieldAlert, component: <SecurityArchitectureSection /> },
  { id: "localizationarch", name: "Localization Architecture", icon: Languages, component: <LocalizationArchitectureSection /> },
  { id: "rbacarch", name: "RBAC Architecture", icon: Key, component: <RbacArchitectureSection /> },
  { id: "tenantresolutionarch", name: "Tenant Resolution", icon: Map, component: <TenantResolutionArchitectureSection /> },
  { id: "featureflagarch", name: "Feature Flag Arch", icon: ToggleLeft, component: <FeatureFlagArchitectureSection /> },
  { id: "eventdrivenarch", name: "Event Driven Arch", icon: Zap, component: <EventDrivenArchitectureSection /> },
  { id: "apicontractstandards", name: "API Contract Standards", icon: Network, component: <ApiContractStandardsSection /> },
  { id: "sharedtypesarch", name: "Shared Types Architecture", icon: Library, component: <SharedTypesArchitectureSection /> },
  { id: "errorhandlingarch", name: "Error Handling Arch", icon: AlertOctagon, component: <ErrorHandlingArchitectureSection /> },
  { id: "loggingarch", name: "Logging Architecture", icon: ScrollText, component: <LoggingArchitectureSection /> },
  { id: "coreplatformarch", name: "Core Platform Architecture", icon: Workflow, component: <CorePlatformArchitectureSection /> },
  { id: "configsystemarch", name: "Config System Arch", icon: Settings, component: <ConfigurationSystemArchitectureSection /> },
  { id: "packagesarch", name: "Packages Architecture", icon: Box, component: <PackagesArchitectureSection /> },
  { id: "structure", name: "Directory Structure", icon: AlignLeft, component: <DirectoryStructureSection /> },
  { id: "monorepo", name: "Monorepo Architecture", icon: FolderTree, component: <MonorepoArchitectureSection /> },
  { id: "docker", name: "Docker Architecture", icon: Container, component: <DockerArchitectureSection /> },
  { id: "gitworkflow", name: "Git Workflow", icon: GitBranch, component: <GitWorkflowSection /> },
  { id: "environment", name: "Environment & Config", icon: Settings, component: <EnvironmentConfigSection /> },
  { id: "codingstandards", name: "Coding Standards", icon: Code2, component: <CodingStandardsSection /> },
  { id: "adr", name: "Architecture Decision Records", icon: BookOpenIcon, component: <ADRSection /> },
  { id: "docs", name: "Documentation Structure", icon: Book, component: <DocumentationStructureSection /> },
  { id: "review", name: "Architecture Review", icon: ShieldCheck, component: <ArchitectureReviewSection /> },
  { id: "executionrules", name: "Execution Rules", icon: ListChecks, component: <ExecutionRulesSection /> },
  { id: "designphilosophy", name: "Design Philosophy", icon: Palette, component: <DesignPhilosophySection /> },
  { id: "designtokens", name: "Design Tokens", icon: Brush, component: <DesignTokensSection /> },
  { id: "typography", name: "Typography System", icon: Type, component: <TypographySystemSection /> },
  { id: "colorsystem", name: "Color System", icon: PaintBucket, component: <ColorSystemSection /> },
  { id: "productcard", name: "Product Card UX", icon: LayoutTemplate, component: <ProductCardUXSection /> },
  { id: "categorynav", name: "Category Nav UX", icon: Navigation, component: <CategoryNavigationUXSection /> },
  { id: "bottomnav", name: "Bottom Nav UX", icon: Smartphone, component: <BottomNavigationUXSection /> },
  { id: "checkoutflow", name: "Checkout Flow UX", icon: ShoppingCart, component: <CheckoutFlowUXSection /> },
  { id: "motionsystem", name: "Motion System", icon: Activity, component: <MotionSystemSection /> },
  { id: "dsreview", name: "System Review", icon: ShieldAlert, component: <DesignSystemReviewSection /> },
  { id: "componentlibrary", name: "Component Library", icon: Package, component: <ComponentLibrarySection /> },
  { id: "uikit", name: "UI Kit Architecture", icon: Layers, component: <UIKitArchitectureSection /> },
  { id: "buttonarch", name: "Button Architecture", icon: MousePointerClick, component: <ButtonArchitectureSection /> },
  { id: "productcardarch", name: "Product Card Arch", icon: LayoutList, component: <ProductCardArchitectureSection /> },
  { id: "floatingcartarch", name: "Floating Cart Arch", icon: ShoppingBag, component: <FloatingCartArchitectureSection /> },
  { id: "bottomsheetarch", name: "Bottom Sheet Arch", icon: PanelBottomClose, component: <BottomSheetArchitectureSection /> },
  { id: "searcharch", name: "Search Arch", icon: Search, component: <SearchArchitectureSection /> },
  { id: "menunavarch", name: "Menu Nav Arch", icon: Anchor, component: <MenuNavigationArchitectureSection /> },
  { id: "themeenginearch", name: "Theme Engine Arch", icon: Palette, component: <ThemeEngineArchitectureSection /> },
  { id: "codequality", name: "Code Quality", icon: CheckSquare, component: <CodeQualitySection /> },
  { id: "projectrules", name: "Project Rules", icon: BookOpen, component: <ProjectRulesSection /> },
  { id: "folderrules", name: "Folder Rules", icon: Folder, component: <FolderRulesSection /> },
  { id: "techstack", name: "Tech Stack", icon: Layers, component: <TechStackArchitectureSection /> },
  { id: "prd", name: "Product Requirements", icon: FileText, component: <PRDSection /> },
  { id: "ux", name: "UX Architecture", icon: PenTool, component: <UXArchitectureSection /> },
  { id: "ds", name: "Design System", icon: Component, component: <DesignSystemSection /> },
  { id: "db", name: "Database Schema", icon: Database, component: <DatabaseArchitectureSection /> },
  { id: "nestjs", name: "NestJS Backend", icon: Server, component: <NestJSArchitectureSection /> },
  { id: "auth", name: "Authentication", icon: Shield, component: <AuthArchitectureSection /> },
  { id: "multitenant", name: "Multi-Tenant", icon: Globe, component: <MultiTenantArchitectureSection /> },
  { id: "qrmenu", name: "QR Menu Architecture", icon: QrCode, component: <QRMenuArchitectureSection /> },
  { id: "ordering", name: "Ordering & Fulfillment", icon: ShoppingCart, component: <OrderingArchitectureSection /> },
  { id: "ai", name: "AI Architecture", icon: Sparkles, component: <AIArchitectureSection /> },
  { id: "devops", name: "DevOps & Infrastructure", icon: ServerCog, component: <DevOpsArchitectureSection /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(navigation[0].id);
  const activeSection = navigation.find((item) => item.id === activeTab);

  const NavItems = () => (
    <div className="space-y-1">
      {navigation.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold tracking-tight">Enterprise Platform Docs</span>
        </div>
        <ScrollArea className="flex-1 py-4">
          <div className="px-3">
            <NavItems />
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
          <span className="font-semibold tracking-tight">Enterprise Docs</span>
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            } />
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-14 items-center border-b px-4">
                <span className="font-semibold tracking-tight">Navigation</span>
              </div>
              <ScrollArea className="flex-1 py-4">
                <div className="px-3">
                  <NavItems />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl p-6 lg:p-8">
            {activeSection?.component}
          </div>
        </main>
      </div>
    </div>
  );
}
