/**
 * Enterprise Mobile Offline & Synchronization Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Synchronization History, Offline Queue, Conflict History,
 * Connectivity Metrics, Local Database Statistics, and Synchronization Performance.
 */

import { ConnectivityStatus, SyncStatus } from '../domain/enums/mobile-offline.enums';

export interface SyncHistoryEntryReadModel {
  batchId: string;
  operationsCount: number;
  status: SyncStatus;
  syncedAt: string;
}

export interface SyncHistoryReadModel {
  totalBatchesProcessed: number;
  history: SyncHistoryEntryReadModel[];
}

export interface QueuedOperationSummaryReadModel {
  operationId: string;
  method: string;
  endpoint: string;
  retryCount: number;
  createdAt: string;
}

export interface OfflineQueueReadModel {
  totalQueuedCount: number;
  queue: QueuedOperationSummaryReadModel[];
}

export interface ConflictHistoryEntryReadModel {
  conflictId: string;
  entityName: string;
  resolvedStrategy?: string;
  detectedAt: string;
}

export interface ConflictHistoryReadModel {
  totalConflictsEncountered: number;
  conflicts: ConflictHistoryEntryReadModel[];
}

export interface ConnectivityMetricsReadModel {
  currentStatus: ConnectivityStatus;
  totalOutagesRecorded: number;
  averageOutageDurationMs: number;
  lastOnlineAt: string;
}

export interface LocalDatabaseStatisticsReadModel {
  totalRecordsStored: number;
  sqliteDatabaseSizeBytes: number;
  cachedTablesCount: number;
}

export interface SyncPerformanceReadModel {
  averageSyncDurationMs: number;
  throughputOperationsPerSec: number;
  successRatePercentage: number;
}
