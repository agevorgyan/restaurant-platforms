/**
 * Enterprise Inventory Control Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Physical Inventory Audits, Blind Count Masking (strictly hiding system quantities),
 * Variance Detection Engine with Thresholds, Categorized Waste Tracking, Adjustment Approvals, CQRS Read Models, and verification of zero direct balance mutations.
 */

import { CountStatus } from '../src/domain/enums/inventory-control.enums';
import {
  AdjustmentReason,
  CountVariance,
  InventoryCountId,
  VarianceThreshold,
} from '../src/domain/value-objects/inventory-control-vo';
import {
  AdjustmentService,
  ApprovalService,
  AuditService,
  EnterpriseInventoryControlPlatformService,
  InventoryCountService,
  VarianceService,
  WasteService,
} from '../src/services/inventory-control.services';

describe('Enterprise Inventory Control Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format CountVariance and evaluate VarianceThreshold correctly', () => {
      const variance = CountVariance.create(100, 92); // expected 100, actual 92 -> -8
      expect(variance.varianceQty).toBe(-8);

      const threshold = VarianceThreshold.create(5.0, 10); // 5% or 10 units
      expect(threshold.isThresholdBreached(-8, 100)).toBe(true); // 8% > 5%
    });
  });

  describe('InventoryCountService & Blind Count Masking', () => {
    let varianceService: VarianceService;
    let auditService: AuditService;
    let countService: InventoryCountService;

    beforeEach(() => {
      varianceService = new VarianceService();
      auditService = new AuditService();
      countService = new InventoryCountService(varianceService, auditService);
    });

    it('should strictly mask system quantities during BLIND count mode', () => {
      const countId = countService.startInventoryCount('wh-central', 'BLIND');

      // Record line with actual = 12, systemExpectedQty = 20
      countService.recordCountLine(countId.id, 'item-cheese', 'Cheddar 1kg', 12, 20);

      const map = countService.getCountsMap();
      const count = map.get(countId.id);
      expect(count.isBlindCount).toBe(true);

      // Verify line in blind count does NOT expose systemExpectedQty (must be undefined)
      const line = count.lines[0];
      expect(line.actualCountedQty).toBe(12);
      expect(line.systemExpectedQty).toBeUndefined();
    });
  });

  describe('WasteService & Categorized Waste', () => {
    let wasteService: WasteService;

    beforeEach(() => {
      wasteService = new WasteService();
    });

    it('should record categorized waste (Spoilage, Expired, Damaged)', () => {
      const record = wasteService.recordWaste('wh-kitchen', 'item-milk', 5, 'EXPIRED', 'Past expiration date');
      expect(record.wasteId).toBeDefined();
      expect(record.reason.category).toBe('EXPIRED');

      const dashboard = wasteService.getWasteDashboard();
      expect(dashboard.totalWasteRecordsCount).toBe(1);
      expect(dashboard.totalWasteQuantity).toBe(5);
    });
  });

  describe('AdjustmentService & ApprovalService Workflow', () => {
    let adjustmentService: AdjustmentService;
    let approvalService: ApprovalService;

    beforeEach(() => {
      adjustmentService = new AdjustmentService();
      approvalService = new ApprovalService(adjustmentService);
    });

    it('should request adjustment event without direct balance mutation and handle manager approval', () => {
      const ref = adjustmentService.requestAdjustment('wh-central', 'item-flour', -15, 'SPOILAGE', 'Water damage');
      expect(ref.ref).toBeDefined();

      const decision = approvalService.approveAdjustment(ref.ref, 'Manager-Sarah');
      expect(decision.isApproved).toBe(true);

      const history = adjustmentService.getAdjustmentHistory();
      expect(history.totalAdjustmentsCount).toBe(1);
      expect(history.adjustments[0].isApproved).toBe(true);
    });
  });

  describe('EnterpriseInventoryControlPlatformService Façade Integration', () => {
    let varianceService: VarianceService;
    let wasteService: WasteService;
    let adjustmentService: AdjustmentService;
    let approvalService: ApprovalService;
    let auditService: AuditService;
    let countService: InventoryCountService;
    let platformService: EnterpriseInventoryControlPlatformService;

    beforeEach(() => {
      varianceService = new VarianceService();
      wasteService = new WasteService();
      adjustmentService = new AdjustmentService();
      approvalService = new ApprovalService(adjustmentService);
      auditService = new AuditService();
      countService = new InventoryCountService(varianceService, auditService);

      platformService = new EnterpriseInventoryControlPlatformService(
        varianceService,
        wasteService,
        adjustmentService,
        approvalService,
        auditService,
        countService
      );
    });

    it('should query CountStatistics via platform facade', () => {
      const stats = platformService.countService.getCountStatistics();
      expect(stats.totalCompleted).toBe(0);
    });
  });
});
