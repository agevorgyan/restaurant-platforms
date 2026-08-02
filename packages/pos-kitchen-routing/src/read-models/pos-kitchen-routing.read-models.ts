/**
 * Enterprise Kitchen Routing & Production Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Kitchen Queue, Station Overview, Course Status,
 * Production Timeline, Kitchen Statistics, and Expo Dashboard.
 */

import { KitchenTicketStatus, StationStatus } from '../domain/enums/pos-kitchen-routing.enums';

export interface KitchenTicketSummaryReadModel {
  ticketId: string;
  orderId: string;
  tableNo?: string;
  stationName: string;
  itemsCount: number;
  status: KitchenTicketStatus;
  queuedAt: string;
}

export interface KitchenQueueReadModel {
  totalQueuedTickets: number;
  tickets: KitchenTicketSummaryReadModel[];
}

export interface StationOverviewReadModel {
  stationId: string;
  stationName: string;
  stationType: string;
  status: StationStatus;
  activeTicketsCount: number;
}

export interface CourseStatusReadModel {
  orderId: string;
  courseNumber: number;
  courseName: string;
  isFired: boolean;
  firedAt?: string;
}

export interface ProductionTimelineReadModel {
  ticketId: string;
  prepStartedAt?: string;
  prepCompletedAt?: string;
  totalDurationMinutes?: number;
}

export interface KitchenStatisticsReadModel {
  totalTicketsProcessed: number;
  averagePrepTimeMinutes: number;
  onTimeCompletionPercentage: number;
}

export interface ExpoDashboardReadModel {
  activeOrdersCount: number;
  ordersReadyForPickup: number;
  consolidatedTickets: Array<{
    orderId: string;
    tableNo?: string;
    totalStations: number;
    completedStations: number;
    isFullyReady: boolean;
  }>;
}
