import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { CustomerStatus } from './value-objects/customer-status.value-object';
import { CustomerType } from './value-objects/customer-type.value-object';
import { CustomerCode } from './value-objects/customer-code.value-object';
import { validateCreateCustomer, validateUpdateCustomer } from '../application/validation/customer.schema';
import { CustomerDomainService } from './services/customer.domain.service';
import { ICustomerRepository } from './repositories/customer.repository.interface';
import { ICustomer } from './entities/customer.interface';

describe('Customer Domain', () => {
  describe('Value Objects', () => {
    it('CustomerStatus should validate types', () => {
      assert.doesNotThrow(() => new CustomerStatus('Draft'));
      assert.throws(() => new CustomerStatus('Invalid' as any));
      const status = new CustomerStatus('Archived');
      assert.strictEqual(status.isArchived(), true);
    });

    it('CustomerType should validate types', () => {
      assert.doesNotThrow(() => new CustomerType('Individual'));
      assert.throws(() => new CustomerType('Invalid' as any));
    });

    it('CustomerCode should validate strings', () => {
      assert.doesNotThrow(() => new CustomerCode('CUST-001'));
      assert.throws(() => new CustomerCode(''));
    });
  });

  describe('Validation', () => {
    it('should validate CreateCustomerDto', () => {
      const errors = validateCreateCustomer({
        restaurantId: '',
        customerCode: '',
        customerType: '',
        email: '',
      } as any);
      
      assert.ok(errors.includes('restaurantId is required'));
      assert.ok(errors.includes('customerCode is required'));
      assert.ok(errors.includes('customerType is required'));
      assert.ok(errors.includes('At least one contact method (email or phone) is required directly or in contacts'));
    });

    it('should validate UpdateCustomerDto', () => {
      const errors = validateUpdateCustomer({
        contacts: [
          { name: 'John', isPrimary: true },
          { name: 'Jane', isPrimary: true }
        ],
        addresses: [
          { label: 'Home', country: 'US', city: 'NY', street: '1st', postalCode: '10001', isDefault: true },
          { label: 'Work', country: 'US', city: 'NY', street: '2nd', postalCode: '10002', isDefault: true }
        ],
        tags: [
          { name: 'VIP' },
          { name: 'VIP' }
        ]
      } as any);

      assert.ok(errors.includes('Only one primary contact is allowed'));
      assert.ok(errors.includes('Only one default address is allowed'));
      assert.ok(errors.includes('Tags must be unique per customer'));
    });
  });

  describe('Domain Service', () => {
    const mockCustomers: ICustomer[] = [];
    const mockRepo: ICustomerRepository = {
      findById: async (id) => mockCustomers.find(c => c.id === id) || null,
      findByCustomerCode: async (rid, code) => mockCustomers.find(c => c.restaurantId === rid && c.customerCode.value === code) || null,
      save: async (c) => {
        const index = mockCustomers.findIndex(mc => mc.id === c.id);
        if (index >= 0) mockCustomers[index] = c;
        else mockCustomers.push(c);
      }
    };

    const service = new CustomerDomainService(mockRepo);

    it('should prevent creating customer with non-unique code', async () => {
      mockCustomers.push({
        id: 'c1',
        restaurantId: 'r1',
        customerCode: new CustomerCode('CUST-001')
      } as ICustomer);

      try {
        await service.createCustomer('c2', {
          restaurantId: 'r1',
          customerCode: 'CUST-001',
          customerType: 'Individual',
          email: 'test@example.com'
        });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Customer code must be unique within the restaurant');
      }
    });

    it('should create customer successfully', async () => {
      const c = await service.createCustomer('c3', {
        restaurantId: 'r1',
        customerCode: 'CUST-003',
        customerType: 'Business',
        phone: '123456789'
      });

      assert.strictEqual(c.id, 'c3');
      assert.strictEqual(c.status.isDraft(), true);
      assert.ok(c.domainEvents?.length === 1);
      assert.strictEqual(c.domainEvents[0].eventName, 'CustomerCreated');
    });

    it('should enforce contact rules on creation', async () => {
      try {
        await service.createCustomer('c4', {
          restaurantId: 'r1',
          customerCode: 'CUST-004',
          customerType: 'Individual',
          contacts: [{ name: 'Test', isPrimary: true }]
        });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.ok(e.message.includes('At least one contact method (email or phone) is required directly or in contacts'));
      }
    });

    it('should enforce read-only on archived customers', async () => {
      await service.createCustomer('c5', {
        restaurantId: 'r1',
        customerCode: 'CUST-005',
        customerType: 'Individual',
        email: 'test@example.com'
      });

      await service.archiveCustomer('c5');

      try {
        await service.updatePreferences('c5', { marketingConsent: true, emailNotifications: true, smsNotifications: false, pushNotifications: false });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Archived customers are read-only');
      }
    });

    it('should manage lifecycle events', async () => {
      await service.createCustomer('c6', {
        restaurantId: 'r1',
        customerCode: 'CUST-006',
        customerType: 'Individual',
        email: 'test@example.com'
      });

      await service.activateCustomer('c6');
      let updatedC = await mockRepo.findById('c6');
      assert.strictEqual(updatedC?.status.isActive(), true);
      assert.ok(updatedC?.domainEvents?.some(e => e.eventName === 'CustomerActivated'));

      await service.deactivateCustomer('c6');
      updatedC = await mockRepo.findById('c6');
      assert.strictEqual(updatedC?.status.value, 'Inactive');
      assert.ok(updatedC?.domainEvents?.some(e => e.eventName === 'CustomerDeactivated'));
    });
  });
});
