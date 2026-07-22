import { Inventory } from '../aggregates/inventory.aggregate';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { AllocationEngine } from '../services/allocation.engine';
import { ReservationEngine } from '../services/reservation.engine';
import { ReservationRequest } from '../value-objects/reservation-request.value-object';
import { AllocationRequest, AllocationStrategyEnum } from '../value-objects/allocation-request.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import { InventoryLocationEntity } from '../entities/inventory-location.entity';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { BatchNumber } from '../value-objects/batch-number.value-object';

describe('AllocationEngine Domain Service', () => {
  const precision = UnitPrecision.create(2);
  const location = InventoryLocationEntity.create({ id: 'loc1', inventoryId: 'inv1' });

  it('should allocate reserved inventory', () => {
    const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    inventory.addBatch(InventoryBatch.create({
      id: 'batch1', inventoryId: 'inv1', batchNumber: BatchNumber.create('B1'), quantity: Quantity.create(100, precision)
    }));

    const orderId = new ReferenceId('order1');
    
    // 1. Reserve 40
    ReservationEngine.reserve(inventory, ReservationRequest.create({
      inventoryId: 'inv1',
      orderId,
      quantity: Quantity.create(40, precision),
    }));

    // 2. Allocate 40
    const request = AllocationRequest.create({
      inventoryId: 'inv1',
      orderId,
      quantity: Quantity.create(40, precision),
      strategy: AllocationStrategyEnum.FIFO
    });

    const result = AllocationEngine.allocate(inventory, request);

    expect(result.isSuccessful).toBe(true);
    expect(result.plan!.totalAllocated.value).toBe(40);
    expect(result.movementsGenerated.length).toBe(1);

    // The reservation was consumed, so available is still 60 (it was 60 after reservation),
    // but onHand is now 60 because we allocated from the batch!
    expect(inventory.onHandQuantity.quantity.value).toBe(60);
    expect(inventory.reservedQuantity.quantity.value).toBe(0);
    expect(inventory.availableQuantity.quantity.value).toBe(60);
  });

  it('should reject allocation if no active reservation exists', () => {
    const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    inventory.addBatch(InventoryBatch.create({
      id: 'batch1', inventoryId: 'inv1', batchNumber: BatchNumber.create('B1'), quantity: Quantity.create(100, precision)
    }));

    const orderId = new ReferenceId('order1');
    
    const request = AllocationRequest.create({
      inventoryId: 'inv1',
      orderId,
      quantity: Quantity.create(40, precision),
      strategy: AllocationStrategyEnum.FIFO
    });

    const result = AllocationEngine.allocate(inventory, request);

    expect(result.isSuccessful).toBe(false);
    expect(result.errorMessage).toContain('Must reserve before allocating');
  });
});
