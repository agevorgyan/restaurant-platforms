/**
 * Enterprise Frontend Architecture Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, App Router Route Guards, Dynamic Route Matching, Navigation History Tracking,
 * Typed API Client Request Pipeline with Correlation IDs, Query Cache Policies, Session & RBAC Permissions, and CQRS Read Models.
 */

import { ModuleStatus, RouteType } from '../src/domain/enums/frontend.enums';
import {
  ApiRequest,
  ApiResponse,
  CachePolicy,
  FeatureModule,
  ModuleDefinition,
  NavigationState,
  QueryKey,
  RouteDefinition,
} from '../src/domain/value-objects/frontend-vo';
import {
  ApiClientService,
  CacheService,
  EnterpriseFrontendPlatformService,
  NavigationService,
  PermissionService,
  RoutingService,
  SessionService,
} from '../src/services/frontend-platform.services';

describe('Enterprise Frontend Architecture Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should validate RouteDefinition path format and detect dynamic routes', () => {
      const staticRoute = RouteDefinition.create('/admin/dashboard', RouteType.ADMIN);
      expect(staticRoute.isDynamic).toBe(false);

      const dynamicRoute = RouteDefinition.create('/orders/:id', RouteType.TENANT);
      expect(dynamicRoute.isDynamic).toBe(true);

      expect(() => RouteDefinition.create('invalid-path', RouteType.PUBLIC)).toThrow();
    });

    it('should auto-generate correlationId for ApiRequest', () => {
      const req = ApiRequest.create({ endpoint: '/api/v1/orders' });
      expect(req.correlationId).toMatch(/^corr-/);
      expect(req.headers['x-correlation-id']).toBe(req.correlationId);
    });

    it('should format QueryKey to deterministic string', () => {
      const key = QueryKey.create('orders', 'tenant-123', { status: 'PENDING' });
      expect(key.toString()).toBe('["orders","tenant-123",{"status":"PENDING"}]');
    });
  });

  describe('Routing & Navigation Services', () => {
    let routingService: RoutingService;
    let navigationService: NavigationService;

    beforeEach(() => {
      routingService = new RoutingService();
      navigationService = new NavigationService();
    });

    it('should register and match static & dynamic routes', () => {
      routingService.registerRoute(RouteDefinition.create('/kitchen/queue', RouteType.AUTHENTICATED));
      routingService.registerRoute(RouteDefinition.create('/restaurants/:id/menu', RouteType.TENANT));

      const matchStatic = routingService.matchRoute('/kitchen/queue');
      expect(matchStatic?.path).toBe('/kitchen/queue');

      const matchDynamic = routingService.matchRoute('/restaurants/rest-42/menu');
      expect(matchDynamic?.path).toBe('/restaurants/:id/menu');
    });

    it('should update navigation state and maintain history logs', () => {
      navigationService.navigateTo('/login');
      const state = navigationService.navigateTo('/dashboard');

      expect(state.currentPath).toBe('/dashboard');
      expect(state.previousPath).toBe('/login');
      expect(state.historyLength).toBe(3);

      const history = navigationService.getNavigationHistory();
      expect(history.totalNavigations).toBe(2);
    });
  });

  describe('ApiClientService & CacheService', () => {
    let apiClient: ApiClientService;
    let cacheService: CacheService;

    beforeEach(() => {
      apiClient = new ApiClientService();
      cacheService = new CacheService();
    });

    it('should send API requests with correlation IDs and return typed response', async () => {
      const req = ApiRequest.create({ endpoint: '/platform/features', method: 'GET' });
      const res = await apiClient.send<{ success: boolean }>(req);

      expect(res.isSuccess).toBe(true);
      expect(res.correlationId).toBe(req.correlationId);

      const stats = apiClient.getApiStatistics();
      expect(stats.totalRequestsExecuted).toBe(1);
      expect(stats.successfulRequestsCount).toBe(1);
    });

    it('should store and retrieve items in Query Cache', () => {
      const key = QueryKey.create('tenant', 'tenant-alpha');
      cacheService.setCacheItem(key, { name: 'Alpha Bistro' });

      const cached = cacheService.getCacheItem<{ name: string }>(key);
      expect(cached?.name).toBe('Alpha Bistro');

      const stats = cacheService.getCacheStatistics();
      expect(stats.activeQueryKeysCount).toBe(1);
    });
  });

  describe('Session & Permission RBAC Guards', () => {
    let sessionService: SessionService;
    let permissionService: PermissionService;

    beforeEach(() => {
      sessionService = new SessionService();
      permissionService = new PermissionService(sessionService);
    });

    it('should evaluate RBAC permission guards correctly for guest vs authenticated vs admin users', () => {
      const publicRoute = RouteDefinition.create('/public/about', RouteType.PUBLIC);
      const authRoute = RouteDefinition.create('/pos/orders', RouteType.AUTHENTICATED);
      const adminRoute = RouteDefinition.create('/admin/settings', RouteType.ADMIN);

      // Guest user
      expect(permissionService.isAuthorizedForRoute(publicRoute)).toBe(true);
      expect(permissionService.isAuthorizedForRoute(authRoute)).toBe(false);
      expect(permissionService.isAuthorizedForRoute(adminRoute)).toBe(false);

      // Authenticated User
      sessionService.setSession('tenant-1', 'user-manager-10', ['ROLE_MANAGER'], ['read:orders']);
      expect(permissionService.isAuthorizedForRoute(authRoute)).toBe(true);
      expect(permissionService.isAuthorizedForRoute(adminRoute)).toBe(false);

      // Admin User
      sessionService.setSession('tenant-1', 'user-admin-1', ['ROLE_ADMIN'], ['*']);
      expect(permissionService.isAuthorizedForRoute(adminRoute)).toBe(true);
    });
  });

  describe('EnterpriseFrontendPlatformService & Read Models', () => {
    let routingService: RoutingService;
    let navigationService: NavigationService;
    let apiClientService: ApiClientService;
    let cacheService: CacheService;
    let sessionService: SessionService;
    let permissionService: PermissionService;
    let platformService: EnterpriseFrontendPlatformService;

    beforeEach(() => {
      routingService = new RoutingService();
      navigationService = new NavigationService();
      apiClientService = new ApiClientService();
      cacheService = new CacheService();
      sessionService = new SessionService();
      permissionService = new PermissionService(sessionService);

      platformService = new EnterpriseFrontendPlatformService(
        routingService,
        navigationService,
        apiClientService,
        cacheService,
        sessionService,
        permissionService
      );
    });

    it('should query seeded default modules, route catalog, and performance metrics', () => {
      const moduleCatalog = platformService.getModuleCatalog();
      expect(moduleCatalog.totalModules).toBe(4);

      const routeCatalog = routingService.getRouteCatalog();
      expect(routeCatalog.totalRoutes).toBe(8);

      const perf = platformService.getPerformanceMetrics();
      expect(perf.firstContentfulPaintMs).toBeLessThan(500);
      expect(perf.largestContentfulPaintMs).toBeLessThan(1000);
    });
  });
});
