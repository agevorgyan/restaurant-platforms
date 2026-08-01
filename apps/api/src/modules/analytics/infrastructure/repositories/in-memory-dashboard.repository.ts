/**
 * Enterprise Dashboard Platform - Infrastructure In-Memory Repository
 *
 * Implements IDashboardRepository and IDashboardQueryRepository for multi-tenant data storage,
 * template seed generation, personalization persistence, usage tracking, and read model projections.
 */

import { Injectable } from '@nestjs/common';
import { DashboardAggregate } from '../../domain/models/dashboard.aggregate';
import { DashboardStatus, DashboardType, LayoutType, RefreshStrategy, WidgetType } from '../../domain/enums/dashboard.enums';
import {
  DashboardFilter,
  DashboardId,
  WidgetId,
  DashboardVersion,
  DashboardLayout,
  DashboardTheme,
  WidgetDefinition,
  WidgetPosition,
  WidgetSize,
  RefreshPolicy,
} from '../../domain/value-objects/dashboard-vo';
import { IDashboardQueryRepository, IDashboardRepository } from '../../domain/ports/dashboard.ports';
import {
  DashboardCatalogReadModel,
  DashboardStatisticsReadModel,
  DashboardUsageReadModel,
  PersonalizationProfilesReadModel,
  RefreshHistoryReadModel,
  RefreshLogEntry,
  UserDashboardPersonalization,
  WidgetCatalogReadModel,
} from '../../application/read-models/dashboard.read-models';

@Injectable()
export class InMemoryDashboardRepository implements IDashboardRepository, IDashboardQueryRepository {
  private readonly dashboardsMap = new Map<string, DashboardAggregate>();
  private readonly personalizationsMap = new Map<string, UserDashboardPersonalization>(); // key: `${tenantId}:${userId}:${dashboardId}`
  private readonly refreshHistoryLog: RefreshLogEntry[] = [];
  private readonly usageStatsMap = new Map<string, { views: number; refreshes: number; totalLoadMs: number }>();

  constructor() {
    this.seedTemplates();
  }

  // --- IDashboardRepository Implementation ---

  public async save(dashboard: DashboardAggregate): Promise<void> {
    this.dashboardsMap.set(dashboard.getId().getValue(), dashboard);
  }

  public async findById(id: string, tenantId?: string): Promise<DashboardAggregate | null> {
    return this.dashboardsMap.get(id) || null;
  }

  public async findByTenant(
    tenantId: string,
    type?: DashboardType,
    status?: DashboardStatus
  ): Promise<DashboardAggregate[]> {
    const result: DashboardAggregate[] = [];
    for (const dashboard of this.dashboardsMap.values()) {
      if (dashboard.getTenantId() === tenantId || dashboard.getTenantId() === 'system-template') {
        if (type && dashboard.getDashboardType() !== type) continue;
        if (status && dashboard.getStatus() !== status) continue;
        result.push(dashboard);
      }
    }
    return result;
  }

  public async delete(id: string, tenantId: string): Promise<boolean> {
    const dashboard = this.dashboardsMap.get(id);
    if (!dashboard || dashboard.getTenantId() !== tenantId) return false;
    return this.dashboardsMap.delete(id);
  }

  // --- IDashboardQueryRepository Implementation ---

  public async getCatalog(
    tenantId?: string,
    type?: DashboardType,
    status?: DashboardStatus
  ): Promise<DashboardCatalogReadModel> {
    const list = tenantId
      ? await this.findByTenant(tenantId, type, status)
      : Array.from(this.dashboardsMap.values());

    const summaries = list.map((d) => ({
      id: d.getId().getValue(),
      tenantId: d.getTenantId(),
      name: d.getName(),
      description: d.getDescription(),
      dashboardType: d.getDashboardType(),
      status: d.getStatus(),
      version: d.getVersion().toString(),
      layoutType: d.getLayout().layoutType,
      widgetCount: d.getWidgets().length,
      tags: d.getTags(),
      createdBy: d.getCreatedBy(),
      updatedBy: d.getUpdatedBy(),
      createdAt: d.getCreatedAt().toISOString(),
      updatedAt: d.getUpdatedAt().toISOString(),
    }));

    return {
      tenantId,
      totalDashboards: summaries.length,
      dashboards: summaries,
    };
  }

