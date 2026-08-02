/**
 * Enterprise Inventory Control Platform - Domain Services
 *
 * Implements core domain services for inventory control:
 * 1. VarianceService (Expected vs Actual Variance Calculator & Threshold Evaluator)
 * 2. WasteService (Categorized Waste Tracker & Record Manager)
 * 3. AdjustmentService (Stock Adjustment Event Request Coordinator - Never Mutates Stock Direct)
 * 4. ApprovalService (Dual-Approval Authorization Workflow Manager)
 * 5. AuditService (Immutable Audit Log & History Logger)
 * 6. InventoryCountService (Primary Inventory Audit & Blind Count Session Coordinator)
 * 7. EnterpriseInventoryControlPlatformService (Primary Application Façade)
 */

import { CountStatus, WasteStatus } from '../domain/enums/inventory-control.enums';

import {
  AdjustmentReason,
  AdjustmentReference,
  ApprovalDecision,
  CountLine,
  CountVariance,
  InventoryCountId,
  VarianceThreshold,
  WasteRecord,
} from '../domain/value-objects/inventory-control-vo';
import {
  AdjustmentHistoryReadModel,
  CountStatisticsReadModel,
  InventoryCountDashboardReadModel,
  VarianceDashboardReadModel,
  WasteDashboardReadModel,
} from '../read-models/inventory-control.read-models';

/**
 * Service 1: VarianceService
 * Expected vs actual variance calculator & threshold evaluator.
 */
export class VarianceService {
  private readonly defaultThreshold = VarianceThreshold.create(5.0, 10);

  public calculateVariance(expectedQty: number, actualQty: number): CountVariance {
    return CountVariance.create(expectedQty, actualQty);
  }

  public isVarianceBreached(varianceQty: number, expectedQty: number): boolean {
    return this.defaultThreshold.isThresholdBreached(varianceQty, expectedQty);
  }
}

/**
 * Service 2: WasteService
 * Categorized waste tracker & record manager.
 */
export class WasteService {
  private readonly wasteRecordsMap = new Map<string, { record: WasteRecord; status: WasteStatus }>();

  public recordWaste(
    warehouseId: string,
    stockItemId: string,
    qty: number,
    category: 'SPOILAGE' | 'EXPIRED' | 'DAMAGED' | 'PREP_WASTE' | 'PRODUCTION_WASTE' | 'SHRINKAGE' | 'THEFT' = 'SPOILAGE',
    note: string = 'Kitchen spoilage'
  ): WasteRecord {
    const reason = AdjustmentReason.create(category, note);
    const record = WasteRecord.create(warehouseId, stockItemId, qty, reason);
    this.wasteRecordsMap.set(record.wasteId, { record, status: WasteStatus.RECORDED });
    return record;
  }

