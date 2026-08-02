/**
 * Enterprise Inventory Control Platform - Value Objects
 *
 * Immutable Value Objects encapsulating count IDs, session IDs, count lines, variances, waste records,
 * adjustment reasons, adjustment references, approval decisions, and variance thresholds.
 */

/**
 * Identifiers & Sessions: InventoryCountId, CountSessionId, AdjustmentReference
 */
export class InventoryCountId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): InventoryCountId {
    return new InventoryCountId(id || `cnt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class CountSessionId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): CountSessionId {
    return new CountSessionId(id || `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class AdjustmentReference {
  public readonly ref: string;

  private constructor(ref: string) {
    this.ref = ref;
  }

  public static create(ref?: string): AdjustmentReference {
    return new AdjustmentReference(ref || `ADJ-${Math.floor(100000 + Math.random() * 900000)}`);
  }
}

/**
 * Quantities & Variances: CountVariance, VarianceThreshold, AdjustmentReason, ApprovalDecision
 */
export class CountVariance {
  public readonly expectedQty: number;
  public readonly actualQty: number;
  public readonly varianceQty: number;

  private constructor(expectedQty: number, actualQty: number) {
    this.expectedQty = expectedQty;
    this.actualQty = actualQty;
    this.varianceQty = actualQty - expectedQty;
  }

  public static create(expectedQty: number, actualQty: number): CountVariance {
    return new CountVariance(expectedQty, actualQty);
  }
}

export class VarianceThreshold {
  public readonly maxAllowedPercentage: number; // e.g. 5%
  public readonly maxAllowedQuantity: number;

  private constructor(maxAllowedPercentage: number, maxAllowedQuantity: number) {
    this.maxAllowedPercentage = maxAllowedPercentage;
    this.maxAllowedQuantity = maxAllowedQuantity;
  }

  public static create(maxAllowedPercentage: number = 5.0, maxAllowedQuantity: number = 10): VarianceThreshold {
    return new VarianceThreshold(maxAllowedPercentage, maxAllowedQuantity);
  }

  public isThresholdBreached(varianceQty: number, expectedQty: number): boolean {
    const absVariance = Math.abs(varianceQty);
    if (absVariance > this.maxAllowedQuantity) return true;

    const percent = expectedQty > 0 ? (absVariance / expectedQty) * 100 : 0;
    return percent > this.maxAllowedPercentage;
  }
}

export class AdjustmentReason {
  public readonly category: 'SPOILAGE' | 'EXPIRED' | 'DAMAGED' | 'PREP_WASTE' | 'PRODUCTION_WASTE' | 'SHRINKAGE' | 'THEFT' | 'COUNT_CORRECTION';
  public readonly note: string;

  private constructor(category: 'SPOILAGE' | 'EXPIRED' | 'DAMAGED' | 'PREP_WASTE' | 'PRODUCTION_WASTE' | 'SHRINKAGE' | 'THEFT' | 'COUNT_CORRECTION', note: string) {
    this.category = category;
    this.note = note;
  }

  public static create(
    category: 'SPOILAGE' | 'EXPIRED' | 'DAMAGED' | 'PREP_WASTE' | 'PRODUCTION_WASTE' | 'SHRINKAGE' | 'THEFT' | 'COUNT_CORRECTION' = 'COUNT_CORRECTION',
    note: string = 'Stock audit adjustment'
  ): AdjustmentReason {
    return new AdjustmentReason(category, note);
  }
}

export class ApprovalDecision {
  public readonly isApproved: boolean;
  public readonly decidedBy: string;
  public readonly remark: string;

  private constructor(isApproved: boolean, decidedBy: string, remark: string) {
    this.isApproved = isApproved;
    this.decidedBy = decidedBy;
    this.remark = remark;
  }

  public static create(isApproved: boolean, decidedBy: string = 'Inventory Manager', remark: string = 'Approved stock audit'): ApprovalDecision {
    return new ApprovalDecision(isApproved, decidedBy, remark);
  }
}

/**
 * Complex Objects: CountLine, WasteRecord
 */
export class CountLine {
  public readonly lineId: string;
  public readonly stockItemId: string;
  public readonly itemName: string;
  public readonly systemExpectedQty?: number; // Omitted in Blind Count mode!
  public readonly actualCountedQty: number;

  private constructor(lineId: string, stockItemId: string, itemName: string, actualCountedQty: number, systemExpectedQty?: number) {
    this.lineId = lineId;
    this.stockItemId = stockItemId;
    this.itemName = itemName;
    this.actualCountedQty = actualCountedQty;
    this.systemExpectedQty = systemExpectedQty;
  }

  public static create(stockItemId: string, itemName: string, actualCountedQty: number, systemExpectedQty?: number, isBlindCount: boolean = false): CountLine {
    const lineId = `cline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    return new CountLine(lineId, stockItemId, itemName, actualCountedQty, isBlindCount ? undefined : systemExpectedQty);
  }
}

export class WasteRecord {
  public readonly wasteId: string;
  public readonly warehouseId: string;
  public readonly stockItemId: string;
  public readonly wasteQty: number;
  public readonly reason: AdjustmentReason;
  public readonly recordedAt: Date;

  private constructor(wasteId: string, warehouseId: string, stockItemId: string, wasteQty: number, reason: AdjustmentReason) {
    this.wasteId = wasteId;
    this.warehouseId = warehouseId;
    this.stockItemId = stockItemId;
    this.wasteQty = wasteQty;
    this.reason = reason;
    this.recordedAt = new Date();
  }

  public static create(warehouseId: string, stockItemId: string, wasteQty: number, reason: AdjustmentReason): WasteRecord {
    const wasteId = `wst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    return new WasteRecord(wasteId, warehouseId, stockItemId, wasteQty, reason);
  }
}
