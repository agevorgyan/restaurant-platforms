import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { InventoryReservation } from '../entities/inventory-reservation.entity';
import { InventoryThreshold } from '../entities/inventory-threshold.entity';
import { InventoryLocationEntity } from '../entities/inventory-location.entity';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { BatchNumber } from '../value-objects/batch-number.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import { ReorderLevel } from '../value-objects/reorder-level.value-object';
import {
  InventoryCreatedEvent,
  InventoryAdjustedEvent,
  InventoryLowStockEvent,
  InventoryOutOfStockEvent,
} from '../events/inventory.events';

describe('Inventory Aggregate', () => {
  const defaultPrecision = UnitPrecision.create(2);
  const location = InventoryLocationEntity.create({
    id: 'loc1',
    inventoryId: 'inv1',
    aisle: 'A',
    rack: '1',
    shelf: 'B',
  });

  describe('Creation and Initialization', () => {
    it('should create an active inventory with zero quantities', () => {
      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision);

      expect(inventory.id).toBe('inv1');
      expect(inventory.restaurantId).toBe('rest1');
      expect(inventory.ingredientId).toBe('ing1');
      expect(inventory.onHandQuantity.quantity.value).toBe(0);
      expect(inventory.reservedQuantity.quantity.value).toBe(0);
      expect(inventory.availableQuantity.quantity.value).toBe(0);
      expect(inventory.batches.length).toBe(0);
      expect(inventory.reservations.length).toBe(0);

      const events = inventory.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(InventoryCreatedEvent);
    });
  });

  describe('Batch Management', () => {
    it('should add a batch and increment on-hand and available quantities', () => {
      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision);
      inventory.clearEvents();

      const batch = InventoryBatch.create({
        id: 'batch1',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(100, defaultPrecision),
      });

      inventory.addBatch(batch);

      expect(inventory.batches.length).toBe(1);
      expect(inventory.onHandQuantity.quantity.value).toBe(100);
      expect(inventory.availableQuantity.quantity.value).toBe(100);
      expect(inventory.reservedQuantity.quantity.value).toBe(0);

      const events = inventory.domainEvents;
      expect(events.some(e => e instanceof InventoryAdjustedEvent)).toBe(true);
    });

    it('should prevent adding duplicate active batch numbers', () => {
      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision);

      const batch1 = InventoryBatch.create({
        id: 'batch1',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(100, defaultPrecision),
      });

      const batch2 = InventoryBatch.create({
        id: 'batch2',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(50, defaultPrecision),
      });

      inventory.addBatch(batch1);
      expect(() => inventory.addBatch(batch2)).toThrow(/Duplicate active batch/);
    });

    it('should subtract remaining quantity when deactivating a batch', () => {
      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision);

      const batch = InventoryBatch.create({
        id: 'batch1',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(100, defaultPrecision),
      });

      inventory.addBatch(batch);
      inventory.clearEvents();

      inventory.deactivateBatch('batch1');

      expect(inventory.onHandQuantity.quantity.value).toBe(0);
      expect(inventory.availableQuantity.quantity.value).toBe(0);

      const deactivatedBatch = inventory.batches.find(b => b.id === 'batch1');
      expect(deactivatedBatch?.isActive).toBe(false);

      const events = inventory.domainEvents;
      expect(events.some(e => e instanceof InventoryAdjustedEvent)).toBe(true);
      expect(events.some(e => e instanceof InventoryOutOfStockEvent)).toBe(true);
    });
  });

  describe('Reservation Management', () => {
    it('should add a reservation and adjust available quantity', () => {
      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision);
      
      const batch = InventoryBatch.create({
        id: 'batch1',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(100, defaultPrecision),
      });
      inventory.addBatch(batch);
      inventory.clearEvents();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const reservation = InventoryReservation.create({
        id: 'resv1',
        inventoryId: 'inv1',
        orderReference: new ReferenceId('ORDER-123'),
        quantity: Quantity.create(30, defaultPrecision),
        expirationTimestamp: tomorrow,
      });

      inventory.addReservation(reservation);

      expect(inventory.reservations.length).toBe(1);
      expect(inventory.onHandQuantity.quantity.value).toBe(100);
      expect(inventory.reservedQuantity.quantity.value).toBe(30);
      expect(inventory.availableQuantity.quantity.value).toBe(70);
    });

    it('should fail to reserve if quantity exceeds available', () => {
      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision);
      
      const batch = InventoryBatch.create({
        id: 'batch1',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(50, defaultPrecision),
      });
      inventory.addBatch(batch);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const reservation = InventoryReservation.create({
        id: 'resv1',
        inventoryId: 'inv1',
        orderReference: new ReferenceId('ORDER-123'),
        quantity: Quantity.create(60, defaultPrecision),
        expirationTimestamp: tomorrow,
      });

      expect(() => inventory.addReservation(reservation)).toThrow(/exceeds available quantity/);
    });

    it('should restore available quantity when a reservation is released', () => {
      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision);
      
      inventory.addBatch(InventoryBatch.create({
        id: 'batch1',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(100, defaultPrecision),
      }));

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const reservation = InventoryReservation.create({
        id: 'resv1',
        inventoryId: 'inv1',
        orderReference: new ReferenceId('ORDER-123'),
        quantity: Quantity.create(40, defaultPrecision),
        expirationTimestamp: tomorrow,
      });

      inventory.addReservation(reservation);
      expect(inventory.availableQuantity.quantity.value).toBe(60);

      inventory.releaseReservation('resv1');

      expect(inventory.onHandQuantity.quantity.value).toBe(100);
      expect(inventory.reservedQuantity.quantity.value).toBe(0);
      expect(inventory.availableQuantity.quantity.value).toBe(100);
      expect(inventory.reservations[0].isReleased).toBe(true);
    });
  });

  describe('Threshold Policy', () => {
    it('should emit LowStockEvent when quantity falls below reorder level', () => {
      const threshold = InventoryThreshold.create({
        id: 'thresh1',
        inventoryId: 'inv1',
        reorderLevel: ReorderLevel.create(Quantity.create(20, defaultPrecision)),
      });

      const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, defaultPrecision, threshold);
      
      inventory.addBatch(InventoryBatch.create({
        id: 'batch1',
        inventoryId: 'inv1',
        batchNumber: BatchNumber.create('B001'),
        quantity: Quantity.create(30, defaultPrecision),
      }));
      inventory.clearEvents();

      // Reserve 15 -> Available becomes 15 (which is <= 20)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const reservation = InventoryReservation.create({
        id: 'resv1',
        inventoryId: 'inv1',
        orderReference: new ReferenceId('ORDER-123'),
        quantity: Quantity.create(15, defaultPrecision),
        expirationTimestamp: tomorrow,
      });

      inventory.addReservation(reservation);

      const events = inventory.domainEvents;
      expect(events.some(e => e instanceof InventoryLowStockEvent)).toBe(true);
    });
  });
});
