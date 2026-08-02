/**
 * Enterprise Reservation Management Platform - Domain Events
 *
 * Domain events emitted during reservation creation, deposits, confirmations, check-ins, cancellations, and expirations.
 */

import { ReservationSource, ReservationStatus } from '../enums/reservation-management.enums';

export interface ReservationCreatedEvent {
  eventName: 'ReservationCreated';
  reservationId: string;
  reservationNumber: string;
  partySize: number;
  timeSlot: Date;
  source: ReservationSource;
  timestamp: Date;
}

export interface ReservationConfirmedEvent {
  eventName: 'ReservationConfirmed';
  reservationId: string;
  timestamp: Date;
}

export interface DepositReceivedEvent {
  eventName: 'DepositReceived';
  reservationId: string;
  depositAmount: number;
  transactionRef: string;
  timestamp: Date;
}

export interface ReservationCancelledEvent {
  eventName: 'ReservationCancelled';
  reservationId: string;
  reason: string;
  timestamp: Date;
}

export interface ReservationExpiredEvent {
  eventName: 'ReservationExpired';
  reservationId: string;
  timestamp: Date;
}

export interface GuestCheckedInEvent {
  eventName: 'GuestCheckedIn';
  reservationId: string;
  timestamp: Date;
}

export interface NoShowDetectedEvent {
  eventName: 'NoShowDetected';
  reservationId: string;
  timestamp: Date;
}

export interface ReservationCompletedEvent {
  eventName: 'ReservationCompleted';
  reservationId: string;
  timestamp: Date;
}

export type ReservationDomainEvent =
  | ReservationCreatedEvent
  | ReservationConfirmedEvent
  | DepositReceivedEvent
  | ReservationCancelledEvent
  | ReservationExpiredEvent
  | GuestCheckedInEvent
  | NoShowDetectedEvent
  | ReservationCompletedEvent;
