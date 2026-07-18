import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { SupplierStatus } from './value-objects/supplier-status.value-object';
import { SupplierType } from './value-objects/supplier-type.value-object';
import { SupplierCode } from './value-objects/supplier-code.value-object';
import { SupplierAddress } from './value-objects/supplier-address.value-object';
import { validateCreateSupplier } from '../application/validation/supplier.schema';
import { SupplierDomainService } from './services/supplier.domain.service';
import { ISupplierRepository } from './repositories/supplier.repository.interface';
import { ISupplier } from './entities/supplier.interface';

describe('Supplier Domain', () => {
  describe('Value Objects', () => {
    it('SupplierStatus should validate types', () => {
      assert.doesNotThrow(() => new SupplierStatus('Draft'));
      assert.doesNotThrow(() => new SupplierStatus('Active'));
      assert.throws(() => new SupplierStatus('Invalid' as any), /Invalid supplier status/);
    });

    it('SupplierType should validate types', () => {
      assert.doesNotThrow(() => new SupplierType('Manufacturer'));
      assert.doesNotThrow(() => new SupplierType('LocalFarm'));
      assert.throws(() => new SupplierType('Invalid' as any), /Invalid supplier type/);
    });

    it('SupplierCode should not be empty', () => {
      assert.doesNotThrow(() => new SupplierCode('SUP-01'));
      assert.throws(() => new SupplierCode(''), /Supplier code cannot be empty/);
    });

    it('SupplierAddress should enforce country', () => {
      assert.doesNotThrow(() => new SupplierAddress('123 St', 'City', 'State', '12345', 'Country'));
      assert.throws(() => new SupplierAddress('123 St', 'City', 'State', '12345', ''), /Country is required/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateSupplierDto', () => {
      const errors = validateCreateSupplier({
        restaurantId: '',
        supplierCode: '',
        name: '',
        type: '',
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('supplierCode is required'), true);
      assert.strictEqual(errors.includes('name is required'), true);
      assert.strictEqual(errors.includes('type is required'), true);
    });

    it('should validate emails and websites', () => {
      const errors = validateCreateSupplier({
        restaurantId: 'r1',
        supplierCode: 'C1',
        name: 'N1',
        type: 'Manufacturer',
        email: 'invalid-email',
        website: 'invalid-url'
      });
      assert.strictEqual(errors.includes('email is invalid'), true);
      assert.strictEqual(errors.includes('website is invalid'), true);
    });

    it('should prevent multiple primary contacts', () => {
      const errors = validateCreateSupplier({
        restaurantId: 'r1',
        supplierCode: 'C1',
        name: 'N1',
        type: 'Manufacturer',
        contacts: [
          { name: 'C1', isPrimary: true },
          { name: 'C2', isPrimary: true }
        ]
      });
      assert.strictEqual(errors.includes('Only one primary contact is allowed'), true);
    });
  });

  describe('Domain Service', () => {
    let mockSupplier: ISupplier;
    let findByCodeResult: ISupplier | null = null;
    let findByTaxResult: ISupplier | null = null;

    const mockRepo: ISupplierRepository = {
      findById: async () => mockSupplier,
      findBySupplierCode: async () => findByCodeResult,
      findByTaxNumber: async () => findByTaxResult,
      save: async (supplier) => { mockSupplier = supplier; }
    };

    const service = new SupplierDomainService(mockRepo);

    it('should create supplier in Draft state', async () => {
      findByCodeResult = null;
      findByTaxResult = null;
      
      const supplier = await service.createSupplier('sup1', {
        restaurantId: 'r1',
        supplierCode: 'SUP-001',
        name: 'Test Supplier',
        type: 'Manufacturer',
        contacts: [{ name: 'John Doe', isPrimary: true }]
      });

      assert.strictEqual(supplier.id, 'sup1');
      assert.strictEqual(supplier.status.value, 'Draft');
      assert.strictEqual(supplier.contacts.length, 1);
      assert.strictEqual(supplier.contacts[0].isPrimary, true);
    });

    it('should prevent creating supplier with existing code', async () => {
      findByCodeResult = {} as ISupplier;
      try {
        await service.createSupplier('sup2', {
          restaurantId: 'r1',
          supplierCode: 'SUP-001',
          name: 'Test',
          type: 'Manufacturer'
        });
        assert.fail('Should throw error');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Supplier code SUP-001 already exists for this restaurant');
      }
    });

    it('should activate a supplier', async () => {
      await service.activateSupplier('sup1');
      assert.strictEqual(mockSupplier.status.isActive(), true);
    });

    it('should prevent updating archived supplier', async () => {
      await service.archiveSupplier('sup1');
      assert.strictEqual(mockSupplier.status.isArchived(), true);

      try {
        await service.updateSupplier('sup1', { name: 'New Name' });
        assert.fail('Should throw error');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Archived suppliers are read-only');
      }
    });

    it('should handle adding contacts', async () => {
      // Un-archive for testing
      mockSupplier.status = new SupplierStatus('Active');
      
      await service.addContact('sup1', {
        name: 'Jane Doe',
        isPrimary: true
      });

      assert.strictEqual(mockSupplier.contacts.length, 2);
      const jane = mockSupplier.contacts.find(c => c.name === 'Jane Doe');
      const john = mockSupplier.contacts.find(c => c.name === 'John Doe');
      
      assert.strictEqual(jane?.isPrimary, true);
      assert.strictEqual(john?.isPrimary, false); // John was demoted
    });

    it('should handle removing primary contact when others exist', async () => {
      try {
        await service.removeContact('sup1', mockSupplier.contacts.find(c => c.isPrimary)!.id);
        assert.fail('Should throw error');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Cannot remove the primary contact. Set another contact as primary first.');
      }
    });
  });
});