  public async getWidgetCatalog(tenantId?: string, widgetType?: string): Promise<WidgetCatalogReadModel> {
    const widgetsMap = new Map<string, WidgetDefinition>();
    for (const d of this.dashboardsMap.values()) {
      if (!tenantId || d.getTenantId() === tenantId || d.getTenantId() === 'system-template') {
        for (const w of d.getWidgets()) {
          if (!widgetType || w.type === widgetType) {
            widgetsMap.set(w.widgetId.getValue(), w);
          }
        }
      }
    }

    const summaries = Array.from(widgetsMap.values()).map((w) => ({
      widgetId: w.widgetId.getValue(),
      type: w.type,
      title: w.title,
      subtitle: w.subtitle,
      columns: w.size.width,
      height: w.size.height,
      refreshStrategy: w.refreshPolicy.strategy,
      hasBiBinding: !!w.biQueryBinding,
      hasKpiBinding: !!w.kpiBinding,
      requiredRoles: w.requiredRoles || [],
    }));

    return {
      tenantId,
      totalWidgets: summaries.length,
      widgets: summaries,
    };
  }

  public async getDashboardUsage(tenantId?: string): Promise<DashboardUsageReadModel> {
    let totalViews = 0;
    let totalRefreshes = 0;
    const usageByDashboard: any[] = [];

    for (const d of this.dashboardsMap.values()) {
      if (!tenantId || d.getTenantId() === tenantId) {
        const stats = this.usageStatsMap.get(d.getId().getValue()) || { views: 12, refreshes: 4, totalLoadMs: 240 };
        totalViews += stats.views;
        totalRefreshes += stats.refreshes;

        usageByDashboard.push({
          dashboardId: d.getId().getValue(),
          dashboardName: d.getName(),
          dashboardType: d.getDashboardType(),
          totalViews: stats.views,
          totalRefreshes: stats.refreshes,
          avgLoadLatencyMs: stats.views > 0 ? Math.round(stats.totalLoadMs / stats.views) : 0,
          lastViewedAt: new Date().toISOString(),
        });
      }
    }

    return {
      tenantId,
      totalViewsAllDashboards: totalViews,
      totalRefreshesAllDashboards: totalRefreshes,
      usageByDashboard,
    };
  }

  public async getRefreshHistory(tenantId?: string, limit: number = 50): Promise<RefreshHistoryReadModel> {
    const filtered = tenantId
      ? this.refreshHistoryLog.filter((log) => log.tenantId === tenantId)
      : this.refreshHistoryLog;

    const sliced = filtered.slice(0, limit);
    const totalLatency = sliced.reduce((acc, log) => acc + log.latencyMs, 0);

    return {
      tenantId,
      totalRefreshExecutions: filtered.length,
      avgRefreshLatencyMs: sliced.length > 0 ? Math.round(totalLatency / sliced.length) : 0,
      history: sliced,
    };
  }

  public async getStatistics(tenantId?: string): Promise<DashboardStatisticsReadModel> {
    let publishedCount = 0;
    let draftCount = 0;
    let archivedCount = 0;
    let totalWidgets = 0;

    const byType: Record<DashboardType, number> = {} as any;
    for (const t of Object.values(DashboardType)) byType[t] = 0;

    for (const d of this.dashboardsMap.values()) {
      if (!tenantId || d.getTenantId() === tenantId) {
        if (d.getStatus() === DashboardStatus.PUBLISHED) publishedCount++;
        else if (d.getStatus() === DashboardStatus.DRAFT) draftCount++;
        else if (d.getStatus() === DashboardStatus.ARCHIVED) archivedCount++;

        byType[d.getDashboardType()] = (byType[d.getDashboardType()] || 0) + 1;
        totalWidgets += d.getWidgets().length;
      }
    }

    return {
      tenantId,
      totalDashboards: publishedCount + draftCount + archivedCount,
      publishedDashboards: publishedCount,
      draftDashboards: draftCount,
      archivedDashboards: archivedCount,
      dashboardsByType: byType,
      totalWidgetsDeployed: totalWidgets,
    };
  }

  public async getPersonalization(
    tenantId: string,
    userId: string,
    dashboardId: string
  ): Promise<UserDashboardPersonalization | null> {
    const key = `${tenantId}:${userId}:${dashboardId}`;
    return this.personalizationsMap.get(key) || null;
  }

