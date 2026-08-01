/**
 * Enterprise Dashboard Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, DashboardAggregate Root & Lifecycle, Immutability & Version Control,
 * Layout Engine & Collision Detection, Widget Library & BI/KPI Bindings, User Personalization Overlays,
 * Refresh Policies & History Audit, RLS Tenant Security & RBAC Permissions, Read Models, and Services.
 */

import {
  DashboardId,
  WidgetId,
  DashboardVersion,
  WidgetPosition,
  WidgetSize,
  RefreshPolicy,
  DashboardFilter,
  WidgetDefinition,
  DashboardLayout,
  DashboardTheme,
} from './domain/value-objects/dashboard-vo';
import {
  DashboardType,
  WidgetType,
  LayoutType,
  DashboardStatus,
  RefreshStrategy,
} from './domain/enums/dashboard.enums';
import { DashboardAggregate } from './domain/models/dashboard.aggregate';
import { InMemoryDashboardRepository } from './infrastructure/repositories/in-memory-dashboard.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  DashboardService,
  WidgetService,
  LayoutService,
  PersonalizationService,
  RefreshService,
  PermissionService,
  EnterpriseDashboardPlatformService,
} from './application/services/dashboard-platform.services';
import {
  ImmutableDashboardModificationException,
  InvalidDashboardLayoutException,
  InvalidWidgetDefinitionException,
  UnauthorizedDashboardAccessException,
  WidgetNotFoundException,
} from './domain/exceptions/dashboard.exceptions';

