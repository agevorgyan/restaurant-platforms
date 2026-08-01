/**
 * Enterprise Dashboard Platform - Domain Enums
 *
 * Defines core domain enumerations for dashboard classifications, widget categories,
 * container layout strategies, lifecycle status states, and automated refresh strategies.
 */

export enum DashboardType {
  EXECUTIVE = 'EXECUTIVE',
  RESTAURANT = 'RESTAURANT',
  KITCHEN = 'KITCHEN',
  FINANCE = 'FINANCE',
  INVENTORY = 'INVENTORY',
  MARKETING = 'MARKETING',
  OPERATIONS = 'OPERATIONS',
  AI = 'AI',
  CUSTOM = 'CUSTOM',
}

export enum WidgetType {
  KPI = 'KPI',
  METRIC = 'METRIC',
  CHART = 'CHART',
  TABLE = 'TABLE',
  GAUGE = 'GAUGE',
  MAP = 'MAP',
  TIMELINE = 'TIMELINE',
  HEATMAP = 'HEATMAP',
  LIST = 'LIST',
  TEXT = 'TEXT',
}

export enum LayoutType {
  GRID = 'GRID',
  RESPONSIVE = 'RESPONSIVE',
  FIXED = 'FIXED',
  FREEFORM = 'FREEFORM',
}

export enum DashboardStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum RefreshStrategy {
  MANUAL = 'MANUAL',
  INTERVAL = 'INTERVAL',
  EVENT_DRIVEN = 'EVENT_DRIVEN',
  REALTIME = 'REALTIME',
}
