import { 
  DashboardFilter, 
  DashboardSnapshot, 
  DashboardWidget, 
  DashboardSection, 
  DashboardLayout 
} from '../read-models';

export class DashboardCacheService {
  private cache = new Map<string, { data: any, expiresAt: number }>();

  public async getCachedWidgetData(widgetId: string, filterHash: string): Promise<any | null> {
    const key = `${widgetId}_${filterHash}`;
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    return null;
  }

  public async setCachedWidgetData(widgetId: string, filterHash: string, data: any, ttlMs: number): Promise<void> {
    const key = `${widgetId}_${filterHash}`;
    this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  public generateFilterHash(filter: DashboardFilter): string {
    return JSON.stringify(filter); // Simple deterministic hash representation for mock
  }
}

export class WidgetCompositionService {
  constructor(private readonly cacheService: DashboardCacheService) {}

  public async buildWidget(widgetConfig: any, filter: DashboardFilter): Promise<DashboardWidget> {
    const filterHash = this.cacheService.generateFilterHash(filter);
    
    // Check Cache
    const cachedData = await this.cacheService.getCachedWidgetData(widgetConfig.id, filterHash);
    let data = cachedData;
    
    if (!data) {
      // Mock data fetching from underlying Enterprise KPI Engine or Analytics engines
      data = this.fetchMockDataForWidget(widgetConfig.dataSource);
      await this.cacheService.setCachedWidgetData(widgetConfig.id, filterHash, data, 60000); // 60s cache
    }

    return {
      widgetId: widgetConfig.id,
      title: widgetConfig.title,
      type: widgetConfig.type,
      dataSource: widgetConfig.dataSource,
      data,
      refreshIntervalMs: widgetConfig.refreshIntervalMs || 60000
    };
  }

  private fetchMockDataForWidget(dataSource: string): any {
    switch (dataSource) {
      case 'KPI_REVENUE': return { value: 1250000, trend: 'UP', change: 12 };
      case 'KPI_LABOR_COST': return { value: 28, trend: 'DOWN', change: 2 };
      case 'SALES_TREND': return { series: [100, 110, 105, 120, 135] };
      default: return { data: 'MOCK_DATA' };
    }
  }
}

export class PersonalizationService {
  public async getLayoutForRole(role: string): Promise<DashboardLayout> {
    const layoutId = `layout_${role.toLowerCase()}`;
    
    // In a real system, this would load from a configuration database
    const sections: DashboardSection[] = [
      {
        sectionId: 'sec_overview',
        title: 'Executive Overview',
        order: 1,
        widgets: [] // to be populated by the builder
      }
    ];

    return {
      layoutId,
      role,
      theme: 'DARK',
      sections
    };
  }
}

export class DashboardBuilder {
  constructor(
    private readonly widgetService: WidgetCompositionService,
    private readonly personalizationService: PersonalizationService
  ) {}

  public async buildDashboard(role: string, filter: DashboardFilter): Promise<DashboardSnapshot> {
    const layout = await this.personalizationService.getLayoutForRole(role);

    // Mock widget configurations for the role
    const widgetConfigs = [
      { id: 'w1', title: 'Total Revenue', type: 'KPI_CARD', dataSource: 'KPI_REVENUE' },
      { id: 'w2', title: 'Labor Cost %', type: 'KPI_CARD', dataSource: 'KPI_LABOR_COST' },
      { id: 'w3', title: 'Sales Trend', type: 'CHART_LINE', dataSource: 'SALES_TREND' }
    ];

    // Build all widgets concurrently
    const builtWidgets = await Promise.all(
      widgetConfigs.map(cfg => this.widgetService.buildWidget(cfg, filter))
    );

    // Assign widgets to the first section
    layout.sections[0].widgets = builtWidgets;

    return {
      snapshotId: crypto.randomUUID(),
      role,
      generatedAt: new Date(),
      layout,
      appliedFilters: filter
    };
  }
}
