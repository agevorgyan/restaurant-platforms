/**
 * Enterprise Kitchen Routing & Production Platform - Domain Events
 *
 * Domain events emitted during ticket creation, station assignment, course firing, state transitions, and station blocking.
 */

import { KitchenTicketStatus } from '../enums/pos-kitchen-routing.enums';

export interface KitchenTicketCreatedEvent {
  eventName: 'KitchenTicketCreated';
  ticketId: string;
  orderId: string;
  tableNo?: string;
  timestamp: Date;
}

export interface TicketAssignedEvent {
  eventName: 'TicketAssigned';
  ticketId: string;
  stationId: string;
  timestamp: Date;
}

export interface TicketAcceptedEvent {
  eventName: 'TicketAccepted';
  ticketId: string;
  stationId: string;
  timestamp: Date;
}

export interface PreparationStartedEvent {
  eventName: 'PreparationStarted';
  ticketId: string;
  stationId: string;
  timestamp: Date;
}

export interface PreparationCompletedEvent {
  eventName: 'PreparationCompleted';
  ticketId: string;
  stationId: string;
  timestamp: Date;
}

export interface CourseFiredEvent {
  eventName: 'CourseFired';
  ticketId: string;
  courseNumber: number;
  timestamp: Date;
}

export interface TicketServedEvent {
  eventName: 'TicketServed';
  ticketId: string;
  timestamp: Date;
}

export interface StationBlockedEvent {
  eventName: 'StationBlocked';
  stationId: string;
  reason: string;
  timestamp: Date;
}

export type PosKitchenRoutingDomainEvent =
  | KitchenTicketCreatedEvent
  | TicketAssignedEvent
  | TicketAcceptedEvent
  | PreparationStartedEvent
  | PreparationCompletedEvent
  | CourseFiredEvent
  | TicketServedEvent
  | StationBlockedEvent;
