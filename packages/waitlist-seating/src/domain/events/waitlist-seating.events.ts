/**
 * Enterprise Waitlist & Seating Platform - Domain Events
 *
 * Domain events emitted during waitlist additions, guest notifications, table assignments, table releases, and turn predictions.
 */

import { SeatingStrategy, WaitlistStatus } from '../enums/waitlist-seating.enums';

export interface GuestAddedToWaitlistEvent {
  eventName: 'GuestAddedToWaitlist';
  waitlistId: string;
  guestName: string;
  partySize: number;
  quotedWaitMinutes: number;
  timestamp: Date;
}

export interface GuestNotifiedEvent {
  eventName: 'GuestNotified';
  waitlistId: string;
  channel: string;
  timestamp: Date;
}

export interface GuestSeatedEvent {
  eventName: 'GuestSeated';
  waitlistId: string;
  tableId: string;
  timestamp: Date;
}

export interface WaitlistCancelledEvent {
  eventName: 'WaitlistCancelled';
  waitlistId: string;
  reason: string;
  timestamp: Date;
}

export interface WaitTimeUpdatedEvent {
  eventName: 'WaitTimeUpdated';
  waitlistId: string;
  newEstimatedMinutes: number;
  timestamp: Date;
}

export interface TableAssignedEvent {
  eventName: 'TableAssigned';
  waitlistId: string;
  tableId: string;
  assignedByHostId: string;
  timestamp: Date;
}

export interface TableReleasedEvent {
  eventName: 'TableReleased';
  tableId: string;
  timestamp: Date;
}

export interface TurnPredictionUpdatedEvent {
  eventName: 'TurnPredictionUpdated';
  tableId: string;
  predictedTurnMinutes: number;
  timestamp: Date;
}

export type WaitlistSeatingDomainEvent =
  | GuestAddedToWaitlistEvent
  | GuestNotifiedEvent
  | GuestSeatedEvent
  | WaitlistCancelledEvent
  | WaitTimeUpdatedEvent
  | TableAssignedEvent
  | TableReleasedEvent
  | TurnPredictionUpdatedEvent;
