/**
 * Enterprise Offline & PWA Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Network Status Detection, Offline Operation Queueing (Zero User Action Loss),
 * Authenticated Background Sync API, Conflict Resolution Policies, Service Worker Cache Engines, and CQRS Read Models.
 */

import { ConnectivityStatus, SyncStatus } from '../src/domain/enums/pwa-offline.enums';
import {
  CachePolicy,
  ConflictResolution,
  NetworkStatus,
  OfflineOperation,
  OfflineRequest,
} from '../src/domain/value-objects/pwa-offline-vo';
import {
  CacheService,
  ConflictService,
  ConnectivityService,
  EnterprisePwaOfflinePlatformService,
  OfflineService,
  PwaService,
  SyncService,
} from '../src/services/pwa-offline.services';

describe('Enterprise Offline & PWA Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should create OfflineRequest and format OfflineOperation ID', () => {
      const req = OfflineRequest.create('/api/v1/orders', 'POST', { orderId: 'ord-101' });
      const op = OfflineOperation.create(req);

      expect(op.operationId).toMatch(/^op-/);
      expect(op.status).toBe(SyncStatus.PENDING);
      expect(op.request.endpoint).toBe('/api/v1/orders');
    });

    it('should create CachePolicy with custom strategy', () => {
      const policy = CachePolicy.create('CacheFirst', 3600, 100);
      expect(policy.strategyName).toBe('CacheFirst');
      expect(policy.maxAgeSeconds).toBe(3600);
    });
  });

  describe('Connectivity & Offline Queue Services', () => {
    let connectivityService: ConnectivityService;
    let offlineService: OfflineService;

    beforeEach(() => {
      connectivityService = new ConnectivityService();
      offlineService = new OfflineService();
    });

    it('should detect connectivity status changes and log outages', () => {
      expect(connectivityService.getStatus()).toBe(ConnectivityStatus.ONLINE);

      connectivityService.setStatus(ConnectivityStatus.OFFLINE);
      expect(connectivityService.getStatus()).toBe(ConnectivityStatus.OFFLINE);

      const history = connectivityService.getConnectivityHistory();
      expect(history.totalOutagesCount).toBe(1);
    });

    it('should queue write operations during offline mode without losing user actions', () => {
      const req1 = OfflineRequest.create('/api/v1/orders/101/bump', 'POST');
      const req2 = OfflineRequest.create('/api/v1/tables/5/settle', 'POST');

      offlineService.queueOperation(req1);
      offlineService.queueOperation(req2);

      const queued = offlineService.getQueuedOperations();
      expect(queued.length).toBe(2);

      const readModel = offlineService.getOfflineOperations();
      expect(readModel.totalQueuedOperations).toBe(2);
    });
  });

  describe('SyncService & Authenticated Gate', () => {
    let offlineService: OfflineService;
    let syncService: SyncService;

    beforeEach(() => {
      offlineService = new OfflineService();
      syncService = new SyncService(offlineService);
    });

    it('should block sync execution if user is unauthenticated', async () => {
      offlineService.queueOperation(OfflineRequest.create('/api/v1/orders', 'POST'));

      await expect(syncService.syncPendingOperations(false)).rejects.toThrow('Sync aborted');
    });

    it('should flush queued operations when background sync runs in authenticated mode', async () => {
      offlineService.queueOperation(OfflineRequest.create('/api/v1/orders', 'POST'));
      offlineService.queueOperation(OfflineRequest.create('/api/v1/kds/clear', 'POST'));

      const result = await syncService.syncPendingOperations(true);
      expect(result.totalSynced).toBe(2);

      expect(offlineService.getQueuedOperations().length).toBe(0);
      const history = syncService.getSyncHistory();
      expect(history.totalSyncedOperationsCount).toBe(2);
    });
  });

  describe('ConflictService & CacheService', () => {
    let conflictService: ConflictService;
    let cacheService: CacheService;

    beforeEach(() => {
      conflictService = new ConflictService();
      cacheService = new CacheService();
    });

    it('should resolve conflicts using ClientWins, ServerWins, and MergePolicy strategies', () => {
      const clientObj = { price: 25.0, status: 'SERVED' };
      const serverObj = { price: 20.0, status: 'PREPARING' };

      const resClient = conflictService.resolveConflict('op-1', 'ClientWins', clientObj, serverObj);
      expect((resClient.resolvedData as typeof clientObj).price).toBe(25.0);

      const resMerge = conflictService.resolveConflict('op-2', 'MergePolicy', { status: 'SERVED' }, { price: 20.0 });
      expect((resMerge.resolvedData as { price: number; status: string }).price).toBe(20.0);
      expect((resMerge.resolvedData as { price: number; status: string }).status).toBe('SERVED');
    });

    it('should store items in Service Worker Cache and query statistics', () => {
      cacheService.put('menu-catalog', [{ id: 1, name: 'Truffle Burger' }]);

      const cached = cacheService.get<Array<{ name: string }>>('menu-catalog');
      expect(cached?.[0].name).toBe('Truffle Burger');

      const stats = cacheService.getCacheStatistics();
      expect(stats.totalCacheEntries).toBe(1);
    });
  });

  describe('EnterprisePwaOfflinePlatformService & Read Models', () => {
    let connectivityService: ConnectivityService;
    let offlineService: OfflineService;
    let cacheService: CacheService;
    let syncService: SyncService;
    let conflictService: ConflictService;
    let pwaService: PwaService;
    let platformService: EnterprisePwaOfflinePlatformService;

    beforeEach(() => {
      connectivityService = new ConnectivityService();
      offlineService = new OfflineService();
      cacheService = new CacheService();
      syncService = new SyncService(offlineService);
      conflictService = new ConflictService();
      pwaService = new PwaService();

      platformService = new EnterprisePwaOfflinePlatformService(
        connectivityService,
        offlineService,
        cacheService,
        syncService,
        conflictService,
        pwaService
      );
    });

    it('should query PWA status and active manifest metadata', () => {
      const status = pwaService.getPwaStatus();
      expect(status.isServiceWorkerRegistered).toBe(true);
      expect(status.isPwaInstallable).toBe(true);
      expect(status.activeManifestName).toContain('Restaurant PWA');
    });
  });
});
