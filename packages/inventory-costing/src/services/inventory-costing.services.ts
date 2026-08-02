/**
 * Enterprise Inventory Valuation & Costing Platform - Domain Services
 *
 * Implements core domain services for inventory valuation:
 * 1. CostLayerService (Immutable FIFO Cost Layer Engine - Oldest Layer Consumption)
 * 2. AverageCostService (Deterministic Weighted & Moving Average Cost Calculator)
 * 3. LandedCostService (Configurable Freight/Duty Landed Cost Allocator)
 * 4. CostAllocationService (Cost Distribution & Variance Allocator)
 * 5. CogsPreparationService (COGS Foundation Calculator)
 * 6. ValuationService (Primary Inventory Valuation Coordinator & Dashboard Projector)
 * 7. EnterpriseInventoryCostingPlatformService (Primary Application Façade)
 */

import { CostStatus, ValuationMethod } from '../domain/enums/inventory-costing.enums';

import {
  AverageCost,
  CostAllocation,
  CostLayer,
  CostSnapshot,
  ExtendedCost,
  InventoryValue,
  LandedCost,
  UnitCost,
} from '../domain/value-objects/inventory-costing-vo';
import {
  AverageCostHistoryReadModel,
  CostAllocationReportReadModel,
  CostLayerOverviewReadModel,
  InventoryValueDashboardReadModel,
  InventoryValuationReportReadModel,
} from '../read-models/inventory-costing.read-models';

/**
 * Service 1: CostLayerService
 * Immutable FIFO Cost Layer Engine - Consumes oldest available cost layers first.
 */
export class CostLayerService {
  private readonly layersMap = new Map<string, CostLayer[]>();

  public createCostLayer(stockItemId: string, quantity: number, unitCostAmount: number, landedCostAmount: number = 0): CostLayer {
    if (!this.layersMap.has(stockItemId)) {
      this.layersMap.set(stockItemId, []);
    }

    const layer = CostLayer.create(stockItemId, quantity, unitCostAmount, landedCostAmount);
    this.layersMap.get(stockItemId)!.push(layer);
    return layer;
  }

  public getActiveCostLayers(stockItemId: string): CostLayer[] {
    const list = this.layersMap.get(stockItemId) || [];
    return list.filter((l) => l.remainingQuantity > 0);
  }

  public consumeFifoLayers(stockItemId: string, quantityToConsume: number): { totalCogsValue: number; consumedLayersCount: number } {
    const layers = this.layersMap.get(stockItemId) || [];
    let remainingToConsume = quantityToConsume;
    let totalCogsValue = 0;
    let consumedLayersCount = 0;

    for (let i = 0; i < layers.length && remainingToConsume > 0; i++) {
      const layer = layers[i];
      if (layer.remainingQuantity <= 0) continue;

      const takeQty = Math.min(layer.remainingQuantity, remainingToConsume);
      const layerCogs = takeQty * layer.unitCost.amount;

      totalCogsValue += layerCogs;
      remainingToConsume -= takeQty;
      consumedLayersCount++;

      // Mutate by returning a new immutable CostLayer instance
      layers[i] = layer.consumeQuantity(takeQty);
    }

    if (remainingToConsume > 0) {
      throw new Error(`Valuation error: Insufficient inventory cost layers for item ${stockItemId}. Short by ${remainingToConsume} units`);
    }

    return {
      totalCogsValue: Math.round(totalCogsValue * 100) / 100,
      consumedLayersCount,
    };
  }

  public getLayersMap(): Map<string, CostLayer[]> {
    return this.layersMap;
  }
}

/**
 * Service 2: AverageCostService
 * Deterministic Weighted Average & Moving Average cost calculator.
 */
export class AverageCostService {
  private readonly averageCostMap = new Map<string, number>();

  public calculateWeightedAverage(stockItemId: string, totalCurrentValue: number, totalCurrentQuantity: number): AverageCost {
    const avg = AverageCost.create(totalCurrentValue, totalCurrentQuantity);
    this.averageCostMap.set(stockItemId, avg.unitPrice);
    return avg;
  }

  public getAverageCost(stockItemId: string, defaultCost: number = 10): AverageCost {
    const price = this.averageCostMap.get(stockItemId) ?? defaultCost;
    return AverageCost.create(price, 1);
  }
}

/**
 * Service 3: LandedCostService
 * Configurable Freight/Duty Landed Cost Allocator.
 */
export class LandedCostService {
  constructor(private readonly layerService: CostLayerService) {}

