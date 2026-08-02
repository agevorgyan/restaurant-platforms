/**
 * Enterprise Inventory Analytics Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Deterministic KPI Calculations (Turnover, Days On Hand, Fill Rate, Stock Accuracy, Waste Rate),
 * InventoryAnalyticsBridgePort Ingestion, Replenishment Intelligence, SLA Thresholds, and CQRS Read Models.
 */

import { AnalyticsWindow, MetricStatus } from '../src/domain/enums/inventory-analytics.enums';
import {
  DaysOnHand,
  FillRate,
  InventoryMetric,
  InventoryTurnover,
  KpiThreshold,
  StockAccuracy,
  WasteRate,
} from '../src/domain/value-objects/inventory-analytics-vo';
import {
  DefaultInventoryAnalyticsBridgeAdapter,
  EnterpriseInventoryAnalyticsPlatformService,
  InventoryAnalyticsService,
  KpiCalculationService,
  ReplenishmentAnalyticsService,
  SupplierAnalyticsService,
  WarehouseAnalyticsService,
  WasteAnalyticsService,
} from '../src/services/inventory-analytics.services';

describe('Enterprise Inventory Analytics Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format InventoryMetric, InventoryTurnover, and DaysOnHand correctly', () => {
      const metric = InventoryMetric.create('Stock Accuracy', 98.5, '%');
      expect(metric.value).toBe(98.5);

      // COGS = $100,000, Avg Inventory = $20,000 -> 5.0 turns
      const turnover = InventoryTurnover.create(100000, 20000);
      expect(turnover.ratio).toBe(5.0);

      // Days On Hand = 365 / 5 = 73 days
      const doh = DaysOnHand.create(turnover.ratio);
      expect(doh.days).toBe(73);
    });

    it('should evaluate KpiThreshold statuses (Healthy, Warning, Critical)', () => {
      const threshold = KpiThreshold.create(90.0, 80.0); // Warning < 90%, Critical < 80%

      expect(threshold.evaluateStatus(95.0)).toBe(MetricStatus.HEALTHY);
      expect(threshold.evaluateStatus(85.0)).toBe(MetricStatus.WARNING);
      expect(threshold.evaluateStatus(75.0)).toBe(MetricStatus.CRITICAL);
    });
  });

  describe('KpiCalculationService', () => {
    let kpiService: KpiCalculationService;

    beforeEach(() => {
      kpiService = new KpiCalculationService();
    });

    it('should calculate deterministic inventory KPIs accurately', () => {
      const fillRate = kpiService.calculateFillRate(95, 100);
      expect(fillRate.percentage).toBe(95);

      const accuracy = kpiService.calculateStockAccuracy(48, 50); // 48/50 = 96%
      expect(accuracy.percentage).toBe(96);

      const wasteRate = kpiService.calculateWasteRate(2000, 100000); // 2000/100000 = 2.0%
      expect(wasteRate.percentage).toBe(2.0);
    });
  });

  describe('InventoryAnalyticsService & Bridge Port Integration', () => {
    let bridgeAdapter: DefaultInventoryAnalyticsBridgeAdapter;
    let kpiService: KpiCalculationService;
    let analyticsService: InventoryAnalyticsService;

    beforeEach(() => {
      bridgeAdapter = new DefaultInventoryAnalyticsBridgeAdapter();
      kpiService = new KpiCalculationService();
      analyticsService = new InventoryAnalyticsService(bridgeAdapter, kpiService);
    });

    it('should record metric snapshot and ingest via bridge port', async () => {
      const snapshot = analyticsService.recordInventorySnapshot('Turnover Ratio', 4.8, 'turns/yr', AnalyticsWindow.REAL_TIME);
      expect(snapshot.snapshotId).toBeDefined();

      const dashboard = analyticsService.getInventoryDashboard();
      expect(dashboard.inventoryTurnoverRatio).toBe(4.8);
      expect(dashboard.kpis.length).toBe(4);
    });
  });

  describe('ReplenishmentAnalyticsService Intelligence', () => {
    let replenishmentService: ReplenishmentAnalyticsService;

    beforeEach(() => {
      replenishmentService = new ReplenishmentAnalyticsService();
    });

    it('should project ReplenishmentDashboard read model with reorder recommendations', () => {
      const dashboard = replenishmentService.getReplenishmentDashboard();
      expect(dashboard.totalItemsNeedingReplenishment).toBe(2);
      expect(dashboard.recommendations[0].urgency).toBe('HIGH');
    });
  });

  describe('EnterpriseInventoryAnalyticsPlatformService Façade Integration', () => {
    let bridgeAdapter: DefaultInventoryAnalyticsBridgeAdapter;
    let kpiService: KpiCalculationService;
    let supplierService: SupplierAnalyticsService;
    let warehouseService: WarehouseAnalyticsService;
    let wasteService: WasteAnalyticsService;
    let replenishmentService: ReplenishmentAnalyticsService;
    let analyticsService: InventoryAnalyticsService;
    let platformService: EnterpriseInventoryAnalyticsPlatformService;

    beforeEach(() => {
      bridgeAdapter = new DefaultInventoryAnalyticsBridgeAdapter();
      kpiService = new KpiCalculationService();
      supplierService = new SupplierAnalyticsService();
      warehouseService = new WarehouseAnalyticsService();
      wasteService = new WasteAnalyticsService();
      replenishmentService = new ReplenishmentAnalyticsService();
      analyticsService = new InventoryAnalyticsService(bridgeAdapter, kpiService);

      platformService = new EnterpriseInventoryAnalyticsPlatformService(
        bridgeAdapter,
        kpiService,
        supplierService,
        warehouseService,
        wasteService,
        replenishmentService,
        analyticsService
      );
    });

    it('should query SupplierDashboard via platform facade', () => {
      const dashboard = platformService.supplierService.getSupplierDashboard();
      expect(dashboard.totalSuppliersCount).toBe(14);
      expect(dashboard.averageSupplierRating).toBe(4.7);
    });
  });
});
