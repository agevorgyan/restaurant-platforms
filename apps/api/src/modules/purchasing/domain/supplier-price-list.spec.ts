import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { PriceListStatus } from './value-objects/price-list-status.value-object';
import { PriceValidityPeriod } from './value-objects/price-validity-period.value-object';
import { validateCreateSupplierPriceList } from '../application/validation/supplier-price-list.schema';
import { SupplierPriceListDomainService } from './services/supplier-price-list.domain.service';
import { ISupplierPriceListRepository } from './repositories/supplier-price-list.repository.interface';
import { ISupplierPriceList } from './entities/supplier-price-list.interface';

describe('Supplier Price List Domain', () => {
  describe('Value Objects', () => {
    it('PriceListStatus should validate types', () => {
      assert.doesNotThrow(() => new PriceListStatus('Draft'));
      assert.throws(() => new PriceListStatus('Invalid' as any), /Invalid price list status/);
    });

    it('PriceValidityPeriod should handle overlaps', () => {
      const p1 = new PriceValidityPeriod(new Date('2025-01-01'), new Date('2025-06-30'));
      const p2 = new PriceValidityPeriod(new Date('2025-06-01'), new Date('2025-12-31'));
      const p3 = new PriceValidityPeriod(new Date('2025-07-01'), new Date('2025-12-31'));

      assert.strictEqual(p1.overlapsWith(p2), true);
      assert.strictEqual(p1.overlapsWith(p3), false);
    });
  });

  describe('Validation', () => {
    it('should validate CreateSupplierPriceListDto', () => {
      const errors = validateCreateSupplierPriceList({
        restaurantId: '',
        supplierId: '',
        name: '',
        currency: 'USD',
        validityStartDate: new Date('2030-01-01'),
        validityEndDate: new Date('2020-01-01'),
        items: [
          { ingredientId: 'ing1', unitPrice: 0, minimumQuantity: 0, discountPercent: -1 }
        ]
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('validityStartDate must be before validityEndDate'), true);
      assert.strictEqual(errors.includes('Item [0]: unitPrice must be greater than zero'), true);
      assert.strictEqual(errors.includes('Item [0]: minimumQuantity must be greater than zero'), true);
      assert.strictEqual(errors.includes('Item [0]: discountPercent cannot be negative'), true);
    });
  });

  describe('Domain Service', () => {
    let mockList: ISupplierPriceList;
    let publishedListsResult: ISupplierPriceList[] = [];

    const mockRepo: ISupplierPriceListRepository = {
      findById: async () => mockList,
      findPublishedBySupplier: async () => publishedListsResult,
      save: async (l) => { mockList = l; }
    };

    const service = new SupplierPriceListDomainService(mockRepo);

    it('should create price list', async () => {
      const list = await service.createPriceList('pl1', {
        restaurantId: 'r1',
        supplierId: 's1',
        name: 'Spring Pricing',
        currency: 'USD',
        validityStartDate: new Date('2025-01-01'),
        validityEndDate: new Date('2025-06-30'),
        items: [{ ingredientId: 'ing1', unitPrice: 10, minimumQuantity: 1, discountPercent: 0 }]
      });

      assert.strictEqual(list.id, 'pl1');
      assert.strictEqual(list.status.isDraft(), true);
    });

    it('should prevent publishing if validity periods overlap for same ingredient', async () => {
      mockList = {
        id: 'pl2',
        supplierId: 's1',
        status: new PriceListStatus('Draft'),
        validityPeriod: new PriceValidityPeriod(new Date('2025-06-01'), new Date('2025-12-31')),
        items: [{ ingredientId: 'ing1', unitPrice: 12 }]
      } as any;

      publishedListsResult = [{
        id: 'pl1',
        supplierId: 's1',
        status: new PriceListStatus('Published'),
        validityPeriod: new PriceValidityPeriod(new Date('2025-01-01'), new Date('2025-06-30')),
        items: [{ ingredientId: 'ing1', unitPrice: 10 }]
      }] as any;

      try {
        await service.publishPriceList('pl2');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Price validity periods must not overlap for the same ingredient within the same supplier');
      }
    });

    it('should allow publishing if overlapping validity but different ingredients', async () => {
      mockList = {
        id: 'pl2',
        supplierId: 's1',
        status: new PriceListStatus('Draft'),
        validityPeriod: new PriceValidityPeriod(new Date('2025-06-01'), new Date('2025-12-31')),
        items: [{ ingredientId: 'ing2', unitPrice: 12 }]
      } as any;

      publishedListsResult = [{
        id: 'pl1',
        supplierId: 's1',
        status: new PriceListStatus('Published'),
        validityPeriod: new PriceValidityPeriod(new Date('2025-01-01'), new Date('2025-06-30')),
        items: [{ ingredientId: 'ing1', unitPrice: 10 }]
      }] as any;

      await service.publishPriceList('pl2');
      assert.strictEqual(mockList.status.isPublished(), true);
    });

    it('should update price item', async () => {
      mockList = {
        id: 'pl1',
        status: new PriceListStatus('Draft'),
        items: [{ ingredientId: 'ing1', unitPrice: 10, minimumQuantity: 1, discountPercent: 0 }]
      } as any;

      await service.updatePriceItem('pl1', 'ing1', 15, 5, 2);
      
      const updatedItem = mockList.items[0];
      assert.strictEqual(updatedItem.unitPrice, 15);
      assert.strictEqual(updatedItem.minimumQuantity, 5);
      assert.strictEqual(updatedItem.discountPercent, 2);
    });
  });
});
