/**
 * Enterprise Guest Service Workflow Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Active Guests, Waiter Workload, Guest Requests,
 * Service Timeline, Dining Statistics, and Service Quality Dashboard.
 */

import { RequestStatus, VisitStatus } from '../domain/enums/guest-service-workflow.enums';

export interface ActiveGuestVisitReadModel {
  guestVisitId: string;
  guestName: string;
  tableId: string;
  waiterId: string;
  waiterName: string;
  currentStage: string;
  status: VisitStatus;
  seatedAt: string;
  durationMinutes: number;
}

export interface ActiveGuestsReadModel {
  totalActiveVisits: number;
  visits: ActiveGuestVisitReadModel[];
}

export interface WaiterWorkloadItemReadModel {
  waiterId: string;
  waiterName: string;
  activeTablesCount: number;
  activeGuestsCount: number;
}

export interface WaiterWorkloadReadModel {
  waiters: WaiterWorkloadItemReadModel[];
}

export interface GuestRequestItemReadModel {
  requestId: string;
  guestVisitId: string;
  tableId: string;
  requestType: string;
  priority: string;
  status: RequestStatus;
  requestedAt: string;
}

export interface GuestRequestsReadModel {
  pendingRequestsCount: number;
  requests: GuestRequestItemReadModel[];
}

export interface StageEntryReadModel {
  stageName: string;
  timestamp: string;
}

export interface ServiceTimelineReadModel {
  guestVisitId: string;
  stages: StageEntryReadModel[];
}

export interface DiningStatisticsReadModel {
  totalCompletedVisits: number;
  averageVisitDurationMinutes: number;
  averageStageDurationMinutes: number;
}

export interface ServiceQualityDashboardReadModel {
  overallSatisfactionScore: number;
  averageRequestFulfillmentMinutes: number;
  totalServiceAlerts: number;
  waiterWorkloadOverview: WaiterWorkloadItemReadModel[];
}
