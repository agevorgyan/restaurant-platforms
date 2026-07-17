import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { InventoryStatus } from './value-objects/inventory-status.value-object';
import { InventoryType } from './value-objects/inventory-type.value-object';
import { InventoryLocation } from './value-objects/inventory-location.value-object';
import { InventoryCapacity } from './value-objects/inventory-capacity.value-object';
import { validateCreateInventory, validateUpdateInventory } from '../application/validation/inventory.schema';
import { InventoryDomainService } from './services/inventory.domain.service';
import { IInventoryRepository } from './repositories/inventory.repository.interface';
import { IInventory } from './entities/inventory.interface';

describe('Inventory Domain', () => {
  describe('Value Objects', () => {
    it('InventoryStatus should validate correctly', () => {
      assert.doesNotThrow(() => new InventoryStatus('Active'));
      assert.doesNotThrow(() => new InventoryStatus('Inactive'));
      assert.doesNotThrow(() => new InventoryStatus('Archived'));
      assert.throws(() => new InventoryStatus('Deleted' as any), /Invalid inventory status/);
    });

    it('InventoryType should validate correctly', () => {
      assert.doesNotThrow(() => new InventoryType('MainWarehouse'));
      assert.throws(() => new InventoryType('Invalid' as any), /Invalid inventory type/);
    });

    it('InventoryLocation should not be empty', () => {
      assert.doesNotThrow(() => new InventoryLocation('Room A'));
      assert.throws(() => new InventoryLocation('   '), /Inventory location description must not be empty/);
    });

    it('InventoryCapacity should be greater than zero', () => {
      assert.doesNotThrow(() => new InventoryCapacity(100));
      assert.throws(() => new InventoryCapacity(0), /Capacity must be greater than zero/);
      assert.throws(() => new InventoryCapacity(-10), /Capacity must be greater than zero/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateInventoryDto', () => {
      const errors = validateCreateInventory({
        restaurantId: '',
        name: '  ',
        code: '',
        type: '',
        location: '',
        capacity: 0
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('Inventory name must not be empty'), true);
      assert.strictEqual(errors.includes('code is required'), true);
      assert.strictEqual(errors.includes('type is required'), true);
      assert.strictEqual(errors.includes('Inventory location description must not be empty'), true);
      assert.strictEqual(errors.includes('Capacity must be greater than zero'), true);
    });
    
    it('should validate UpdateInventoryDto', () => {
      const errors = validateUpdateInventory({ name: '   ', capacity: -5 });
      assert.strictEqual(errors.includes('Inventory name must not be empty'), true);
      assert.strictEqual(errors.includes('Capacity must be greater than zero'), true);
    });
  });

  describe('Domain Service', () => {
    let mockInventory: IInventory;
    
    const mockRepo: IInventoryRepository = {
      findById: async () => mockInventory,
      findByCodeAndRestaurantId: async () => null,
      save: async (inv) => { mockInventory = inv; }
    };

    it('should create inventory in Inactive state', async () => {
      const service = new InventoryDomainService(mockRepo);
      const inventory = await service.createInventory('inv1', {
        restaurantId: 'r1',
        name: 'Main Storage',
        code: 'WH01',
        type: 'MainWarehouse',
        location: 'Building 1',
        capacity: 500
      });

      assert.strictEqual(inventory.id, 'inv1');
      assert.strictEqual(inventory.status.isActive(), false);
      assert.strictEqual(inventory.status.value, 'Inactive');
    });

    it('should activate inventory', async () => {
      const service = new InventoryDomainService(mockRepo);
      await service.activateInventory('inv1');
      assert.strictEqual(mockInventory.status.isActive(), true);
    });

    it('should allow accepting stock only when active', async () => {
      const service = new InventoryDomainService(mockRepo);
      assert.doesNotThrow(async () => await service.acceptStock('inv1'));
      
      await service.deactivateInventory('inv1');
      try {
        await service.acceptStock('inv1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only Active inventories may accept stock');
      }
    });

    it('should enforce read-only on archived inventory', async () => {
      const service = new InventoryDomainService(mockRepo);
      await service.archiveInventory('inv1');
      
      try {
        await service.updateInventory('inv1', { name: 'New Name' });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Archived inventories are read-only');
      }

      try {
        await service.activateInventory('inv1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Cannot activate an archived inventory');
      }
    });
  });
});