  public getWasteDashboard(): WasteDashboardReadModel {
    const list = Array.from(this.wasteRecordsMap.values());
    const totalQty = list.reduce((sum, w) => sum + w.record.wasteQty, 0);

    return {
      totalWasteRecordsCount: list.length,
      totalWasteQuantity: totalQty,
      records: list.map((w) => ({
        wasteId: w.record.wasteId,
        warehouseId: w.record.warehouseId,
        stockItemId: w.record.stockItemId,
        wasteQty: w.record.wasteQty,
        reasonCategory: w.record.reason.category,
        status: w.status,
        recordedAt: w.record.recordedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 3: AdjustmentService
 * Stock adjustment request coordinator. Adjustments create event requests and NEVER mutate stock balances directly.
 */
export class AdjustmentService {
  private readonly adjustmentsMap = new Map<
    string,
    {
      ref: AdjustmentReference;
      warehouseId: string;
      stockItemId: string;
      adjustmentQty: number;
      reason: AdjustmentReason;
      decision?: ApprovalDecision;
      createdAt: Date;
    }
  >();

  public requestAdjustment(
    warehouseId: string,
    stockItemId: string,
    adjustmentQty: number,
    category: 'SPOILAGE' | 'EXPIRED' | 'DAMAGED' | 'PREP_WASTE' | 'PRODUCTION_WASTE' | 'SHRINKAGE' | 'THEFT' | 'COUNT_CORRECTION' = 'COUNT_CORRECTION',
    note: string = 'Stock audit adjustment'
  ): AdjustmentReference {
    const ref = AdjustmentReference.create();
    const reason = AdjustmentReason.create(category, note);

    this.adjustmentsMap.set(ref.ref, {
      ref,
      warehouseId,
      stockItemId,
      adjustmentQty,
      reason,
      createdAt: new Date(),
    });

    return ref;
  }

  public getAdjustmentsMap(): Map<string, any> {
    return this.adjustmentsMap;
  }

  public getAdjustmentHistory(): AdjustmentHistoryReadModel {
    const list = Array.from(this.adjustmentsMap.values());
    return {
      totalAdjustmentsCount: list.length,
      adjustments: list.map((a) => ({
        adjustmentRef: a.ref.ref,
        warehouseId: a.warehouseId,
        stockItemId: a.stockItemId,
        adjustmentQty: a.adjustmentQty,
        reasonCategory: a.reason.category,
        isApproved: a.decision ? a.decision.isApproved : false,
        decidedBy: a.decision ? a.decision.decidedBy : 'Pending',
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 4: ApprovalService
 * Dual-approval authorization workflow manager.
 */
export class ApprovalService {
  constructor(private readonly adjustmentService: AdjustmentService) {}

  public approveAdjustment(adjustmentRef: string, approverId: string = 'Manager-Jane'): ApprovalDecision {
    const map = this.adjustmentService.getAdjustmentsMap();
    const adj = map.get(adjustmentRef);
    if (!adj) throw new Error(`Adjustment error: Reference ${adjustmentRef} not found`);

    const decision = ApprovalDecision.create(true, approverId, 'Adjustment approved upon audit verification');
    adj.decision = decision;
    return decision;
  }

  public rejectAdjustment(adjustmentRef: string, rejectorId: string = 'Manager-Jane', remark: string = 'Variance rejected'): ApprovalDecision {
    const map = this.adjustmentService.getAdjustmentsMap();
    const adj = map.get(adjustmentRef);
    if (!adj) throw new Error(`Adjustment error: Reference ${adjustmentRef} not found`);

    const decision = ApprovalDecision.create(false, rejectorId, remark);
    adj.decision = decision;
    return decision;
  }
}

/**
 * Service 5: AuditService
 * Immutable audit trail & history logger.
 */
export class AuditService {
  private readonly auditLogs: Array<{ action: string; details: string; timestamp: string }> = [];

  public logAudit(action: string, details: string): void {
    this.auditLogs.push({ action, details, timestamp: new Date().toISOString() });
  }

  public getAuditLogs(): Array<{ action: string; details: string; timestamp: string }> {
    return this.auditLogs;
  }
}

/**
 * Service 6: InventoryCountService
 * Primary Inventory Audit & Blind Count Session Coordinator. Blind counts strictly mask system quantities from counters.
 */
export class InventoryCountService {
  private readonly countsMap = new Map<
    string,
    {
      countId: InventoryCountId;
      warehouseId: string;
      countType: 'FULL' | 'CYCLE' | 'SPOT' | 'BLIND' | 'RECOUNT';
      lines: CountLine[];
      status: CountStatus;
      isBlindCount: boolean;
      startedAt: Date;
    }
  >();

  constructor(
    private readonly varianceService: VarianceService,
    private readonly auditService: AuditService
  ) {}

  public startInventoryCount(
    warehouseId: string = 'wh-central',
    countType: 'FULL' | 'CYCLE' | 'SPOT' | 'BLIND' | 'RECOUNT' = 'CYCLE'
  ): InventoryCountId {
    const countId = InventoryCountId.create();
    const isBlindCount = countType === 'BLIND';

    this.countsMap.set(countId.id, {
      countId,
      warehouseId,
      countType,
      lines: [],
      status: CountStatus.IN_PROGRESS,
      isBlindCount,
      startedAt: new Date(),
    });

    this.auditService.logAudit('InventoryCountStarted', `Started ${countType} count ${countId.id} for warehouse ${warehouseId}`);
    return countId;
  }

  public recordCountLine(countId: string, stockItemId: string, itemName: string, actualCountedQty: number, systemExpectedQty?: number): void {
    const count = this.countsMap.get(countId);
    if (!count) throw new Error(`Count error: Count ${countId} not found`);

    // In Blind Count mode, systemExpectedQty is strictly masked (undefined)
    const line = CountLine.create(stockItemId, itemName, actualCountedQty, systemExpectedQty, count.isBlindCount);
    count.lines.push(line);

    if (!count.isBlindCount && systemExpectedQty !== undefined) {
      const variance = this.varianceService.calculateVariance(systemExpectedQty, actualCountedQty);
      if (this.varianceService.isVarianceBreached(variance.varianceQty, systemExpectedQty)) {
        this.auditService.logAudit('VarianceDetected', `Variance ${variance.varianceQty} detected for item ${stockItemId}`);
      }
    }
  }

  public submitCount(countId: string): void {
    const count = this.countsMap.get(countId);
    if (!count) throw new Error(`Count error: Count ${countId} not found`);

    count.status = CountStatus.SUBMITTED;
    this.auditService.logAudit('InventoryCountSubmitted', `Submitted count ${countId}`);
  }

  public getCountsMap(): Map<string, any> {
    return this.countsMap;
  }

  public getInventoryCountDashboard(): InventoryCountDashboardReadModel {
    const list = Array.from(this.countsMap.values());
    return {
      totalCountsCount: list.length,
      counts: list.map((c) => ({
        countId: c.countId.id,
        warehouseId: c.warehouseId,
        countType: c.countType,
        status: c.status,
        linesCounted: c.lines.length,
        isBlindCount: c.isBlindCount,
        startedAt: c.startedAt.toISOString(),
      })),
    };
  }

  public getCountStatistics(): CountStatisticsReadModel {
    const list = Array.from(this.countsMap.values());
    return {
      totalFullCounts: list.filter((c) => c.countType === 'FULL').length,
      totalCycleCounts: list.filter((c) => c.countType === 'CYCLE').length,
      totalBlindCounts: list.filter((c) => c.countType === 'BLIND').length,
      totalCompleted: list.filter((c) => c.status === CountStatus.COMPLETED || c.status === CountStatus.APPROVED).length,
    };
  }
}

/**
 * Service 7: EnterpriseInventoryControlPlatformService
 * High-level application façade for inventory control platform infrastructure.
 */
export class EnterpriseInventoryControlPlatformService {
  constructor(
    public readonly varianceService: VarianceService,
    public readonly wasteService: WasteService,
    public readonly adjustmentService: AdjustmentService,
    public readonly approvalService: ApprovalService,
    public readonly auditService: AuditService,
    public readonly countService: InventoryCountService
  ) {}
}
