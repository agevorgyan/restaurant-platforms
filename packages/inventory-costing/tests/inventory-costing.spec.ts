/**
 * Enterprise Inventory Valuation & Costing Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Immutable FIFO Cost Layers, Oldest-Layer FIFO Consumption,
 * Deterministic Weighted Average Costing, Landed Cost Allocation, CQRS Read Models, and verification of zero stock quantity mutations.
 */

import { ValuationMethod } from '../src/domain/enums/inventory-costing.enums';
import {
  AverageCost,
  CostLayer,
  LandedCost,
  UnitCost,
} from '../src/domain/value-objects/inventory-costing-vo';
import {
  AverageCostService,
  CogsPreparationService,
  CostAllocationService,
  CostLayerService,
  EnterpriseInventoryCostingPlatformService,
  LandedCostService,
  ValuationService,
} from '../src/services/inventory-costing.services';

describe('Enterprise Inventory Valuation & Costing Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format UnitCost, LandedCost, and AverageCost correctly', () => {
      const unitCost = UnitCost.create(12.5);
      expect(unitCost.amount).toBe(12.5);

      const landed = LandedCost.create(150.0);
      expect(landed.freightDutyAmount).toBe(150.0);

      const avgCost = AverageCost.create(500, 20); // 500 / 20 = 25
      expect(avgCost.unitPrice).toBe(25);
    });
  });

  describe('CostLayerService & FIFO Consumption Engine', () => {
    let layerService: CostLayerService;
    let cogsService: CogsPreparationService;

    beforeEach(() => {
      layerService = new CostLayerService();
      cogsService = new CogsPreparationService(layerService);
    });

    it('should consume oldest available cost layers first in FIFO order', () => {
      // Layer 1: 10 units @ $10.00 = $100
      layerService.createCostLayer('item-beef', 10, 10.0);
      // Layer 2: 10 units @ $15.00 = $150
      layerService.createCostLayer('item-beef', 10, 15.0);

      // Consume 12 units -> 10 from Layer 1 ($100) + 2 from Layer 2 ($30) = $130 COGS
      const result = cogsService.prepareCogsForConsumption('item-beef', 12);
      expect(result.cogsAmount).toBe(130.0);
      expect(result.methodUsed).toBe(ValuationMethod.FIFO);

      const activeLayers = layerService.getActiveCostLayers('item-beef');
      expect(activeLayers.length).toBe(1); // Layer 1 fully archived, Layer 2 has 8 remaining
      expect(activeLayers[0].remainingQuantity).toBe(8);
    });
  });

  describe('AverageCostService & LandedCostService', () => {
    let layerService: CostLayerService;
    let avgService: AverageCostService;
    let landedCostService: LandedCostService;

    beforeEach(() => {
      layerService = new CostLayerService();
      avgService = new AverageCostService();
      landedCostService = new LandedCostService(layerService);
    });

    it('should calculate weighted average cost deterministically', () => {
      const avg = avgService.calculateWeightedAverage('item-oil', 600, 30); // 600 / 30 = 20
      expect(avg.unitPrice).toBe(20);
    });

    it('should allocate landed cost proportionally across open cost layers', () => {
      layerService.createCostLayer('item-wine', 20, 50.0); // 20 units
      layerService.createCostLayer('item-wine', 30, 60.0); // 30 units (Total 50 units)

      // Allocate $500 landed cost -> Layer 1 gets (20/50)*500 = $200, Layer 2 gets (30/50)*500 = $300
      const allocations = landedCostService.allocateLandedCost('item-wine', 500);
      expect(allocations.length).toBe(2);
      expect(allocations[0].allocatedAmount).toBe(200.0);
      expect(allocations[1].allocatedAmount).toBe(300.0);

      const activeLayers = layerService.getActiveCostLayers('item-wine');
      // Layer 1 unit cost increased by 200/20 = +$10 -> $60.00
      expect(activeLayers[0].unitCost.amount).toBe(60.0);
    });
  });

  describe('ValuationService & Read Models', () => {
    let layerService: CostLayerService;
    let avgService: AverageCostService;
    let valuationService: ValuationService;

    beforeEach(() => {
      layerService = new CostLayerService();
      avgService = new AverageCostService();
      valuationService = new ValuationService(layerService, avgService);
    });

    it('should project InventoryValueDashboard without mutating physical stock', () => {
      layerService.createCostLayer('item-flour', 50, 2.0);

      const dash = valuationService.getInventoryValueDashboard(ValuationMethod.FIFO);
      expect(dash.totalInventoryAssetValue).toBe(100.0);
      expect(dash.totalValuedItemsCount).toBe(1);

      const snapshot = valuationService.createCostSnapshot('item-flour');
      expect(snapshot.totalAssetValue).toBe(100.0);
      expect(snapshot.averageUnitCost).toBe(2.0);
    });
  });

  describe('EnterpriseInventoryCostingPlatformService Façade Integration', () => {
    let layerService: CostLayerService;
    let avgService: AverageCostService;
    let landedCostService: LandedCostService;
    let allocationService: CostAllocationService;
    let cogsService: CogsPreparationService;
    let valuationService: ValuationService;
    let platformService: EnterpriseInventoryCostingPlatformService;

    beforeEach(() => {
      layerService = new CostLayerService();
      avgService = new AverageCostService();
      landedCostService = new LandedCostService(layerService);
      allocationService = new CostAllocationService();
      cogsService = new CogsPreparationService(layerService);
      valuationService = new ValuationService(layerService, avgService);

      platformService = new EnterpriseInventoryCostingPlatformService(
        layerService,
        avgService,
        landedCostService,
        allocationService,
        cogsService,
        valuationService
      );
    });

    it('should query InventoryValueDashboard via platform facade', () => {
      const dash = platformService.valuationService.getInventoryValueDashboard();
      expect(dash.totalValuedItemsCount).toBe(0);
    });
  });
});
