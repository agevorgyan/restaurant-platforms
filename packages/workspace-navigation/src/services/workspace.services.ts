/**
 * Enterprise Workspace & Navigation Platform - Domain Services
 *
 * Implements core domain services for workspace shell & navigation:
 * 1. WorkspaceService (Workspace Switcher & Layout State)
 * 2. NavigationService (Metadata-Driven Navigation Registry & Permission Filter)
 * 3. BreadcrumbService (Dynamic Breadcrumbs Generator)
 * 4. FavoritesService (User Pinned Shortcuts & Favorites)
 * 5. RecentItemsService (Recent Navigation History)
 * 6. CommandPaletteService (Extensible Spotlight ⌘K Engine)
 * 7. GlobalSearchService (Provider-Independent Search Engine)
 * 8. NotificationCenterService (Notification Badges & Drawer)
 * 9. EnterpriseWorkspacePlatformService (Primary Application Façade)
 */

import { NavigationState, WorkspaceStatus } from '../domain/enums/workspace.enums';
import {
  Breadcrumb,
  CommandDefinition,
  FavoriteItem,
  NavigationItem,
  NavigationTree,
  NotificationBadge,
  RecentItem,
  SearchQuery,
  SearchResult,
  WorkspaceContext,
  WorkspaceId,
} from '../domain/value-objects/workspace-vo';
import {
  CommandHistoryReadModel,
  FavoriteCatalogReadModel,
  NavigationCatalogReadModel,
  NotificationOverviewReadModel,
  RecentHistoryReadModel,
  SearchHistoryReadModel,
  WorkspaceCatalogReadModel,
} from '../read-models/workspace.read-models';

/**
 * Service 1: WorkspaceService
 * Controls active workspace shell, layout status, and workspace switching.
 */
export class WorkspaceService {
  private currentContext: WorkspaceContext = WorkspaceContext.create();
  private readonly availableWorkspaces = new Map<string, WorkspaceContext>();

  constructor() {
    this.seedDefaultWorkspaces();
  }

  public getContext(): WorkspaceContext {
    return this.currentContext;
  }

  public setNavigationState(state: NavigationState): WorkspaceContext {
    this.currentContext = WorkspaceContext.create({
      workspaceId: this.currentContext.workspaceId,
      workspaceType: this.currentContext.workspaceType,
      status: this.currentContext.status,
      navigationState: state,
      activePath: this.currentContext.activePath,
    });
    return this.currentContext;
  }

  public switchWorkspace(workspaceId: string): WorkspaceContext {
    const ws = this.availableWorkspaces.get(workspaceId);
    if (!ws) {
      throw new Error(`Workspace '${workspaceId}' not found`);
    }
    this.currentContext = ws;
    return this.currentContext;
  }

  public getWorkspaceCatalog(): WorkspaceCatalogReadModel {
    const list = Array.from(this.availableWorkspaces.values());
    return {
      totalWorkspaces: list.length,
      workspaces: list.map((w) => ({
        workspaceId: w.workspaceId.getValue(),
        workspaceType: w.workspaceType,
        status: w.status,
        navigationState: w.navigationState,
        activePath: w.activePath,
      })),
    };
  }

  private seedDefaultWorkspaces(): void {
    const wsAdmin = WorkspaceContext.create({ workspaceId: WorkspaceId.create('ws-admin'), workspaceType: 'Admin', activePath: '/admin/dashboard' });
    const wsRest = WorkspaceContext.create({ workspaceId: WorkspaceId.create('ws-restaurant'), workspaceType: 'Restaurant', activePath: '/restaurant/orders' });
    const wsPos = WorkspaceContext.create({ workspaceId: WorkspaceId.create('ws-pos'), workspaceType: 'POS', activePath: '/pos/terminal' });

    this.availableWorkspaces.set(wsAdmin.workspaceId.getValue(), wsAdmin);
    this.availableWorkspaces.set(wsRest.workspaceId.getValue(), wsRest);
    this.availableWorkspaces.set(wsPos.workspaceId.getValue(), wsPos);
  }
}

