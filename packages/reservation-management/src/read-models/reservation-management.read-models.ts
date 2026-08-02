/**
 * Enterprise Reservation Management Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Reservation Calendar, Availability Matrix,
 * Reservation Timeline, Reservation Summary, Deposit Report, and Reservation Statistics.
 */

import { ReservationSource, ReservationStatus } from '../domain/enums/reservation-management.enums';

export interface ReservationSummaryReadModel {
  reservationId: string;
  reservationNumber: string;
  guestName: string;
  partySize: number;
  timeSlot: string;
  source: ReservationSource;
  status: ReservationStatus;
  isVip: boolean;
  depositAmount: number;
  createdAt: string;
}

export interface ReservationCalendarReadModel {
  date: string;
  totalReservationsCount: number;
  totalGuestsCount: number;
  reservations: ReservationSummaryReadModel[];
}

export interface TimeSlotAvailabilityReadModel {
  timeSlot: string;
  availableCapacity: number;
  isAvailable: boolean;
}

export interface AvailabilityMatrixReadModel {
  date: string;
  slots: TimeSlotAvailabilityReadModel[];
}

export interface ReservationTimelineEntryReadModel {
  reservationId: string;
  event: string;
  timestamp: string;
}

export interface ReservationTimelineReadModel {
  reservationId: string;
  timeline: ReservationTimelineEntryReadModel[];
}

export interface DepositReportReadModel {
  totalDepositsRequired: number;
  totalDepositsCollected: number;
  pendingDepositsCount: number;
}

export interface ReservationStatisticsReadModel {
  totalBookings: number;
  confirmedPercentage: number;
  cancellationPercentage: number;
  noShowPercentage: number;
  averagePartySize: number;
}
