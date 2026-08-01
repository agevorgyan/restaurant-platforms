/**
 * Enterprise KPI Platform - Comprehensive Test Suite
 *
 * Tests Deterministic Formula Parsing/Evaluation, Threshold Status Monitoring,
 * Weighted Hierarchical Scorecards, Append-Only Historical KpiSnapshots, and KPI Services.
 */

import { KpiFormula, KpiThreshold, KpiScore } from './domain/value-objects/kpi-vo';
import { KpiType, KpiStatus, ThresholdStatus } from './domain/enums/kpi.enums';
import { KpiDefinitionAggregate } from './domain/models/kpi-definition.aggregate';
import { InMemoryKpiRepository } from './infrastructure/repositories/in-memory-kpi.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  FormulaService,
  ScorecardService,
  EnterpriseKpiPlatformService,
} from './application/services/kpi-platform.services';

describe('Enterprise KPI Platform', () => {
  describe('Value Objects & Formula Evaluation Engine', () => {
    it('should evaluate deterministic arithmetic KPI formulas', () => {
      const formula = KpiFormula.create('(revenue - cogs) / revenue * 100');
      const margin = formula.evaluate({ revenue: 10000, cogs: 4000 });
      expect(margin).toBe(60.0);
    });

    it('should evaluate threshold status correctly', () => {
      const threshold = KpiThreshold.create(90.0, 80.0, 65.0);

      expect(threshold.evaluateStatus(95.0)).toBe(ThresholdStatus.EXCELLENT);
      expect(threshold.evaluateStatus(85.0)).toBe(ThresholdStatus.GOOD);
      expect(threshold.evaluateStatus(70.0)).toBe(ThresholdStatus.WARNING);
      expect(threshold.evaluateStatus(50.0)).toBe(ThresholdStatus.CRITICAL);
    });
  });

  describe('KpiDefinitionAggregate Root & Snapshots', () => {
    it('should calculate KPI value, transition threshold status, and record append-only snapshot', () => {
      const kpi = KpiDefinitionAggregate.create({
        name: 'Gross Profit Margin',
        description: 'Gross profit percentage of sales',
        kpiType: KpiType.FINANCIAL_KPI,
        formula: '(revenue - cogs) / revenue * 100',
        targetValue: 65.0,
        excellentMin: 65.0,
        goodMin: 55.0,
        warningMin: 45.0,
      });

      expect(kpi.getStatus()).toBe(KpiStatus.DRAFT);
      kpi.activate();
      expect(kpi.getStatus()).toBe(KpiStatus.ACTIVE);

      // Calculation 1 (Good status)
      const score1 = kpi.calculate({ revenue: 1000, cogs: 420 }); // 58%
      expect(score1.calculatedValue).toBe(58.0);
      expect(score1.status).toBe(ThresholdStatus.GOOD);
      expect(kpi.getSnapshots().length).toBe(1);

      // Calculation 2 (Excellent status -> Triggers ThresholdCrossedEvent & TargetExceededEvent)
      const score2 = kpi.calculate({ revenue: 1000, cogs: 300 }); // 70%
      expect(score2.calculatedValue).toBe(70.0);
      expect(score2.status).toBe(ThresholdStatus.EXCELLENT);
      expect(kpi.getSnapshots().length).toBe(2);
    });
  });

  describe('KPI Platform Services & Weighted Scorecards', () => {
    let repo: InMemoryKpiRepository;
    let publisherAdapter: NestEventPublisherAdapter;
    let formulaService: FormulaService;
    let scorecardService: ScorecardService;
    let kpiPlatformService: EnterpriseKpiPlatformService;

    beforeEach(() => {
      repo = new InMemoryKpiRepository();
      publisherAdapter = new NestEventPublisherAdapter();
      formulaService = new FormulaService();
      scorecardService = new ScorecardService();

      kpiPlatformService = new EnterpriseKpiPlatformService(
        repo,
        publisherAdapter,
        formulaService,
        scorecardService
      );
    });

    it('should create KPI, evaluate formula, query scorecards, and historical snapshots', async () => {
      // 1. Create KPI Definitions for Kitchen Department
      const kpi1 = await kpiPlatformService.createKpi('tenant-kpi-1', {
        name: 'Order Fulfillment Speed',
        description: 'Average kitchen ticket preparation duration in minutes',
        kpiType: KpiType.OPERATIONAL_KPI,
        formula: 'total_minutes / total_tickets',
        targetValue: 12.0, // Target 12 minutes
        department: 'Kitchen',
        weight: 0.6,
      });

      const kpi2 = await kpiPlatformService.createKpi('tenant-kpi-1', {
        name: 'Food Waste Percentage',
        description: 'Percentage of raw ingredient waste',
        kpiType: KpiType.INVENTORY_KPI,
        formula: 'wasted_cost / total_cost * 100',
        targetValue: 3.0,
        department: 'Kitchen',
        weight: 0.4,
      });

      // 2. Perform Calculation on KPI 1
      const calcResult = await kpiPlatformService.calculateKpi(kpi1.id, {
        variables: { total_minutes: 110, total_tickets: 10 }, // 11 minutes
      });

      expect(calcResult.lastCalculatedValue).toBe(11.0);
      expect(calcResult.snapshotsCount).toBe(1);

      // 3. Query Scorecards Read Model
      const scorecards = await kpiPlatformService.getKpiScorecards('tenant-kpi-1');
      expect(scorecards.departments.length).toBe(1);
      expect(scorecards.departments[0].department).toBe('Kitchen');
      expect(scorecards.departments[0].kpisCount).toBe(2);

      // 4. Query Historical Snapshots Read Model
      const snapshots = await kpiPlatformService.getKpiSnapshots('tenant-kpi-1');
      expect(snapshots.totalSnapshots).toBe(1);

      // 5. Query KPI Statistics
      const stats = await kpiPlatformService.getKpiStatistics();
      expect(stats.totalKpis).toBe(2);
    });
  });
});
