/**
 * Enterprise Workspace & Navigation Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Metadata-Driven Navigation Trees, Permission Filtering, Dynamic Breadcrumbs,
 * Command Palette (⌘K) Spotlight Engine, Provider-Independent Global Search, Favorites Pinning, and CQRS Read Models.
 */

import { NavigationState, WorkspaceStatus } from '../src/domain/enums/workspace.enums';
import {
  Breadcrumb,
  CommandDefinition,
  FavoriteItem,
  NavigationItem,
  RecentItem,
  SearchQuery,
  WorkspaceContext,
  WorkspaceId,
} from '../src/domain/value-objects/workspace-vo';
import {
  BreadcrumbService,
  CommandPaletteService,
  EnterpriseWorkspacePlatformService,
  FavoritesService,
  GlobalSearchService,
  NavigationService,
  NotificationCenterService,
  RecentItemsService,
  WorkspaceService,
} from '../src/services/workspace.services';

describe('Enterprise Workspace & Navigation Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format WorkspaceId correctly', () => {
      const id = WorkspaceId.create('ws-test');
      expect(id.getValue()).toBe('ws-test');
    });

    it('should create NavigationItem with child nodes and permission metadata', () => {
      const nav = NavigationItem.create({
        id: 'nav-pos',
        label: 'POS Register',
        path: '/pos/register',
        requiredPermissions: ['pos:orders:create'],
      });
      expect(nav.id).toBe('nav-pos');
      expect(nav.requiredPermissions).toContain('pos:orders:create');
    });
  });

  describe('Workspace & Navigation Services', () => {
    let workspaceService: WorkspaceService;
    let navigationService: NavigationService;

    beforeEach(() => {
      workspaceService = new WorkspaceService();
      navigationService = new NavigationService();
    });

    it('should switch active workspace and update navigation layout state', () => {
      expect(workspaceService.getContext().workspaceType).toBe('Admin');

      workspaceService.setNavigationState(NavigationState.COLLAPSED);
      expect(workspaceService.getContext().navigationState).toBe(NavigationState.COLLAPSED);

      const switched = workspaceService.switchWorkspace('ws-restaurant');
      expect(switched.workspaceType).toBe('Restaurant');
      expect(switched.activePath).toBe('/restaurant/orders');
    });

    it('should filter metadata-driven navigation tree based on user permissions', () => {
      navigationService.registerNavigationItem(
        NavigationItem.create({ id: 'nav-secret', label: 'Admin Settings', path: '/admin/sec', requiredPermissions: ['admin:sec'] })
      );

      const restrictedTree = navigationService.getNavigationTree(['pos:read']);
      const hasSecret = restrictedTree.rootItems.some((item) => item.id === 'nav-secret');
      expect(hasSecret).toBe(false);

      const adminTree = navigationService.getNavigationTree(['*']);
      const adminHasSecret = adminTree.rootItems.some((item) => item.id === 'nav-secret');
      expect(adminHasSecret).toBe(true);
    });
  });

  describe('Breadcrumb & Command Palette Engine', () => {
    let breadcrumbService: BreadcrumbService;
    let commandService: CommandPaletteService;

    beforeEach(() => {
      breadcrumbService = new BreadcrumbService();
      commandService = new CommandPaletteService();
    });

    it('should generate dynamic breadcrumb trails from URL path segments', () => {
      const trail = breadcrumbService.generateBreadcrumbs('/analytics/reports/daily-sales');
      expect(trail.length).toBe(4);
      expect(trail[0].label).toBe('Home');
      expect(trail[3].label).toBe('Daily sales');
      expect(trail[3].isLast).toBe(true);
    });

    it('should register and execute commands via Command Palette ⌘K', () => {
      let executed = false;
      commandService.registerCommand(
        CommandDefinition.create({
          commandId: 'cmd-test',
          title: 'Run Test Command',
          shortcut: '⌘T',
          actionHandler: () => {
            executed = true;
          },
        })
      );

      const success = commandService.executeCommand('cmd-test');
      expect(success).toBe(true);
      expect(executed).toBe(true);
    });
  });

  describe('Global Search & Favorites Services', () => {
    let searchService: GlobalSearchService;
    let favoritesService: FavoritesService;
    let recentService: RecentItemsService;

    beforeEach(() => {
      searchService = new GlobalSearchService();
      favoritesService = new FavoritesService();
      recentService = new RecentItemsService();
    });

    it('should execute provider-independent global searches and log recent items', () => {
      const results = searchService.search(SearchQuery.create('Burger'));
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Burger');

      recentService.recordRecentItem(RecentItem.create('POS Terminal', '/pos/terminal'));
      const history = recentService.getRecentHistory();
      expect(history.totalRecentItems).toBe(1);
    });

    it('should add and query pinned favorite items', () => {
      favoritesService.addFavorite(FavoriteItem.create('Kitchen Queue', '/kitchen/queue', 'utensils'));
      const favCatalog = favoritesService.getFavoriteCatalog();
      expect(favCatalog.totalFavorites).toBe(1);
    });
  });

  describe('EnterpriseWorkspacePlatformService & Read Models', () => {
    let workspaceService: WorkspaceService;
    let navigationService: NavigationService;
    let breadcrumbService: BreadcrumbService;
    let favoritesService: FavoritesService;
    let recentItemsService: RecentItemsService;
    let commandPaletteService: CommandPaletteService;
    let globalSearchService: GlobalSearchService;
    let notificationCenterService: NotificationCenterService;
    let platformService: EnterpriseWorkspacePlatformService;

    beforeEach(() => {
      workspaceService = new WorkspaceService();
      navigationService = new NavigationService();
      breadcrumbService = new BreadcrumbService();
      favoritesService = new FavoritesService();
      recentItemsService = new RecentItemsService();
      commandPaletteService = new CommandPaletteService();
      globalSearchService = new GlobalSearchService();
      notificationCenterService = new NotificationCenterService();

      platformService = new EnterpriseWorkspacePlatformService(
        workspaceService,
        navigationService,
        breadcrumbService,
        favoritesService,
        recentItemsService,
        commandPaletteService,
        globalSearchService,
        notificationCenterService
      );
    });

    it('should query Workspace Catalog, Command History, and Notification Overview read models', () => {
      const wsCatalog = workspaceService.getWorkspaceCatalog();
      expect(wsCatalog.totalWorkspaces).toBe(3);

      const cmdHistory = commandPaletteService.getCommandHistory();
      expect(cmdHistory.totalRegisteredCommands).toBe(3);

      const notif = notificationCenterService.getNotificationOverview();
      expect(notif.unreadCount).toBe(3);
      expect(notif.hasUnreadHighPriority).toBe(true);
    });
  });
});
