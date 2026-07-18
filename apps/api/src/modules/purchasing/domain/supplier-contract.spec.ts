import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { ContractStatus } from './value-objects/contract-status.value-object';
import { ContractPeriod } from './value-objects/contract-period.value-object';
import { LeadTime } from './value-objects/lead-time.value-object';
import { MinimumOrderQuantity } from './value-objects/minimum-order-quantity.value-object';
import { validateCreateSupplierContract } from '../application/validation/supplier-contract.schema';
import { SupplierContractDomainService } from './services/supplier-contract.domain.service';
import { ISupplierContractRepository } from './repositories/supplier-contract.repository.interface';
import { ISupplierContract } from './entities/supplier-contract.interface';

describe('Supplier Contract Domain', () => {
  describe('Value Objects', () => {
    it('ContractStatus should validate types', () => {
      assert.doesNotThrow(() => new ContractStatus('Draft'));
      assert.throws(() => new ContractStatus('Invalid' as any), /Invalid contract status/);
    });

    it('ContractPeriod should validate dates and checking overlaps', () => {
      const past = new Date('2020-01-01');
      const future = new Date('2030-01-01');
      assert.doesNotThrow(() => new ContractPeriod(past, future));
      assert.throws(() => new ContractPeriod(future, past), /Start date must be before end date/);
      
      const period = new ContractPeriod(past, future);
      assert.strictEqual(period.isCurrent(new Date('2025-01-01')), true);
    });

    it('LeadTime should validate days', () => {
      assert.doesNotThrow(() => new LeadTime(5));
      assert.throws(() => new LeadTime(-1), /Lead time must be a non-negative integer representing days/);
    });

    it('MinimumOrderQuantity should validate positives', () => {
      assert.doesNotThrow(() => new MinimumOrderQuantity(10));
      assert.throws(() => new MinimumOrderQuantity(0), /Minimum order quantity must be greater than zero/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateSupplierContractDto', () => {
      const errors = validateCreateSupplierContract({
        restaurantId: '',
        supplierId: '',
        contractNumber: '',
        effectiveStartDate: new Date('invalid'),
        effectiveEndDate: new Date('invalid'),
        paymentTerms: 'NET30',
        currency: 'USD',
        leadTimeDays: -1,
        minimumOrderQuantity: 0,
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('contractNumber is required'), true);
      assert.strictEqual(errors.includes('leadTimeDays must be non-negative'), true);
      assert.strictEqual(errors.includes('minimumOrderQuantity must be greater than zero'), true);
    });
  });

  describe('Domain Service', () => {
    let mockContract: ISupplierContract;
    let findByContractNumberResult: ISupplierContract | null = null;
    let activeContractsResult: ISupplierContract[] = [];

    const mockRepo: ISupplierContractRepository = {
      findById: async () => mockContract,
      findByContractNumber: async () => findByContractNumberResult,
      findActiveContractsBySupplier: async () => activeContractsResult,
      save: async (c) => { mockContract = c; }
    };

    const service = new SupplierContractDomainService(mockRepo);

    it('should create contract', async () => {
      findByContractNumberResult = null;
      const contract = await service.createContract('c1', {
        restaurantId: 'r1',
        supplierId: 's1',
        contractNumber: 'C-001',
        effectiveStartDate: new Date('2025-01-01'),
        effectiveEndDate: new Date('2025-12-31'),
        paymentTerms: 'NET30',
        currency: 'USD',
        leadTimeDays: 2,
        minimumOrderQuantity: 10,
        lines: [{ ingredientId: 'ing1' }]
      });

      assert.strictEqual(contract.id, 'c1');
      assert.strictEqual(contract.status.isDraft(), true);
    });

    it('should prevent multiple active contracts per supplier', async () => {
      mockContract = {
        id: 'c1',
        supplierId: 's1',
        status: new ContractStatus('Draft')
      } as any;

      activeContractsResult = [{ id: 'c2' } as any];

      try {
        await service.activateContract('c1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only one active contract per supplier is allowed');
      }
    });

    it('should allow activation if no other active contracts exist', async () => {
      mockContract = {
        id: 'c1',
        supplierId: 's1',
        status: new ContractStatus('Draft')
      } as any;
      activeContractsResult = [];

      await service.activateContract('c1');
      assert.strictEqual(mockContract.status.isActive(), true);
    });

    it('should prevent activating archived contracts', async () => {
      mockContract = { id: 'c1', status: new ContractStatus('Archived') } as any;
      try {
        await service.activateContract('c1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Cannot activate an expired or archived contract');
      }
    });
  });
});
