import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { AllocationRequest, AllocationStrategyEnum } from '../value-objects/allocation-request.value-object';
import { BatchAllocation, AllocationPlan } from '../value-objects/allocation-plan.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { BatchSelectionPolicy } from '../policies/batch-selection.policy';

export interface IBatchSelectionStrategy {
  selectBatches(inventory: Inventory, request: AllocationRequest): AllocationPlan;
}

export class FIFOBatchSelectionStrategy implements IBatchSelectionStrategy {
  public selectBatches(inventory: Inventory, request: AllocationRequest): AllocationPlan {
    const batches = inventory.batches
      .filter((b) => {
        const isExpired = b.expirationDate ? b.expirationDate.value < new Date() : false;
        return b.isActive && !isExpired && b.quantity.value > 0;
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return BatchSelectionEngine.allocateFromOrderedBatches(inventory, request, batches);
  }
}

export class FEFOBatchSelectionStrategy implements IBatchSelectionStrategy {
  public selectBatches(inventory: Inventory, request: AllocationRequest): AllocationPlan {
    const batches = inventory.batches
      .filter((b) => {
        const isExpired = b.expirationDate ? b.expirationDate.value < new Date() : false;
        return b.isActive && !isExpired && b.quantity.value > 0;
      })
      .sort((a, b) => {
        const aExp = a.expirationDate ? a.expirationDate.value.getTime() : Number.MAX_SAFE_INTEGER;
        const bExp = b.expirationDate ? b.expirationDate.value.getTime() : Number.MAX_SAFE_INTEGER;
        
        if (aExp === bExp) {
          // Fallback to FIFO if expiration dates are identical
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return aExp - bExp;
      });

    return BatchSelectionEngine.allocateFromOrderedBatches(inventory, request, batches);
  }
}

export class ManualBatchSelectionStrategy implements IBatchSelectionStrategy {
  public selectBatches(inventory: Inventory, request: AllocationRequest): AllocationPlan {
    if (!request.specificBatchIds || request.specificBatchIds.length === 0) {
      throw new Error('MANUAL allocation strategy requires specific batch IDs');
    }

    const batches = inventory.batches
      .filter((b) => request.specificBatchIds!.includes(b.id))
      .sort((a, b) => {
        // Maintain the order in which they were requested
        return request.specificBatchIds!.indexOf(a.id) - request.specificBatchIds!.indexOf(b.id);
      });

    return BatchSelectionEngine.allocateFromOrderedBatches(inventory, request, batches);
  }
}

export class BatchSelectionEngine {
  public static createStrategy(strategyType: AllocationStrategyEnum): IBatchSelectionStrategy {
    switch (strategyType) {
      case AllocationStrategyEnum.FIFO:
        return new FIFOBatchSelectionStrategy();
      case AllocationStrategyEnum.FEFO:
        return new FEFOBatchSelectionStrategy();
      case AllocationStrategyEnum.MANUAL:
        return new ManualBatchSelectionStrategy();
      default:
        throw new Error(`Unsupported allocation strategy: ${strategyType}`);
    }
  }

  public static allocateFromOrderedBatches(
    inventory: Inventory,
    request: AllocationRequest,
    orderedBatches: InventoryBatch[]
  ): AllocationPlan {
    let remainingToAllocate = request.quantity.value;
    const precision = request.quantity.precision;
    const batchAllocations: BatchAllocation[] = [];

    for (const batch of orderedBatches) {
      if (remainingToAllocate <= 0) break;

      BatchSelectionPolicy.validateBatchForAllocation(batch);

      const availableInBatch = batch.quantity.value;
      const amountToTake = Math.min(availableInBatch, remainingToAllocate);

      batchAllocations.push({
        batchId: batch.id,
        quantityToAllocate: Quantity.create(amountToTake, precision),
      });

      // Avoid floating point drift
      remainingToAllocate = Number((remainingToAllocate - amountToTake).toFixed(precision.value));
    }

    const totalAllocatedValue = request.quantity.value - remainingToAllocate;

    return AllocationPlan.create({
      inventoryId: inventory.id,
      totalAllocated: Quantity.create(totalAllocatedValue, precision),
      batchAllocations,
    });
  }
}
