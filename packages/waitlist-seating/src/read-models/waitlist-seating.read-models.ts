/**
 * Enterprise Waitlist & Seating Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Waitlist Overview, Host Dashboard, Table Assignments,
 * Waiting Guests, Turn Predictions, and Guest Flow Statistics.
 */

import { SeatingStrategy, WaitlistStatus } from '../domain/enums/waitlist-seating.enums';

export interface WaitingGuestReadModel {
  waitlistId: string;
  guestName: string;
  partySize: number;
  phone: string;
  isVip: boolean;
  queuePosition: number;
  quotedWaitMinutes: number;
  status: WaitlistStatus;
  arrivedAt: string;
}

export interface WaitingGuestsReadModel {
  totalWaitingCount: number;
  guests: WaitingGuestReadModel[];
}

export interface TableAssignmentItemReadModel {
  tableId: string;
  waitlistId: string;
  guestName: string;
  partySize: number;
  seatedAt: string;
}

export interface TableAssignmentsReadModel {
  activeAssignmentsCount: number;
  assignments: TableAssignmentItemReadModel[];
}

export interface TurnPredictionItemReadModel {
  tableId: string;
  currentPartySize: number;
  seatedMinutesAgo: number;
  predictedMinutesRemaining: number;
}

export interface TurnPredictionsReadModel {
  predictions: TurnPredictionItemReadModel[];
}

export interface HostDashboardReadModel {
  totalWaitingParties: number;
  averageQuotedWaitMinutes: number;
  availableTablesCount: number;
  waitingList: WaitingGuestReadModel[];
  turnPredictions: TurnPredictionItemReadModel[];
}

export interface WaitlistOverviewReadModel {
  date: string;
  totalWalkIns: number;
  totalSeated: number;
  totalCancelled: number;
  averageWaitTimeMinutes: number;
}

export interface GuestFlowStatisticsReadModel {
  totalWalkInsToday: number;
  seatedPercentage: number;
  cancellationPercentage: number;
  averageWaitMinutes: number;
}
