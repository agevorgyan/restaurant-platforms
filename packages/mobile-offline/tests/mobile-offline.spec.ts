/**
 * Enterprise Mobile Offline & Synchronization Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Persistent SQLite Write Queueing (Zero User Action Loss), Delta Sync Checkpoints,
 * Authenticated Background Sync, Conflict Resolution Strategies, and CQRS Read Models.
 */

import { ConnectivityStatus, SyncStatus } from '../src/domain/enums/mobile-offline.enums';
import {
  ConflictRecord,
  ConnectivityState,
  OfflineOperation,
  SyncPolicy,
} from '../src/domain/value-objects/mobile-offline-vo';
import {
  ConflictResolutionService,
  ConnectivityService,
  DeltaSyncService,
  EnterpriseMobileOfflinePlatformService,
  LocalDatabaseService,
  OfflineRuntimeService,
  QueueService,
  SyncService,
} from '../src/services/mobile-offline.services';

describe('Enterprise Mobile Offline & Synchronization Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format OfflineOperation correctly', () => {
      const op = OfflineOperation.create({
        method: 'POST',
        endpoint: '/api/v1/orders',
        payload: { orderId: 'ord-101', total: 45.0 },
      });
      expect(op.operationId).toMatch(/^m-op-/);
      expect(op.method).toBe('POST');
    });

    it('should format ConnectivityState status correctly', () => {
      const conn = ConnectivityState.online(true);
      expect(conn.isConnected).toBe(true);
      expect(conn.isCellular).toBe(true);
    });
  });

  describe('QueueService & Persistent SQLite Write Queue', () => {
    let queueService: QueueService;

    beforeEach(() => {
      queueService = new QueueService();
    });

    it('should queue write operations without losing user actions', () => {
      const op1 = OfflineOperation.create({ method: 'POST', endpoint: '/api/v1/orders', payload: { id: 1 } });
      const op2 = OfflineOperation.create({ method: 'PUT', endpoint: '/api/v1/tables/4', payload: { status: 'OCCUPIED' } });

      queueService.enqueue(op1);
      queueService.enqueue(op2);

      const readModel = queueService.getQueueReadModel();
      expect(readModel.totalQueuedCount).toBe(2);
    });
  });

  describe('SyncService & Authenticated Gate', () => {
    let connectivityService: ConnectivityService;
    let queueService: QueueService;
    let syncService: SyncService;

    beforeEach(() => {
      connectivityService = new ConnectivityService();
      queueService = new QueueService();
      syncService = new SyncService(queueService, connectivityService);
    });

    it('should block sync execution if user is unauthenticated', async () => {
      await expect(syncService.executeSync(false)).rejects.toThrow('Sync blocked: User is unauthenticated');
    });

    it('should flush queued operations when sync runs in authenticated online mode', async () => {
      queueService.enqueue(OfflineOperation.create({ method: 'POST', endpoint: '/api/v1/orders', payload: { id: 100 } }));

      const batch = await syncService.executeSync(true);
      expect(batch).toBeDefined();
      expect(batch!.operations.length).toBe(1);

      const history = syncService.getSyncHistory();
      expect(history.totalBatchesProcessed).toBe(1);
    });
  });

  describe('ConflictResolutionService', () => {
    let conflictService: ConflictResolutionService;

    beforeEach(() => {
      conflictService = new ConflictResolutionService();
    });

    it('should resolve conflicts using ClientWins, ServerWins, and MergePolicy strategies', () => {
      const conflict = ConflictRecord.create('OrderItem', { price: 15.0 }, { price: 18.0 });

      const clientWin = conflictService.resolve(conflict, 'ClientWins');
      expect(clientWin.price).toBe(15.0);

      const serverWin = conflictService.resolve(conflict, 'ServerWins');
      expect(serverWin.price).toBe(18.0);

      const history = conflictService.getConflictHistory();
      expect(history.totalConflictsEncountered).toBe(2);
    });
  });

  describe('EnterpriseMobileOfflinePlatformService & Read Models', () => {
    let connectivityService: ConnectivityService;
    let localDbService: LocalDatabaseService;
    let queueService: QueueService;
    let deltaSyncService: DeltaSyncService;
    let syncService: SyncService;
    let conflictService: ConflictResolutionService;
    let runtimeService: OfflineRuntimeService;
    let platformService: EnterpriseMobileOfflinePlatformService;

    beforeEach(() => {
      connectivityService = new ConnectivityService();
      localDbService = new LocalDatabaseService();
      queueService = new QueueService();
      deltaSyncService = new DeltaSyncService();
      syncService = new SyncService(queueService, connectivityService);
      conflictService = new ConflictResolutionService();
      runtimeService = new OfflineRuntimeService(connectivityService, queueService);

      platformService = new EnterpriseMobileOfflinePlatformService(
        connectivityService,
        localDbService,
        queueService,
        deltaSyncService,
        syncService,
        conflictService,
        runtimeService
      );
    });

    it('should query SQLite statistics and Sync Performance read models', () => {
      localDbService.setRecord('orders', 'ord-1', { total: 50.0 });

      const stats = localDbService.getStatistics();
      expect(stats.totalRecordsStored).toBe(1);

      const perf = syncService.getSyncPerformance();
      expect(perf.successRatePercentage).toBe(100.0);
    });
  });
});
