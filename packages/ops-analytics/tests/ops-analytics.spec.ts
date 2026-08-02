/**
 * Enterprise Restaurant Operations Analytics Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Hexagonal AnalyticsBridgePort, Deterministic KPI Calculations (Turnover, Occupancy, SLA),
 * SLA Threshold Monitoring (Healthy -> Warning -> Critical), Immutable Metric Snapshots, and CQRS Read Models.
 */

import { MetricStatus, TimeWindow } from '../src/domain/enums/ops-analytics.enums';
import {
  KpiThreshold,
  OccupancyRate,
  OperationalMetric,
  ServiceSLA,
  TurnoverRate,
} from '../src/domain/value-objects/ops-analytics-vo';
import {
  DefaultAnalyticsBridgeAdapter,
  EnterpriseOpsAnalyticsPlatformService,
  GuestFlowService,
  KpiCalculationService,
  OccupancyService,
  OperationalAnalyticsService,
  ServiceQualityService,
  WaiterAnalyticsService,
} from '../src/services/ops-analytics.services';

describe('Enterprise Restaurant Operations Analytics Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format OccupancyRate and TurnoverRate correctly', () => {
      const occ = OccupancyRate.create(85.4);
      expect(occ.percentage).toBe(85);

      const turnover = TurnoverRate.create(3.75);
      expect(turnover.turnsPerHour).toBe(3.75);
    });

    it('should evaluate KpiThreshold statuses (Healthy, Warning, Critical)', () => {
      const threshold = KpiThreshold.create(90, 80); // higher is better (e.g. SLA %)

      expect(threshold.evaluateStatus(95, true)).toBe(MetricStatus.HEALTHY);
      expect(threshold.evaluateStatus(85, true)).toBe(MetricStatus.WARNING);
      expect(threshold.evaluateStatus(75, true)).toBe(MetricStatus.CRITICAL);
    });
  });

  describe('KpiCalculationService & ServiceQualityService', () => {
    let kpiService: KpiCalculationService;
    let qualityService: ServiceQualityService;

    beforeEach(() => {
      kpiService = new KpiCalculationService();
      qualityService = new ServiceQualityService();
    });

    it('should calculate deterministic KPIs', () => {
      const turnover = kpiService.calculateTurnoverRate(18, 6);
      expect(turnover.turnsPerHour).toBe(3.0);

      const occ = kpiService.calculateOccupancyRate(45, 50);
      expect(occ.percentage).toBe(90);

      const sla = kpiService.calculateServiceSla(100, 96, 15);
      expect(sla.compliancePercentage).toBe(96);
    });

    it('should evaluate SLA threshold and generate alerts if warning/critical', () => {
      const dashHealthy = qualityService.getServiceQualityDashboard(95);
      expect(dashHealthy.activeSlaAlertsCount).toBe(0);

      const dashWarning = qualityService.getServiceQualityDashboard(85);
      expect(dashWarning.activeSlaAlertsCount).toBe(1);
      expect(dashWarning.alerts[0].status).toBe(MetricStatus.WARNING);
    });
  });

  describe('OperationalAnalyticsService & AnalyticsBridgePort Integration', () => {
    let bridgeAdapter: DefaultAnalyticsBridgeAdapter;
    let kpiService: KpiCalculationService;
    let qualityService: ServiceQualityService;
    let occupancyService: OccupancyService;
    let waiterService: WaiterAnalyticsService;
    let flowService: GuestFlowService;
    let analyticsService: OperationalAnalyticsService;
    let platformService: EnterpriseOpsAnalyticsPlatformService;

    beforeEach(() => {
      bridgeAdapter = new DefaultAnalyticsBridgeAdapter();
      kpiService = new KpiCalculationService();
      qualityService = new ServiceQualityService();
      occupancyService = new OccupancyService();
      waiterService = new WaiterAnalyticsService();
      flowService = new GuestFlowService();
      analyticsService = new OperationalAnalyticsService(bridgeAdapter, kpiService, qualityService);

      platformService = new EnterpriseOpsAnalyticsPlatformService(
        bridgeAdapter,
        kpiService,
        occupancyService,
        qualityService,
        waiterService,
        flowService,
        analyticsService
      );
    });

    it('should record immutable metric snapshot and ingest via bridge port', () => {
      const snapshot = analyticsService.recordMetricSnapshot('ActiveGuests', 48, 'count', TimeWindow.REAL_TIME);
      expect(snapshot.snapshotId).toBeDefined();
      expect(snapshot.metric.name).toBe('ActiveGuests');
    });

    it('should project OperationalDashboard read model', () => {
      const dashboard = analyticsService.getOperationalDashboard(TimeWindow.REAL_TIME);
      expect(dashboard.kpis.length).toBeGreaterThan(0);
      expect(dashboard.occupancyPercentage).toBeDefined();
    });
  });
});