  public async getUserPersonalizationProfiles(
    tenantId: string,
    userId: string
  ): Promise<PersonalizationProfilesReadModel> {
    const profiles: UserDashboardPersonalization[] = [];
    const prefix = `${tenantId}:${userId}:`;
    for (const [key, value] of this.personalizationsMap.entries()) {
      if (key.startsWith(prefix)) {
        profiles.push(value);
      }
    }
    return {
      tenantId,
      userId,
      personalizations: profiles,
    };
  }

  public async savePersonalization(
    personalization: UserDashboardPersonalization
  ): Promise<UserDashboardPersonalization> {
    const key = `${personalization.tenantId}:${personalization.userId}:${personalization.dashboardId}`;
    this.personalizationsMap.set(key, personalization);
    return personalization;
  }

  public async recordRefreshLog(entry: RefreshLogEntry): Promise<void> {
    this.refreshHistoryLog.unshift(entry);
  }

  // Seed Out-of-the-box Templates for all 9 Dashboard Types
  private seedTemplates(): void {
    const templates = [
      {
        name: 'Executive Leadership Overview',
        type: DashboardType.EXECUTIVE,
        desc: 'High-level financial KPIs, sales trends, and multi-unit restaurant performance.',
        widgets: [
          { title: 'Gross Revenue KPI', type: WidgetType.KPI, w: 3, h: 2, x: 0, y: 0 },
          { title: 'Net Profit Margin Gauge', type: WidgetType.GAUGE, w: 3, h: 2, x: 3, y: 0 },
          { title: 'Labor Cost % Metric', type: WidgetType.METRIC, w: 3, h: 2, x: 6, y: 0 },
          { title: 'Customer Satisfaction Index', type: WidgetType.KPI, w: 3, h: 2, x: 9, y: 0 },
          { title: 'Revenue vs Forecast Trend', type: WidgetType.CHART, w: 8, h: 4, x: 0, y: 2 },
          { title: 'Top Performing Stores Table', type: WidgetType.TABLE, w: 4, h: 4, x: 8, y: 2 },
        ],
      },
      {
        name: 'Restaurant Operations Command Center',
        type: DashboardType.RESTAURANT,
        desc: 'Real-time floor status, dining room utilization, and service metrics.',
        widgets: [
          { title: 'Active Tables Count', type: WidgetType.METRIC, w: 4, h: 2, x: 0, y: 0 },
          { title: 'Table Turnover Rate', type: WidgetType.GAUGE, w: 4, h: 2, x: 4, y: 0 },
          { title: 'Live Dining Floor Map', type: WidgetType.MAP, w: 4, h: 2, x: 8, y: 0 },
          { title: 'Guest Wait Time Heatmap', type: WidgetType.HEATMAP, w: 6, h: 4, x: 0, y: 2 },
          { title: 'Current Orders Queue', type: WidgetType.LIST, w: 6, h: 4, x: 6, y: 2 },
        ],
      },
      {
        name: 'Kitchen Display & Speed of Service',
        type: DashboardType.KITCHEN,
        desc: 'Ticket preparation times, line station throughput, and order bottleneck timeline.',
        widgets: [
          { title: 'Avg Kitchen Prep Time', type: WidgetType.KPI, w: 4, h: 2, x: 0, y: 0 },
          { title: 'Order Backlog Metric', type: WidgetType.METRIC, w: 4, h: 2, x: 4, y: 0 },
          { title: 'Station Load Heatmap', type: WidgetType.HEATMAP, w: 4, h: 2, x: 8, y: 0 },
          { title: 'Order Prep Timeline', type: WidgetType.TIMELINE, w: 12, h: 4, x: 0, y: 2 },
        ],
      },
      {
        name: 'Financial Performance & Cost Analytics',
        type: DashboardType.FINANCE,
        desc: 'COGS breakdown, P&L summaries, payment processing fees, and cash flow.',
        widgets: [
          { title: 'Daily Net Cashflow', type: WidgetType.KPI, w: 4, h: 2, x: 0, y: 0 },
          { title: 'COGS % of Sales', type: WidgetType.METRIC, w: 4, h: 2, x: 4, y: 0 },
          { title: 'Prime Cost Gauge', type: WidgetType.GAUGE, w: 4, h: 2, x: 8, y: 0 },
          { title: 'Department Cost Breakdown', type: WidgetType.CHART, w: 12, h: 4, x: 0, y: 2 },
        ],
      },
      {
        name: 'Inventory & Supply Chain Monitor',
        type: DashboardType.INVENTORY,
        desc: 'Stock counts, waste ratios, reorder triggers, and supplier performance.',
        widgets: [
          { title: 'Total Inventory Valuation', type: WidgetType.KPI, w: 4, h: 2, x: 0, y: 0 },
          { title: 'Food Waste Ratio', type: WidgetType.METRIC, w: 4, h: 2, x: 4, y: 0 },
          { title: 'Low Stock Reorder Alerts', type: WidgetType.LIST, w: 4, h: 2, x: 8, y: 0 },
        ],
      },
      {
        name: 'Marketing & Loyalty Campaign Tracker',
        type: DashboardType.MARKETING,
        desc: 'Promotional ROI, customer acquisition cost, and loyalty redemption rates.',
        widgets: [
          { title: 'Loyalty Member Growth', type: WidgetType.KPI, w: 6, h: 2, x: 0, y: 0 },
          { title: 'Promo Conversion Chart', type: WidgetType.CHART, w: 6, h: 2, x: 6, y: 0 },
        ],
      },
      {
        name: 'Operations & Maintenance Dashboard',
        type: DashboardType.OPERATIONS,
        desc: 'Equipment uptime, hygiene audit compliance, and labor scheduling.',
        widgets: [
          { title: 'Labor Variance Metric', type: WidgetType.METRIC, w: 6, h: 2, x: 0, y: 0 },
          { title: 'Equipment Status Gauge', type: WidgetType.GAUGE, w: 6, h: 2, x: 6, y: 0 },
        ],
      },
      {
        name: 'AI Predictive Demand Insights',
        type: DashboardType.AI,
        desc: 'Machine learning demand forecasts, automated prep recommendations, and dynamic pricing.',
        widgets: [
          { title: 'Predicted Sales Surge Gauge', type: WidgetType.GAUGE, w: 4, h: 2, x: 0, y: 0 },
          { title: 'AI Prep Recommendations List', type: WidgetType.LIST, w: 8, h: 2, x: 4, y: 0 },
          { title: 'Demand Forecast Chart', type: WidgetType.CHART, w: 12, h: 4, x: 0, y: 2 },
        ],
      },
      {
        name: 'Custom User Workspace',
        type: DashboardType.CUSTOM,
        desc: 'Customizable workspace layout for ad-hoc restaurant telemetry.',
        widgets: [
          { title: 'System Telemetry Text', type: WidgetType.TEXT, w: 12, h: 2, x: 0, y: 0 },
        ],
      },
    ];

    templates.forEach((tmpl, idx) => {
      const id = DashboardId.create(`dash-tpl-${idx + 1}`);
      const layout = DashboardLayout.defaultGrid();
      const theme = DashboardTheme.defaultTheme();

      const widgetDefs = tmpl.widgets.map((w, wIdx) =>
        WidgetDefinition.create({
          widgetId: WidgetId.create(`widg-tpl-${idx + 1}-${wIdx + 1}`),
          type: w.type,
          title: w.title,
          position: WidgetPosition.create(w.x, w.y),
          size: WidgetSize.create({ width: w.w, height: w.h }),
          refreshPolicy: RefreshPolicy.create({
            strategy: RefreshStrategy.INTERVAL,
            intervalSeconds: 60,
          }),
          biQueryBinding: {
            cubeId: `cube-sales-${tmpl.type.toLowerCase()}`,
            selectedDimensions: ['TIME', 'RESTAURANT'],
            selectedMeasures: ['REVENUE', 'ORDERS'],
          },
        })
      );

      const filterDef = DashboardFilter.create({
        name: 'Restaurant Branch',
        field: 'storeId',
        filterType: 'SELECT',
        options: ['Store-001', 'Store-002', 'Store-003'],
      });

      const aggregate = DashboardAggregate.reconstitute({
        id,
        tenantId: 'tenant-default',
        name: tmpl.name,
        description: tmpl.desc,
        dashboardType: tmpl.type,
        status: DashboardStatus.PUBLISHED,
        version: DashboardVersion.initial(),
        layout,
        theme,
        widgets: widgetDefs,
        filters: [filterDef],
        tags: ['template', tmpl.type.toLowerCase()],
        createdBy: 'system-seeder',
        updatedBy: 'system-seeder',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.dashboardsMap.set(id.getValue(), aggregate);
    });
  }
}
