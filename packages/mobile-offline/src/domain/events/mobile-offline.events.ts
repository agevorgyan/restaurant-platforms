/**
 * Enterprise Mobile Offline & Synchronization Platform - Domain Events
 *
 * Domain events emitted during offline transitions, operation queueing, sync execution, conflict resolution, and delta application.
 */

import { ConnectivityStatus, SyncStatus } from '../enums/mobile-offline.enums';

export interface OfflineEnteredEvent {
  eventName: 'OfflineEntered';
  status: ConnectivityStatus;
  timestamp: Date;
}

export interface OfflineExitedEvent {
  eventName: 'OfflineExited';
  status: ConnectivityStatus;
  timestamp: Date;
}

export interface SyncQueuedEvent {
  eventName: 'SyncQueued';
  operationId: string;
  endpoint: string;
  timestamp: Date;
}

export interface SyncStartedEvent {
  eventName: 'SyncStarted';
  batchId: string;
  operationsCount: number;
  timestamp: Date;
}

export interface SyncCompletedEvent {
  eventName: 'SyncCompleted';
  batchId: string;
  syncedCount: number;
  timestamp: Date;
}

export interface ConflictDetectedEvent {
  eventName: 'ConflictDetected';
  conflictId: string;
  entityName: string;
  timestamp: Date;
}

export interface ConflictResolvedEvent {
  eventName: 'ConflictResolved';
  conflictId: string;
  strategyUsed: string;
  timestamp: Date;
}

export interface DeltaAppliedEvent {
  eventName: 'DeltaApplied';
  checkpointToken: string;
  recordsCount: number;
  timestamp: Date;
}

export type MobileOfflineDomainEvent =
  | OfflineEnteredEvent
  | OfflineExitedEvent
  | SyncQueuedEvent
  | SyncStartedEvent
  | SyncCompletedEvent
  | ConflictDetectedEvent
  | ConflictResolvedEvent
  | DeltaAppliedEvent;