describe('Enterprise Dashboard Platform', () => {
  describe('Value Objects & Validation', () => {
    it('should generate unique IDs for Dashboard and Widget', () => {
      const dashId = DashboardId.create();
      const widgId = WidgetId.create();

      expect(dashId.getValue()).toMatch(/^dash-/);
      expect(widgId.getValue()).toMatch(/^widg-/);
    });

    it('should handle semantic versioning (Major.Minor)', () => {
      const v1 = DashboardVersion.initial();
      expect(v1.toString()).toBe('1.0');

      const v11 = v1.incrementMinor();
      expect(v11.toString()).toBe('1.1');

      const v20 = v1.incrementMajor();
      expect(v20.toString()).toBe('2.0');
    });

    it('should throw exception for negative widget coordinates or zero dimensions', () => {
      expect(() => WidgetPosition.create(-1, 0)).toThrow(InvalidDashboardLayoutException);
      expect(() => WidgetSize.create({ width: 0, height: 2 })).toThrow(InvalidDashboardLayoutException);
    });

    it('should validate interval refresh policy requires intervalSeconds > 0', () => {
      expect(() =>
        RefreshPolicy.create({ strategy: RefreshStrategy.INTERVAL, intervalSeconds: 0 })
      ).toThrow();
    });
  });

  describe('DashboardAggregate Root & Lifecycle', () => {
    it('should create a dashboard in DRAFT state and record DashboardCreated event', () => {
      const dashboard = DashboardAggregate.create({
        name: 'Kitchen Live Display',
        dashboardType: DashboardType.KITCHEN,
        tenantId: 'tenant-kitch-1',
      });

      expect(dashboard.getStatus()).toBe(DashboardStatus.DRAFT);
      expect(dashboard.getVersion().toString()).toBe('1.0');
      expect(dashboard.getUncommittedEvents().length).toBe(1);
      expect(dashboard.getUncommittedEvents()[0].eventName).toBe('DashboardCreated');
    });

    it('should publish a dashboard and enforce immutability on subsequent edits', () => {
      const dashboard = DashboardAggregate.create({
        name: 'Finance Executive Summary',
        dashboardType: DashboardType.FINANCE,
        tenantId: 'tenant-fin-1',
      });

      dashboard.publish('user-cfo');
      expect(dashboard.getStatus()).toBe(DashboardStatus.PUBLISHED);

      const widget = WidgetDefinition.create({
        type: WidgetType.KPI,
        title: 'Net Profit KPI',
        position: WidgetPosition.create(0, 0),
        size: WidgetSize.create({ width: 4, height: 2 }),
      });

      // Modifying published dashboard directly throws exception
      expect(() => dashboard.addWidget(widget)).toThrow(ImmutableDashboardModificationException);
    });

    it('should create a new DRAFT version from a published dashboard', () => {
      const published = DashboardAggregate.create({
        name: 'Operations Board',
        dashboardType: DashboardType.OPERATIONS,
        tenantId: 'tenant-ops-1',
      });
      published.publish('user-admin');

      const nextDraft = published.createNextDraft('user-editor');
      expect(nextDraft.getStatus()).toBe(DashboardStatus.DRAFT);
      expect(nextDraft.getVersion().toString()).toBe('1.1');
      expect(nextDraft.getId().getValue()).not.toBe(published.getId().getValue());
    });

    it('should add, update, and remove widgets in DRAFT mode', () => {
      const dashboard = DashboardAggregate.create({
        name: 'Marketing Campaign Tracker',
        dashboardType: DashboardType.MARKETING,
        tenantId: 'tenant-mkt-1',
      });

      const widget = WidgetDefinition.create({
        type: WidgetType.CHART,
        title: 'Campaign Conversion Chart',
        position: WidgetPosition.create(0, 0),
        size: WidgetSize.create({ width: 6, height: 4 }),
      });

      dashboard.addWidget(widget);
      expect(dashboard.getWidgets().length).toBe(1);

      const updatedWidget = WidgetDefinition.create({
        widgetId: widget.widgetId,
        type: WidgetType.CHART,
        title: 'Updated Campaign Conversion Chart',
        position: WidgetPosition.create(0, 0),
        size: WidgetSize.create({ width: 8, height: 4 }),
      });

      dashboard.updateWidget(updatedWidget);
      expect(dashboard.getWidget(widget.widgetId.getValue())?.title).toBe('Updated Campaign Conversion Chart');

      dashboard.removeWidget(widget.widgetId.getValue());
      expect(dashboard.getWidgets().length).toBe(0);
    });
  });

  describe('Layout Engine & Collision Detection', () => {
    let layoutService: LayoutService;

    beforeEach(() => {
      layoutService = new LayoutService();
    });

    it('should validate grid bounds and throw exception if widget exceeds columns', () => {
      const layout = DashboardLayout.create({ layoutType: LayoutType.GRID, columns: 12 });
      const pos = WidgetPosition.create(10, 0);
      const size = WidgetSize.create({ width: 4, height: 2 }); // 10 + 4 = 14 > 12

      expect(() => layoutService.validateWidgetBounds(layout, pos, size)).toThrow(
        InvalidDashboardLayoutException
      );
    });

    it('should detect overlapping widget collisions', () => {
      const w1 = WidgetDefinition.create({
        type: WidgetType.METRIC,
        title: 'Metric 1',
        position: WidgetPosition.create(0, 0),
        size: WidgetSize.create({ width: 4, height: 4 }),
      });

      const w2 = WidgetDefinition.create({
        type: WidgetType.METRIC,
        title: 'Metric 2',
        position: WidgetPosition.create(2, 2), // overlaps with w1
        size: WidgetSize.create({ width: 4, height: 4 }),
      });

      expect(layoutService.hasCollisions([w1, w2])).toBe(true);
    });
  });

  describe('Platform Domain & Application Services', () => {
    let repo: InMemoryDashboardRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let layoutService: LayoutService;
    let widgetService: WidgetService;
    let personalizationService: PersonalizationService;
    let refreshService: RefreshService;
    let permissionService: PermissionService;
    let dashboardService: DashboardService;
    let platformService: EnterpriseDashboardPlatformService;

    beforeEach(() => {
      repo = new InMemoryDashboardRepository();
      eventPublisher = new NestEventPublisherAdapter();
      layoutService = new LayoutService();
      widgetService = new WidgetService(layoutService);
      personalizationService = new PersonalizationService(repo);
      refreshService = new RefreshService();
      permissionService = new PermissionService();

      dashboardService = new DashboardService(
        repo,
        eventPublisher,
        widgetService,
        permissionService
      );

      platformService = new EnterpriseDashboardPlatformService(
        repo,
        repo,
        eventPublisher,
        dashboardService,
        widgetService,
        layoutService,
        personalizationService,
        refreshService,
        permissionService
      );
    });

    it('should query seeded out-of-the-box templates for all 9 dashboard types', async () => {
      const catalog = await platformService.getDashboards('tenant-default');
      expect(catalog.totalDashboards).toBe(9);

      const types = catalog.dashboards.map((d) => d.dashboardType);
      expect(types).toContain(DashboardType.EXECUTIVE);
      expect(types).toContain(DashboardType.RESTAURANT);
      expect(types).toContain(DashboardType.KITCHEN);
      expect(types).toContain(DashboardType.FINANCE);
      expect(types).toContain(DashboardType.INVENTORY);
      expect(types).toContain(DashboardType.MARKETING);
      expect(types).toContain(DashboardType.OPERATIONS);
      expect(types).toContain(DashboardType.AI);
      expect(types).toContain(DashboardType.CUSTOM);
    });

    it('should create a custom dashboard with widgets bound to BI query & KPI metrics', async () => {
      const created = await platformService.createDashboard('tenant-store-100', {
        name: 'AI Demand Forecast Workspace',
        dashboardType: DashboardType.AI,
        widgets: [
          {
            type: WidgetType.KPI,
            title: 'Forecast Accuracy KPI',
            position: { x: 0, y: 0 },
            size: { width: 4, height: 2 },
            kpiBinding: { kpiId: 'kpi-forecast-1', kpiCode: 'AI_ACCURACY', targetThreshold: 95 },
          },
          {
            type: WidgetType.CHART,
            title: 'Sales Prediction Chart',
            position: { x: 4, y: 0 },
            size: { width: 8, height: 4 },
            biQueryBinding: {
              cubeId: 'cube-ai-demand',
              selectedDimensions: ['TIME', 'PRODUCT'],
              selectedMeasures: ['REVENUE'],
            },
          },
        ],
      });

      expect(created.id).toBeDefined();
      expect(created.widgets.length).toBe(2);
      expect(created.widgets[0].kpiBinding?.kpiCode).toBe('AI_ACCURACY');
      expect(created.widgets[1].biQueryBinding?.cubeId).toBe('cube-ai-demand');
    });

    it('should execute dashboard refresh and log audit history', async () => {
      const catalog = await platformService.getDashboards('tenant-default');
      const targetDashId = catalog.dashboards[0].id;

      const refreshResult = await platformService.refreshDashboard('tenant-default', targetDashId, {
        strategy: RefreshStrategy.INTERVAL,
      });

      expect(refreshResult.status).toBe('SUCCESS');
      expect(refreshResult.refreshedWidgetCount).toBeGreaterThan(0);
      expect(refreshResult.executionLatencyMs).toBeGreaterThanOrEqual(0);

      const history = await platformService.getRefreshHistory('tenant-default');
      expect(history.totalRefreshExecutions).toBeGreaterThan(0);
    });

    it('should save and apply user personalization profiles without mutating published template', async () => {
      const catalog = await platformService.getDashboards('tenant-default');
      const targetDashId = catalog.dashboards[0].id;

      const fullDashboard = await platformService.getDashboardById('tenant-default', targetDashId);
      const firstWidgetId = fullDashboard.widgets[0].widgetId;

      // User hides the first widget & applies dark minimal theme override
      await platformService.savePersonalization('tenant-default', 'user-manager-1', targetDashId, {
        hiddenWidgetIds: [firstWidgetId],
        customThemeOverride: { mode: 'DARK', cardStyle: 'MINIMAL', primaryColor: '#10b981' },
      });

      const personalizedResponse = await platformService.getDashboardById(
        'tenant-default',
        targetDashId,
        'user-manager-1'
      );

      // Hidden widget is excluded from personalized view
      const personalizedWidgetIds = personalizedResponse.widgets.map((w) => w.widgetId);
      expect(personalizedWidgetIds).not.toContain(firstWidgetId);

      // Theme overrides applied
      expect(personalizedResponse.theme.primaryColor).toBe('#10b981');
      expect(personalizedResponse.theme.cardStyle).toBe('MINIMAL');

      // Original template in repository remains unchanged
      const rawDashboard = await platformService.getDashboardById('tenant-default', targetDashId);
      expect(rawDashboard.widgets.length).toBe(fullDashboard.widgets.length);
    });

    it('should enforce Tenant RLS isolation', async () => {
      const created = await platformService.createDashboard('tenant-alpha', {
        name: 'Alpha Confidential Dashboard',
        dashboardType: DashboardType.EXECUTIVE,
      });

      await expect(
        platformService.getDashboardById('tenant-beta', created.id)
      ).rejects.toThrow(UnauthorizedDashboardAccessException);
    });

    it('should query Widget Catalog, Usage, and Dashboard Statistics read models', async () => {
      const widgetCatalog = await platformService.getWidgetCatalog('tenant-default');
      expect(widgetCatalog.totalWidgets).toBeGreaterThan(0);

      const usage = await platformService.getDashboardUsage('tenant-default');
      expect(usage.usageByDashboard.length).toBeGreaterThan(0);

      const stats = await platformService.getDashboardStatistics('tenant-default');
      expect(stats.totalDashboards).toBe(9);
      expect(stats.publishedDashboards).toBe(9);
    });
  });
});