  public allocateLandedCost(stockItemId: string, totalLandedCostAmount: number): CostAllocation[] {
    const layers = this.layerService.getActiveCostLayers(stockItemId);
    if (layers.length === 0) return [];

    const totalQty = layers.reduce((sum, l) => sum + l.remainingQuantity, 0);
    const allocations: CostAllocation[] = [];

    const allLayersMap = this.layerService.getLayersMap();
    const itemLayers = allLayersMap.get(stockItemId) || [];

    for (let i = 0; i < itemLayers.length; i++) {
      const layer = itemLayers[i];
      if (layer.remainingQuantity <= 0) continue;

      const share = totalQty > 0 ? (layer.remainingQuantity / totalQty) * totalLandedCostAmount : 0;
      itemLayers[i] = layer.withLandedCost(share);

      allocations.push(CostAllocation.create(layer.layerId.id, share, 'QUANTITY'));
    }

    return allocations;
  }
}

/**
 * Service 4: CostAllocationService
 * Cost Distribution & Variance Allocator.
 */
export class CostAllocationService {
  public generateAllocationReport(allocations: CostAllocation[]): CostAllocationReportReadModel {
    const total = allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
    return {
      totalLandedCostAllocated: Math.round(total * 100) / 100,
      allocations: allocations.map((a) => ({
        layerId: a.layerId,
        allocatedLandedCost: a.allocatedAmount,
        basis: a.basis,
      })),
    };
  }
}

/**
 * Service 5: CogsPreparationService
 * COGS Foundation Calculator for consumed inventory.
 */
export class CogsPreparationService {
  constructor(private readonly layerService: CostLayerService) {}

  public prepareCogsForConsumption(stockItemId: string, consumedQuantity: number): { cogsAmount: number; methodUsed: ValuationMethod } {
    const result = this.layerService.consumeFifoLayers(stockItemId, consumedQuantity);
    return {
      cogsAmount: result.totalCogsValue,
      methodUsed: ValuationMethod.FIFO,
    };
  }
}

/**
 * Service 6: ValuationService
 * Primary Inventory Valuation Coordinator & Dashboard Projector.
 */
export class ValuationService {
  constructor(
    private readonly layerService: CostLayerService,
    private readonly avgService: AverageCostService
  ) {}

  public getInventoryValueDashboard(method: ValuationMethod = ValuationMethod.FIFO): InventoryValueDashboardReadModel {
    const layersMap = this.layerService.getLayersMap();
    let totalAssetValue = 0;
    const items: Array<{
      stockItemId: string;
      itemName: string;
      totalQuantityOnHand: number;
      valuationMethod: ValuationMethod;
      unitCost: number;
      totalAssetValue: number;
    }> = [];

    for (const [stockItemId, layers] of layersMap.entries()) {
      const activeLayers = layers.filter((l) => l.remainingQuantity > 0);
      const totalQty = activeLayers.reduce((sum, l) => sum + l.remainingQuantity, 0);

      let itemValue = 0;
      if (method === ValuationMethod.FIFO) {
        itemValue = activeLayers.reduce((sum, l) => sum + l.remainingQuantity * l.unitCost.amount, 0);
      } else {
        const avg = this.avgService.getAverageCost(stockItemId);
        itemValue = totalQty * avg.unitPrice;
      }

      itemValue = Math.round(itemValue * 100) / 100;
      totalAssetValue += itemValue;

      const unitCost = totalQty > 0 ? itemValue / totalQty : 0;
      items.push({
        stockItemId,
        itemName: `Stock Item ${stockItemId}`,
        totalQuantityOnHand: totalQty,
        valuationMethod: method,
        unitCost: Math.round(unitCost * 100) / 100,
        totalAssetValue: itemValue,
      });
    }

    return {
      totalInventoryAssetValue: Math.round(totalAssetValue * 100) / 100,
      totalValuedItemsCount: items.length,
      items,
    };
  }

  public createCostSnapshot(stockItemId: string): CostSnapshot {
    const dashboard = this.getInventoryValueDashboard(ValuationMethod.FIFO);
    const item = dashboard.items.find((i) => i.stockItemId === stockItemId);
    const totalVal = item ? item.totalAssetValue : 0;
    const totalQty = item ? item.totalQuantityOnHand : 0;

    return CostSnapshot.create(stockItemId, totalVal, totalQty);
  }
}

/**
 * Service 7: EnterpriseInventoryCostingPlatformService
 * High-level application façade for inventory valuation & costing platform infrastructure.
 */
export class EnterpriseInventoryCostingPlatformService {
  constructor(
    public readonly layerService: CostLayerService,
    public readonly avgService: AverageCostService,
    public readonly landedCostService: LandedCostService,
    public readonly allocationService: CostAllocationService,
    public readonly cogsService: CogsPreparationService,
    public readonly valuationService: ValuationService
  ) {}
}
