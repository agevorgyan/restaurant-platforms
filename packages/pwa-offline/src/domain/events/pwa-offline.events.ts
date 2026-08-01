/**
 * Enterprise Offline & PWA Platform - Domain Events
 *
 * Domain events emitted during network status transitions, offline mode toggles,
 * background sync execution, conflict resolution, and Service Worker cache updates.
 */

export interface OfflineModeEnteredEvent {
  eventName: 'OfflineModeEntered';
  timestamp: Date;
}

export interface OfflineModeExitedEvent {
  eventName: 'OfflineModeExited';
  durationMs: number;
  timestamp: Date;
}

export interface SyncStartedEvent {
  eventName: 'SyncStarted';
  batchId: string;
  queuedItemsCount: number;
  timestamp: Date;
}

export interface SyncCompletedEvent {
  eventName: 'SyncCompleted';
  batchId: string;
  syncedCount: number;
  failedCount: number;
  timestamp: Date;
}

export interface ConflictDetectedEvent {
  eventName: 'ConflictDetected';
  operationId: string;
  conflictDetails: string;
  timestamp: Date;
}

export interface ConflictResolvedEvent {
  eventName: 'ConflictResolved';
  operationId: string;
  resolutionStrategy: string;
  timestamp: Date;
}

export interface CacheUpdatedEvent {
  eventName: 'CacheUpdated';
  cacheName: string;
  entriesUpdatedCount: number;
  timestamp: Date;
}

export type PwaOfflineDomainEvent =
  | OfflineModeEnteredEvent
  | OfflineModeExitedEvent
  | SyncStartedEvent
  | SyncCompletedEvent
  | ConflictDetectedEvent
  | ConflictResolvedEvent
  | CacheUpdatedEvent;
