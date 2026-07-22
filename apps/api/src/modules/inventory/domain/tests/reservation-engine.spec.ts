import { Inventory } from '../aggregates/inventory.aggregate';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { ReservationEngine } from '../services/reservation.engine';
import { ReservationRequest } from '../value-objects/reservation-request.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import { InventoryLocationEntity } from '../entities/inventory-location.entity';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { BatchNumber } from '../value-objects/batch-number.value-object';

describe('ReservationEngine Domain Service', () => {
  const precision = UnitPrecision.create(2);
  const location = InventoryLocationEntity.create({ id: 'loc1', inventoryId: 'inv1' });

  it('should reserve inventory and generate a movement', () => {
    const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    inventory.addBatch(InventoryBatch.create({
      id: 'batch1', inventoryId: 'inv1', batchNumber: BatchNumber.create('B1'), quantity: Quantity.create(100, precision)
    }));

    const request = ReservationRequest.create({
      inventoryId: 'inv1',
      orderId: new ReferenceId('order1'),
      quantity: Quantity.create(40, precision),
    });

    const result = ReservationEngine.reserve(inventory, request, 1);

    expect(result.isSuccessful).toBe(true);
    expect(result.reservedQuantity.value).toBe(40);
    expect(result.movementsGenerated.length).toBe(1);
    expect(inventory.availableQuantity.quantity.value).toBe(60);
    expect(inventory.reservedQuantity.quantity.value).toBe(40);
  });

  it('should expire reservations past expiration date', () => {
    const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    inventory.addBatch(InventoryBatch.create({
      id: 'batch1', inventoryId: 'inv1', batchNumber: BatchNumber.create('B1'), quantity: Quantity.create(100, precision)
    }));

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const request = ReservationRequest.create({
      inventoryId: 'inv1',
      orderId: new ReferenceId('order1'),
      quantity: Quantity.create(40, precision),
      expiresAt: tomorrow,
    });

    ReservationEngine.reserve(inventory, request, 1);
    expect(inventory.reservedQuantity.quantity.value).toBe(40);

    // Mutate to be expired
    const res = inventory.reservations[0];
    (res as any).props.expirationTimestamp = new Date(Date.now() - 1000);

    ReservationEngine.expireReservations(inventory);

    expect(inventory.reservedQuantity.quantity.value).toBe(0);
    expect(inventory.availableQuantity.quantity.value).toBe(100);
  });
});
