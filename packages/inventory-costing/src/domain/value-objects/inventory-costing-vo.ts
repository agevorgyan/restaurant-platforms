/**
 * Enterprise Inventory Valuation & Costing Platform - Value Objects
 *
 * Immutable Value Objects encapsulating cost layer IDs, immutable cost layers, unit costs, extended costs,
 * landed costs, average costs, standard costs, inventory values, cost allocations, and cost snapshots.
 */

import { CostStatus } from '../enums/inventory-costing.enums';

/**
 * Identifiers & Costs: CostLayerId, UnitCost, ExtendedCost, LandedCost, AverageCost, StandardCost, InventoryValue
 */
export class CostLayerId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): CostLayerId {
    return new CostLayerId(id || `clayer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class UnitCost {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, Math.round(amount * 10000) / 10000);
  }

  public static create(amount: number): UnitCost {
    return new UnitCost(amount);
  }
}

export class ExtendedCost {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, Math.round(amount * 100) / 100);
  }

  public static create(quantity: number, unitCost: number): ExtendedCost {
    return new ExtendedCost(quantity * unitCost);
  }
}

export class LandedCost {
  public readonly freightDutyAmount: number;

  private constructor(freightDutyAmount: number) {
    this.freightDutyAmount = Math.max(0, Math.round(freightDutyAmount * 100) / 100);
  }

  public static create(freightDutyAmount: number): LandedCost {
    return new LandedCost(freightDutyAmount);
  }
}

export class AverageCost {
  public readonly unitPrice: number;

  private constructor(unitPrice: number) {
    this.unitPrice = Math.max(0, Math.round(unitPrice * 10000) / 10000);
  }

  public static create(totalValue: number, totalQuantity: number): AverageCost {
    const price = totalQuantity > 0 ? totalValue / totalQuantity : 0;
    return new AverageCost(price);
  }
}

export class StandardCost {
  public readonly targetPrice: number;

  private constructor(targetPrice: number) {
    this.targetPrice = Math.max(0, Math.round(targetPrice * 100) / 100);
  }

  public static create(targetPrice: number): StandardCost {
    return new StandardCost(targetPrice);
  }
}

export class InventoryValue {
  public readonly assetValue: number;

  private constructor(assetValue: number) {
    this.assetValue = Math.max(0, Math.round(assetValue * 100) / 100);
  }

  public static create(assetValue: number): InventoryValue {
    return new InventoryValue(assetValue);
  }
}

/**
 * Complex Cost Objects: CostLayer, CostAllocation, CostSnapshot
 */
export class CostLayer {
  public readonly layerId: CostLayerId;
  public readonly stockItemId: string;
  public readonly initialQuantity: number;
  public readonly remainingQuantity: number;
  public readonly unitCost: UnitCost;
  public readonly landedCost: LandedCost;
  public readonly createdAt: Date;
  public readonly status: CostStatus;

  private constructor(
    layerId: CostLayerId,
    stockItemId: string,
    initialQuantity: number,
    remainingQuantity: number,
    unitCost: UnitCost,
    landedCost: LandedCost,
    status: CostStatus
  ) {
    this.layerId = layerId;
    this.stockItemId = stockItemId;
    this.initialQuantity = initialQuantity;
    this.remainingQuantity = remainingQuantity;
    this.unitCost = unitCost;
    this.landedCost = landedCost;
    this.createdAt = new Date();
    this.status = status;
  }

  public static create(stockItemId: string, quantity: number, unitCostAmount: number, landedCostAmount: number = 0): CostLayer {
    return new CostLayer(
      CostLayerId.create(),
      stockItemId,
      quantity,
      quantity,
      UnitCost.create(unitCostAmount),
      LandedCost.create(landedCostAmount),
      CostStatus.CALCULATED
    );
  }

  public consumeQuantity(consumedQty: number): CostLayer {
    const newRemaining = Math.max(0, this.remainingQuantity - consumedQty);
    return new CostLayer(
      this.layerId,
      this.stockItemId,
      this.initialQuantity,
      newRemaining,
      this.unitCost,
      this.landedCost,
      newRemaining === 0 ? CostStatus.ARCHIVED : this.status
    );
  }

  public withLandedCost(allocatedLanded: number): CostLayer {
    const totalUnitLanded = allocatedLanded / (this.initialQuantity || 1);
    const newUnitCost = UnitCost.create(this.unitCost.amount + totalUnitLanded);
    return new CostLayer(
      this.layerId,
      this.stockItemId,
      this.initialQuantity,
      this.remainingQuantity,
      newUnitCost,
      LandedCost.create(this.landedCost.freightDutyAmount + allocatedLanded),
      this.status
    );
  }
}

export class CostAllocation {
  public readonly layerId: string;
  public readonly allocatedAmount: number;
  public readonly basis: 'QUANTITY' | 'VALUE';

  private constructor(layerId: string, allocatedAmount: number, basis: 'QUANTITY' | 'VALUE') {
    this.layerId = layerId;
    this.allocatedAmount = Math.round(allocatedAmount * 100) / 100;
    this.basis = basis;
  }

  public static create(layerId: string, allocatedAmount: number, basis: 'QUANTITY' | 'VALUE' = 'QUANTITY'): CostAllocation {
    return new CostAllocation(layerId, allocatedAmount, basis);
  }
}

export class CostSnapshot {
  public readonly snapshotId: string;
  public readonly stockItemId: string;
  public readonly totalAssetValue: number;
  public readonly totalQuantity: number;
  public readonly averageUnitCost: number;
  public readonly capturedAt: Date;

  private constructor(stockItemId: string, totalAssetValue: number, totalQuantity: number, averageUnitCost: number) {
    this.snapshotId = `csnap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.stockItemId = stockItemId;
    this.totalAssetValue = totalAssetValue;
    this.totalQuantity = totalQuantity;
    this.averageUnitCost = averageUnitCost;
    this.capturedAt = new Date();
  }

  public static create(stockItemId: string, totalAssetValue: number, totalQuantity: number): CostSnapshot {
    const avg = totalQuantity > 0 ? totalAssetValue / totalQuantity : 0;
    return new CostSnapshot(stockItemId, totalAssetValue, totalQuantity, avg);
  }
}