/**
 * Service 2: NavigationService
 * Metadata-driven navigation tree registration and permission-aware filtering.
 */
export class NavigationService {
  private readonly items: NavigationItem[] = [];

  constructor() {
    this.seedDefaultNavigation();
  }

  public registerNavigationItem(item: NavigationItem): void {
    this.items.push(item);
  }

  public getNavigationTree(userPermissions: string[] = ['*']): NavigationTree {
    const filtered = this.items.filter((item) => {
      if (userPermissions.includes('*')) return true;
      return item.requiredPermissions.length === 0 || item.requiredPermissions.some((p) => userPermissions.includes(p));
    });
    return NavigationTree.create(filtered);
  }

  public getNavigationCatalog(): NavigationCatalogReadModel {
    return {
      activeWorkspaceId: 'ws-admin',
      totalNavigationItems: this.items.length,
      items: this.items.map((i) => ({
        id: i.id,
        label: i.label,
        path: i.path,
        icon: i.icon,
        childrenCount: i.children.length,
      })),
    };
  }

  private seedDefaultNavigation(): void {
    this.registerNavigationItem(NavigationItem.create({ id: 'nav-dash', label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' }));
    this.registerNavigationItem(NavigationItem.create({ id: 'nav-orders', label: 'Orders & POS', path: '/orders', icon: 'shopping-bag' }));
    this.registerNavigationItem(NavigationItem.create({ id: 'nav-kitchen', label: 'Kitchen Queue (KDS)', path: '/kitchen', icon: 'utensils' }));
    this.registerNavigationItem(NavigationItem.create({ id: 'nav-analytics', label: 'BI Analytics', path: '/analytics', icon: 'bar-chart' }));
  }
}

/**
 * Service 3: BreadcrumbService
 * Dynamic breadcrumb path generator.
 */
export class BreadcrumbService {
  public generateBreadcrumbs(currentPath: string): Breadcrumb[] {
    const segments = currentPath.split('/').filter(Boolean);
    if (segments.length === 0) {
      return [Breadcrumb.create('Home', '/', true)];
    }

    const trail: Breadcrumb[] = [Breadcrumb.create('Home', '/')];
    let accumulated = '';

    segments.forEach((seg, idx) => {
      accumulated += `/${seg}`;
      const isLast = idx === segments.length - 1;
      const formattedLabel = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
      trail.push(Breadcrumb.create(formattedLabel, accumulated, isLast));
    });

    return trail;
  }
}

/**
 * Service 4: FavoritesService
 * User favorite items and pinned navigation shortcuts.
 */
export class FavoritesService {
  private readonly favorites = new Map<string, FavoriteItem>();

  public addFavorite(item: FavoriteItem): void {
    this.favorites.set(item.id, item);
  }

  public removeFavorite(favoriteId: string): void {
    this.favorites.delete(favoriteId);
  }

  public getFavoriteCatalog(): FavoriteCatalogReadModel {
    const list = Array.from(this.favorites.values());
    return {
      totalFavorites: list.length,
      favorites: list.map((f) => ({ id: f.id, title: f.title, path: f.path, icon: f.icon })),
    };
  }
}

/**
 * Service 5: RecentItemsService
 * Recent navigation history logger.
 */
export class RecentItemsService {
  private readonly recentLogs: RecentItem[] = [];

  public recordRecentItem(item: RecentItem): void {
    this.recentLogs.unshift(item);
    if (this.recentLogs.length > 20) {
      this.recentLogs.pop();
    }
  }

  public getRecentHistory(): RecentHistoryReadModel {
    return {
      totalRecentItems: this.recentLogs.length,
      recentItems: this.recentLogs.map((r) => ({
        id: r.id,
        title: r.title,
        path: r.path,
        visitedAt: r.visitedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 6: CommandPaletteService
 * Extensible spotlight command palette registry and executor (⌘K).
 */
export class CommandPaletteService {
  private readonly commands = new Map<string, CommandDefinition>();

  constructor() {
    this.seedDefaultCommands();
  }

  public registerCommand(cmd: CommandDefinition): void {
    this.commands.set(cmd.commandId, cmd);
  }

  public executeCommand(commandId: string): boolean {
    const cmd = this.commands.get(commandId);
    if (!cmd) return false;
    cmd.actionHandler();
    return true;
  }

  public getCommandHistory(): CommandHistoryReadModel {
    const list = Array.from(this.commands.values());
    return {
      totalRegisteredCommands: list.length,
      commands: list.map((c) => ({
        commandId: c.commandId,
        title: c.title,
        category: c.category,
        shortcut: c.shortcut,
      })),
    };
  }

  private seedDefaultCommands(): void {
    this.registerCommand(CommandDefinition.create({ commandId: 'cmd-new-order', title: 'Create New POS Order', category: 'POS', shortcut: '⌘N' }));
    this.registerCommand(CommandDefinition.create({ commandId: 'cmd-kds-bump', title: 'Bump Next Kitchen Ticket', category: 'Kitchen', shortcut: '⌘B' }));
    this.registerCommand(CommandDefinition.create({ commandId: 'cmd-export-reports', title: 'Export Daily Sales Report', category: 'Finance', shortcut: '⌘E' }));
  }
}

/**
 * Service 7: GlobalSearchService
 * Provider-independent search engine across modules, entities, and actions.
 */
export class GlobalSearchService {
  private readonly recentQueries: string[] = [];

  public search(query: SearchQuery): SearchResult[] {
    this.recentQueries.unshift(query.term);

    return [
      SearchResult.create({ id: 'res-1', title: `Order #${query.term}`, description: 'Active Order in POS Terminal', path: `/orders/${query.term}`, category: 'Orders' }),
      SearchResult.create({ id: 'res-2', title: `Menu Item: ${query.term}`, description: 'Inventory Item in Kitchen Catalog', path: '/menu', category: 'Inventory' }),
    ];
  }

  public getSearchHistory(): SearchHistoryReadModel {
    return {
      totalRecentSearches: this.recentQueries.length,
      recentQueries: this.recentQueries.slice(0, 10),
    };
  }
}

/**
 * Service 8: NotificationCenterService
 * Real-time notification badges & drawer updates.
 */
export class NotificationCenterService {
  private badge: NotificationBadge = NotificationBadge.create(3, true);

  public getNotificationBadge(): NotificationBadge {
    return this.badge;
  }

  public getNotificationOverview(): NotificationOverviewReadModel {
    return {
      unreadCount: this.badge.count,
      hasUnreadHighPriority: this.badge.hasUnreadHighPriority,
      recentNotifications: [
        { id: 'notif-1', title: 'New Online Order', message: 'Order #4092 received from UberEats', createdAt: new Date().toISOString() },
        { id: 'notif-2', title: 'Low Stock Alert', message: 'Ribeye Steak inventory below threshold (4 units remaining)', createdAt: new Date().toISOString() },
      ],
    };
  }
}

/**
 * Service 9: EnterpriseWorkspacePlatformService
 * High-level application façade for workspace shell infrastructure.
 */
export class EnterpriseWorkspacePlatformService {
  constructor(
    public readonly workspaceService: WorkspaceService,
    public readonly navigationService: NavigationService,
    public readonly breadcrumbService: BreadcrumbService,
    public readonly favoritesService: FavoritesService,
    public readonly recentItemsService: RecentItemsService,
    public readonly commandPaletteService: CommandPaletteService,
    public readonly globalSearchService: GlobalSearchService,
    public readonly notificationCenterService: NotificationCenterService
  ) {}
}
