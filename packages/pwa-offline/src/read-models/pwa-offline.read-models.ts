/**
 * Enterprise Offline & PWA Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Offline Operations, Sync History, Cache Performance,
 * Connectivity History, Conflict History, and PWA Status.
 */

import { ConnectivityStatus, SyncStatus } from '../domain/enums/pwa-offline.enums';

export interface OfflineOperationsReadModel {
  totalQueuedOperations: number;
  operations: Array<{
    operationId: string;
    endpoint: string;
    method: string;
    status: SyncStatus;
    queuedAt: string;
  }>;
}

export interface SyncHistoryReadModel {
  totalSyncBatchesExecuted: number;
  totalSyncedOperationsCount: number;
  totalFailedOperationsCount: number;
  batches: Array<{
    batchId: string;
    totalSynced: number;
    totalFailed: number;
    executedAt: string;
  }>;
}

export interface CacheStatisticsReadModel {
  totalCacheEntries: number;
  cacheHitRatioPercentage: number;
  totalCacheSizeBytes: number;
  strategiesCount: Record<string, number>;
}

export interface ConnectivityHistoryReadModel {
  currentStatus: ConnectivityStatus;
  totalOutagesCount: number;
  history: Array<{
    status: ConnectivityStatus;
    timestamp: string;
  }>;
}

export interface ConflictHistoryReadModel {
  totalConflictsDetected: number;
  totalConflictsResolved: number;
  conflicts: Array<{
    operationId: string;
    strategy: string;
    resolvedAt: string;
  }>;
}

export interface PwaStatusReadModel {
  isServiceWorkerRegistered: boolean;
  isPwaInstallable: boolean;
  isInstalled: boolean;
  activeManifestName: string;
}
