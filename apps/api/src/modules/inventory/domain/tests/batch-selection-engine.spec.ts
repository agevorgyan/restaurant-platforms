import { Inventory } from '../aggregates/inventory.aggregate';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { BatchSelectionEngine } from '../services/batch-selection.engine';
import { AllocationRequest, AllocationStrategyEnum } from '../value-objects/allocation-request.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import { ExpirationDate } from '../value-objects/expiration-date.value-object';
import { InventoryLocationEntity } from '../entities/inventory-location.entity';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { BatchNumber } from '../value-objects/batch-number.value-object';

describe('BatchSelectionEngine Domain Service', () => {
  const precision = UnitPrecision.create(2);
  const location = InventoryLocationEntity.create({ id: 'loc1', inventoryId: 'inv1' });

  it('should select batches using FIFO strategy', () => {
    const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    
    // Batch 1: Received yesterday
    const d1 = new Date(); d1.setDate(d1.getDate() - 1);
    const b1 = InventoryBatch.create({
      id: 'batch1', inventoryId: 'inv1', batchNumber: BatchNumber.create('B1'), quantity: Quantity.create(50, precision)
    });
    (b1 as any).props.createdAt = d1;
    inventory.addBatch(b1);

    // Batch 2: Received today
    const d2 = new Date();
    const b2 = InventoryBatch.create({
      id: 'batch2', inventoryId: 'inv1', batchNumber: BatchNumber.create('B2'), quantity: Quantity.create(50, precision)
    });
    (b2 as any).props.createdAt = d2;
    inventory.addBatch(b2);

    const request = AllocationRequest.create({
      inventoryId: 'inv1',
      orderId: new ReferenceId('ord1'),
      quantity: Quantity.create(60, precision),
      strategy: AllocationStrategyEnum.FIFO
    });

    const strategy = BatchSelectionEngine.createStrategy(request.strategy);
    const plan = strategy.selectBatches(inventory, request);

    expect(plan.totalAllocated.value).toBe(60);
    expect(plan.batchAllocations.length).toBe(2);
    expect(plan.batchAllocations[0].batchId).toBe('batch1');
    expect(plan.batchAllocations[0].quantityToAllocate.value).toBe(50);
    expect(plan.batchAllocations[1].batchId).toBe('batch2');
    expect(plan.batchAllocations[1].quantityToAllocate.value).toBe(10);
  });

  it('should select batches using FEFO strategy', () => {
    const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    
    // Batch 1: Received yesterday, Expires in 10 days
    const r1 = new Date(); r1.setDate(r1.getDate() - 1);
    const e1 = new Date(); e1.setDate(e1.getDate() + 10);
    const b1 = InventoryBatch.create({
      id: 'batch1', inventoryId: 'inv1', batchNumber: BatchNumber.create('B1'), quantity: Quantity.create(50, precision), expirationDate: ExpirationDate.create(e1)
    });
    (b1 as any).props.createdAt = r1;
    inventory.addBatch(b1);

    // Batch 2: Received today, Expires in 2 days (Should be picked first for FEFO)
    const r2 = new Date();
    const e2 = new Date(); e2.setDate(e2.getDate() + 2);
    const b2 = InventoryBatch.create({
      id: 'batch2', inventoryId: 'inv1', batchNumber: BatchNumber.create('B2'), quantity: Quantity.create(50, precision), expirationDate: ExpirationDate.create(e2)
    });
    (b2 as any).props.createdAt = r2;
    inventory.addBatch(b2);

    const request = AllocationRequest.create({
      inventoryId: 'inv1',
      orderId: new ReferenceId('ord1'),
      quantity: Quantity.create(60, precision),
      strategy: AllocationStrategyEnum.FEFO
    });

    const strategy = BatchSelectionEngine.createStrategy(request.strategy);
    const plan = strategy.selectBatches(inventory, request);

    expect(plan.totalAllocated.value).toBe(60);
    expect(plan.batchAllocations.length).toBe(2);
    expect(plan.batchAllocations[0].batchId).toBe('batch2'); // Picked first because it expires sooner
    expect(plan.batchAllocations[0].quantityToAllocate.value).toBe(50);
    expect(plan.batchAllocations[1].batchId).toBe('batch1');
    expect(plan.batchAllocations[1].quantityToAllocate.value).toBe(10);
  });
});
