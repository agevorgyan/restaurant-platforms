/**
 * Enterprise Mobile Offline & Synchronization Platform - Value Objects
 *
 * Immutable Value Objects encapsulating offline operations, sync batches, sync checkpoints, sync tokens, conflict records, connectivity states, local entity versions, sync statistics, and sync policies.
 */

import { ConnectivityStatus, SyncStatus } from '../enums/mobile-offline.enums';

/**
 * SyncPolicy Value Object
 */
export class SyncPolicy {
  public readonly maxRetries: number;
  public readonly batchSize: number;
  public readonly syncIntervalMs: number;

  private constructor(maxRetries: number, batchSize: number, syncIntervalMs: number) {
    this.maxRetries = maxRetries;
    this.batchSize = batchSize;
    this.syncIntervalMs = syncIntervalMs;
  }

  public static create(maxRetries: number = 5, batchSize: number = 25, syncIntervalMs: number = 30000): SyncPolicy {
    return new SyncPolicy(maxRetries, batchSize, syncIntervalMs);
  }
}

/**
 * ConnectivityState Value Object
 */
export class ConnectivityState {
  public readonly status: ConnectivityStatus;
  public readonly isConnected: boolean;
  public readonly isCellular: boolean;

  private constructor(status: ConnectivityStatus, isConnected: boolean, isCellular: boolean) {
    this.status = status;
    this.isConnected = isConnected;
    this.isCellular = isCellular;
  }

  public static online(isCellular: boolean = false): ConnectivityState {
    return new ConnectivityState(ConnectivityStatus.ONLINE, true, isCellular);
  }

  public static offline(): ConnectivityState {
    return new ConnectivityState(ConnectivityStatus.OFFLINE, false, false);
  }

  public static create(status: ConnectivityStatus = ConnectivityStatus.ONLINE): ConnectivityState {
    return new ConnectivityState(status, status === ConnectivityStatus.ONLINE, false);
  }
}

/**
 * OfflineOperation Value Object
 */
export class OfflineOperation {
  public readonly operationId: string;
  public readonly method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  public readonly endpoint: string;
  public readonly payload: Record<string, any>;
  public readonly createdAt: Date;
  public readonly retryCount: number;

  private constructor(operationId: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', endpoint: string, payload: Record<string, any>, createdAt: Date, retryCount: number) {
    this.operationId = operationId;
    this.method = method;
    this.endpoint = endpoint;
    this.payload = payload;
    this.createdAt = createdAt;
    this.retryCount = retryCount;
  }

  public static create(props: {
    operationId?: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    endpoint: string;
    payload: Record<string, any>;
    retryCount?: number;
  }): OfflineOperation {
    return new OfflineOperation(
      props.operationId || `m-op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      props.method,
      props.endpoint,
      props.payload,
      new Date(),
      props.retryCount || 0
    );
  }
}

/**
 * SyncBatch Value Object
 */
export class SyncBatch {
  public readonly batchId: string;
  public readonly operations: OfflineOperation[];
  public readonly createdAt: Date;

  private constructor(batchId: string, operations: OfflineOperation[]) {
    this.batchId = batchId;
    this.operations = operations;
    this.createdAt = new Date();
  }

  public static create(operations: OfflineOperation[]): SyncBatch {
    return new SyncBatch(`m-batch-${Date.now()}`, operations);
  }
}

/**
 * SyncToken & SyncCheckpoint Value Objects
 */
export class SyncToken {
  public readonly token: string;

  private constructor(token: string) {
    this.token = token;
  }

  public static create(token?: string): SyncToken {
    return new SyncToken(token || `stok-${Date.now()}`);
  }
}

export class SyncCheckpoint {
  public readonly checkpointId: string;
  public readonly token: SyncToken;
  public readonly updatedAt: Date;

  private constructor(checkpointId: string, token: SyncToken) {
    this.checkpointId = checkpointId;
    this.token = token;
    this.updatedAt = new Date();
  }

  public static create(checkpointId: string, token: SyncToken): SyncCheckpoint {
    return new SyncCheckpoint(checkpointId, token);
  }
}

/**
 * ConflictRecord Value Object
 */
export class ConflictRecord {
  public readonly conflictId: string;
  public readonly entityName: string;
  public readonly clientData: Record<string, any>;
  public readonly serverData: Record<string, any>;
  public readonly detectedAt: Date;

  private constructor(conflictId: string, entityName: string, clientData: Record<string, any>, serverData: Record<string, any>) {
    this.conflictId = conflictId;
    this.entityName = entityName;
    this.clientData = clientData;
    this.serverData = serverData;
    this.detectedAt = new Date();
  }

  public static create(entityName: string, clientData: Record<string, any>, serverData: Record<string, any>): ConflictRecord {
    return new ConflictRecord(`m-conf-${Date.now()}`, entityName, clientData, serverData);
  }
}

/**
 * LocalEntityVersion & SyncStatistics Value Objects
 */
export class LocalEntityVersion {
  public readonly entityId: string;
  public readonly version: number;

  private constructor(entityId: string, version: number) {
    this.entityId = entityId;
    this.version = version;
  }

  public static create(entityId: string, version: number = 1): LocalEntityVersion {
    return new LocalEntityVersion(entityId, version);
  }
}

export class SyncStatistics {
  public readonly totalSynced: number;
  public readonly totalFailed: number;
  public readonly totalConflicts: number;

  private constructor(totalSynced: number, totalFailed: number, totalConflicts: number) {
    this.totalSynced = totalSynced;
    this.totalFailed = totalFailed;
    this.totalConflicts = totalConflicts;
  }

  public static create(totalSynced: number, totalFailed: number, totalConflicts: number): SyncStatistics {
    return new SyncStatistics(totalSynced, totalFailed, totalConflicts);
  }
}
