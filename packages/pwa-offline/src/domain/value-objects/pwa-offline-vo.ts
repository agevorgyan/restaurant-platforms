/**
 * Enterprise Offline & PWA Platform - Value Objects
 *
 * Immutable Value Objects encapsulating offline requests, queued write operations,
 * sync jobs/batches, conflict resolutions, network status, Service Worker cache entries/policies, and sync results.
 */

import { ConnectivityStatus, SyncStatus } from '../enums/pwa-offline.enums';

/**
 * OfflineRequest Value Object
 */
export class OfflineRequest {
  public readonly endpoint: string;
  public readonly method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  public readonly payload: unknown;
  public readonly timestamp: Date;

  private constructor(endpoint: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', payload: unknown) {
    this.endpoint = endpoint;
    this.method = method;
    this.payload = payload;
    this.timestamp = new Date();
  }

  public static create(endpoint: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST', payload?: unknown): OfflineRequest {
    return new OfflineRequest(endpoint, method, payload);
  }
}

/**
 * OfflineOperation Value Object
 */
export class OfflineOperation {
  public readonly operationId: string;
  public readonly request: OfflineRequest;
  public readonly status: SyncStatus;
  public readonly retryCount: number;

  private constructor(operationId: string, request: OfflineRequest, status: SyncStatus = SyncStatus.PENDING, retryCount: number = 0) {
    this.operationId = operationId;
    this.request = request;
    this.status = status;
    this.retryCount = retryCount;
  }

  public static create(request: OfflineRequest, operationId?: string): OfflineOperation {
    return new OfflineOperation(operationId || `op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, request);
  }
}

/**
 * SyncJob Value Object
 */
export class SyncJob {
  public readonly jobId: string;
  public readonly operation: OfflineOperation;
  public readonly scheduledAt: Date;

  private constructor(jobId: string, operation: OfflineOperation) {
    this.jobId = jobId;
    this.operation = operation;
    this.scheduledAt = new Date();
  }

  public static create(operation: OfflineOperation): SyncJob {
    return new SyncJob(`job-${operation.operationId}`, operation);
  }
}

/**
 * SyncBatch Value Object
 */
export class SyncBatch {
  public readonly batchId: string;
  public readonly jobs: SyncJob[];
  public readonly createdAt: Date;

  private constructor(batchId: string, jobs: SyncJob[]) {
    this.batchId = batchId;
    this.jobs = jobs;
    this.createdAt = new Date();
  }

  public static create(jobs: SyncJob[]): SyncBatch {
    return new SyncBatch(`batch-${Date.now()}`, jobs);
  }
}

/**
 * ConflictResolution Value Object
 */
export class ConflictResolution {
  public readonly operationId: string;
  public readonly strategy: 'ClientWins' | 'ServerWins' | 'MergePolicy';
  public readonly resolvedData: unknown;

  private constructor(operationId: string, strategy: 'ClientWins' | 'ServerWins' | 'MergePolicy', resolvedData: unknown) {
    this.operationId = operationId;
    this.strategy = strategy;
    this.resolvedData = resolvedData;
  }

  public static create(operationId: string, strategy: 'ClientWins' | 'ServerWins' | 'MergePolicy', resolvedData: unknown): ConflictResolution {
    return new ConflictResolution(operationId, strategy, resolvedData);
  }
}

/**
 * NetworkStatus Value Object
 */
export class NetworkStatus {
  public readonly status: ConnectivityStatus;
  public readonly effectiveType: string;
  public readonly rttMs: number;

  private constructor(status: ConnectivityStatus, effectiveType: string = '4g', rttMs: number = 50) {
    this.status = status;
    this.effectiveType = effectiveType;
    this.rttMs = rttMs;
  }

  public static create(status: ConnectivityStatus, effectiveType?: string, rttMs?: number): NetworkStatus {
    return new NetworkStatus(status, effectiveType, rttMs);
  }
}

/**
 * CachePolicy Value Object
 */
export class CachePolicy {
  public readonly strategyName: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly';
  public readonly maxAgeSeconds: number;
  public readonly maxEntries: number;

  private constructor(
    strategyName: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly',
    maxAgeSeconds: number = 86400,
    maxEntries: number = 500
  ) {
    this.strategyName = strategyName;
    this.maxAgeSeconds = maxAgeSeconds;
    this.maxEntries = maxEntries;
  }

  public static create(
    strategyName: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' = 'StaleWhileRevalidate',
    maxAgeSeconds?: number,
    maxEntries?: number
  ): CachePolicy {
    return new CachePolicy(strategyName, maxAgeSeconds, maxEntries);
  }
}

/**
 * CacheEntry Value Object
 */
export class CacheEntry {
  public readonly key: string;
  public readonly data: unknown;
  public readonly cachedAt: Date;

  private constructor(key: string, data: unknown) {
    this.key = key;
    this.data = data;
    this.cachedAt = new Date();
  }

  public static create(key: string, data: unknown): CacheEntry {
    return new CacheEntry(key, data);
  }
}

/**
 * SyncResult Value Object
 */
export class SyncResult {
  public readonly batchId: string;
  public readonly totalSynced: number;
  public readonly totalFailed: number;
  public readonly totalConflicts: number;

  private constructor(batchId: string, totalSynced: number, totalFailed: number, totalConflicts: number) {
    this.batchId = batchId;
    this.totalSynced = totalSynced;
    this.totalFailed = totalFailed;
    this.totalConflicts = totalConflicts;
  }

  public static create(batchId: string, totalSynced: number, totalFailed: number = 0, totalConflicts: number = 0): SyncResult {
    return new SyncResult(batchId, totalSynced, totalFailed, totalConflicts);
  }
}

/**
 * OfflineState Value Object
 */
export class OfflineState {
  public readonly isOffline: boolean;
  public readonly queuedOperationsCount: number;
  public readonly lastSyncedAt?: Date;

  private constructor(isOffline: boolean, queuedOperationsCount: number, lastSyncedAt?: Date) {
    this.isOffline = isOffline;
    this.queuedOperationsCount = queuedOperationsCount;
    this.lastSyncedAt = lastSyncedAt;
  }

  public static create(isOffline: boolean, queuedOperationsCount: number = 0, lastSyncedAt?: Date): OfflineState {
    return new OfflineState(isOffline, queuedOperationsCount, lastSyncedAt);
  }
}
