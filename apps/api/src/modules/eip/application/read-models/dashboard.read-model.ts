export interface DashboardFilter {
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  organizationId?: string;
  restaurantId?: string;
  branchId?: string;
  region?: string;
  currency?: string;
  timezone?: string;
}

export interface DashboardWidget {
  widgetId: string;
  title: string;
  type: 'CHART_LINE' | 'CHART_BAR' | 'KPI_CARD' | 'TABLE' | 'ALERT_LIST';
  dataSource: string; // e.g., 'KPI_ENGINE', 'FINANCIAL_REPORTS'
  data: any; // Render payload for the frontend
  refreshIntervalMs: number;
}

export interface DashboardSection {
  sectionId: string;
  title: string;
  order: number;
  widgets: DashboardWidget[];
}

export interface DashboardLayout {
  layoutId: string;
  role: string;
  theme: string;
  sections: DashboardSection[];
}

export interface DashboardSnapshot {
  snapshotId: string;
  role: string;
  generatedAt: Date;
  layout: DashboardLayout;
  appliedFilters: DashboardFilter;
}
