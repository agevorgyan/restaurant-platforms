/**
 * Enterprise Guest Service Workflow Platform - Domain Events
 *
 * Domain events emitted during guest check-ins, waiter assignments, service stage updates, guest requests, transfers, and visit completions.
 */

import { RequestStatus, VisitStatus } from '../enums/guest-service-workflow.enums';

export interface GuestCheckedInEvent {
  eventName: 'GuestCheckedIn';
  guestVisitId: string;
  guestName: string;
  tableId?: string;
  timestamp: Date;
}

export interface WaiterAssignedEvent {
  eventName: 'WaiterAssigned';
  guestVisitId: string;
  waiterId: string;
  waiterName: string;
  timestamp: Date;
}

export interface ServiceStageChangedEvent {
  eventName: 'ServiceStageChanged';
  guestVisitId: string;
  previousStage: string;
  newStage: string;
  timestamp: Date;
}

export interface GuestRequestCreatedEvent {
  eventName: 'GuestRequestCreated';
  requestId: string;
  guestVisitId: string;
  requestType: string;
  priority: string;
  timestamp: Date;
}

export interface GuestRequestCompletedEvent {
  eventName: 'GuestRequestCompleted';
  requestId: string;
  completedByWaiterId: string;
  timestamp: Date;
}

export interface TableTransferredEvent {
  eventName: 'TableTransferred';
  guestVisitId: string;
  fromTableId: string;
  toTableId: string;
  timestamp: Date;
}

export interface WaiterTransferredEvent {
  eventName: 'WaiterTransferred';
  guestVisitId: string;
  fromWaiterId: string;
  toWaiterId: string;
  timestamp: Date;
}

export interface GuestVisitCompletedEvent {
  eventName: 'GuestVisitCompleted';
  guestVisitId: string;
  totalDurationMinutes: number;
  timestamp: Date;
}

export type GuestServiceWorkflowDomainEvent =
  | GuestCheckedInEvent
  | WaiterAssignedEvent
  | ServiceStageChangedEvent
  | GuestRequestCreatedEvent
  | GuestRequestCompletedEvent
  | TableTransferredEvent
  | WaiterTransferredEvent
  | GuestVisitCompletedEvent;
