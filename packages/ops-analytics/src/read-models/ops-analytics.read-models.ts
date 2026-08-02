/**
 * Enterprise Restaurant Operations Analytics Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Operational Dashboard, Table Performance, Waiter Performance,
 * Guest Flow Dashboard, Occupancy Dashboard, and Service Quality Dashboard.
 */

import { MetricStatus, TimeWindow } from '../domain/enums/ops-analytics.enums';

export interface KpiMetricItemReadModel {
  kpiName: string;
  value: number;
  unit: string;
  status: MetricStatus;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface OperationalDashboardReadModel {
  window: TimeWindow;
  occupancyPercentage: number;
  turnoverRate: number;
  averageWaitMinutes: number;
  slaCompliancePercentage: number;
  kpis: KpiMetricItemReadModel[];
}

export interface TablePerformanceItemReadModel {
  tableId: string;
  tableNumber: string;
  turnsCount: number;
  averageSeatedMinutes: number;
  totalRevenueGenerated: number;
}

export interface TablePerformanceReadModel {
  tables: TablePerformanceItemReadModel[];
}

export interface WaiterPerformanceItemReadModel {
  waiterId: string;
  waiterName: string;
  tablesServedCount: number;
  averageRequestResponseMinutes: number;
  fulfillmentRating: number;
}

export interface WaiterPerformanceReadModel {
  waiters: WaiterPerformanceItemReadModel[];
}

export interface GuestFlowDashboardReadModel {
  hourlyArrivals: Array<{ hour: string; count: number }>;
  peakHour: string;
  averageThroughputGuestsPerHour: number;
}

export interface OccupancyDashboardReadModel {
  currentOccupancyRate: number;
  activeGuestsCount: number;
  totalFloorCapacitySeats: number;
  occupiedSeatsByArea: Array<{ areaName: string; occupiedSeats: number; maxSeats: number }>;
}

export interface ServiceQualityDashboardReadModel {
  slaTargetMinutes: number;
  slaComplianceRate: number;
  activeSlaAlertsCount: number;
  alerts: Array<{ alertId: string; metricName: string; status: MetricStatus; message: string }>;
}
