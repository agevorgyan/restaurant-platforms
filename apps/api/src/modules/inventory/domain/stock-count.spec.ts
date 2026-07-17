import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { CountMethod } from './value-objects/count-method.value-object';
import { CountStatus } from './value-objects/count-status.value-object';
import { CountVariance } from './value-objects/count-variance.value-object';
import { RecountPolicy } from './value-objects/recount-policy.value-object';
import { validateCreateStockCount, validateUpdateStockCount } from '../application/validation/stock-count.schema';
import { StockCountDomainService } from './services/stock-count.domain.service';
import { IStockCountRepository } from './repositories/stock-count.repository.interface';
import { IStockCount } from './entities/stock-count.interface';

describe('StockCount Domain', () => {
  describe('Value Objects', () => {
    it('CountMethod should validate types', () => {
      assert.doesNotThrow(() => new CountMethod('Full'));
      assert.doesNotThrow(() => new CountMethod('Cycle'));
      assert.throws(() => new CountMethod('Invalid' as any), /Invalid count method/);
    });

    it('CountStatus should validate statuses', () => {
      assert.doesNotThrow(() => new CountStatus('Draft'));
      assert.doesNotThrow(() => new CountStatus('Completed'));
      assert.throws(() => new CountStatus('Deleted' as any), /Invalid count status/);
    });

    it('CountVariance should enforce logic', () => {
      assert.doesNotThrow(() => new CountVariance(10, 8, -2));
      assert.doesNotThrow(() => new CountVariance(5, 10, 5));
      assert.throws(() => new CountVariance(-1, 5, 6), /Expected quantity cannot be negative/);
      assert.throws(() => new CountVariance(5, -1, -6), /Counted quantity cannot be negative/);
      assert.throws(() => new CountVariance(10, 8, -1), /Variance must equal counted quantity minus expected quantity/);
    });

    it('RecountPolicy should enforce state transitions', () => {
      assert.strictEqual(RecountPolicy.canRecount('Draft'), true);
      assert.strictEqual(RecountPolicy.canRecount('InProgress'), true);
      assert.strictEqual(RecountPolicy.canRecount('Completed'), true);
      assert.strictEqual(RecountPolicy.canRecount('Approved'), false);
      assert.strictEqual(RecountPolicy.canRecount('Cancelled'), false);
    });
  });

  describe('Validation', () => {
    it('should validate CreateStockCountDto', () => {
      const errors = validateCreateStockCount({
        restaurantId: '',
        inventoryId: '',
        countNumber: '',
        method: '',
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('inventoryId is required'), true);
      assert.strictEqual(errors.includes('countNumber is required'), true);
      assert.strictEqual(errors.includes('method is required'), true);
      assert.strictEqual(errors.includes('Stock count must contain at least one line'), true);
    });

    it('should prevent duplicate ingredients in DTO', () => {
      const errors = validateCreateStockCount({
        restaurantId: 'r1',
        inventoryId: 'i1',
        countNumber: 'SC-01',
        method: 'Spot',
        lines: [
          { ingredientId: 'ing1', expectedQuantity: 10, countedQuantity: 8, variance: -2, unitOfMeasure: 'Kg' },
          { ingredientId: 'ing1', expectedQuantity: 5, countedQuantity: 0, variance: -5, unitOfMeasure: 'Kg' }
        ]
      });
      assert.strictEqual(errors.includes('Duplicate ingredients within the same stock count are not allowed'), true);
    });

    it('should validate UpdateStockCountDto', () => {
      const errors = validateUpdateStockCount({
        lines: [{ ingredientId: '', expectedQuantity: -1, countedQuantity: -1, variance: 0, unitOfMeasure: '' }]
      });
      assert.strictEqual(errors.includes('Line [0]: ingredientId is required'), true);
      assert.strictEqual(errors.includes('Line [0]: expectedQuantity cannot be negative'), true);
    });
  });

  describe('Domain Service', () => {
    let mockCount: IStockCount;
    let findByNumberResult: IStockCount | null = null;

    const mockRepo: IStockCountRepository = {
      findById: async () => mockCount,
      findByCountNumber: async () => findByNumberResult,
      save: async (count) => { mockCount = count; }
    };

    it('should create count in Draft state', async () => {
      findByNumberResult = null;
      const service = new StockCountDomainService(mockRepo);
      const count = await service.createCount('sc1', {
        restaurantId: 'r1',
        inventoryId: 'i1',
        countNumber: 'SC-001',
        method: 'Full',
        lines: [
          { ingredientId: 'ing1', expectedQuantity: 100, countedQuantity: 80, variance: -20, unitOfMeasure: 'Piece' }
        ]
      });

      assert.strictEqual(count.id, 'sc1');
      assert.strictEqual(count.status.value, 'Draft');
    });

    it('should prevent updates to Approved counts', async () => {
      const service = new StockCountDomainService(mockRepo);
      mockCount.status = new CountStatus('Approved');
      try {
        await service.updateCount('sc1', { notes: 'update' });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Approved or Cancelled counts are immutable');
      }
    });

    it('should allow starting a Draft count', async () => {
      const service = new StockCountDomainService(mockRepo);
      mockCount.status = new CountStatus('Draft');
      await service.startCount('sc1');
      assert.strictEqual(mockCount.status.isInProgress(), true);
    });

    it('should allow completing an InProgress count', async () => {
      const service = new StockCountDomainService(mockRepo);
      await service.completeCount('sc1');
      assert.strictEqual(mockCount.status.isCompleted(), true);
    });

    it('should only approve a Completed count', async () => {
      const service = new StockCountDomainService(mockRepo);
      // Already completed from previous test
      await service.approveCount('sc1');
      assert.strictEqual(mockCount.status.isApproved(), true);
    });

    it('should prevent cancelling an Approved count', async () => {
      const service = new StockCountDomainService(mockRepo);
      try {
        await service.cancelCount('sc1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Approved counts are immutable and cannot be cancelled');
      }
    });

    it('should allow recounting before approval', async () => {
      const service = new StockCountDomainService(mockRepo);
      mockCount.status = new CountStatus('Completed');
      await service.recount('sc1', [
        { ingredientId: 'ing1', expectedQuantity: 100, countedQuantity: 95, variance: -5, unitOfMeasure: 'Piece' }
      ]);
      assert.strictEqual(mockCount.status.isInProgress(), true); // Restarted
      assert.strictEqual(mockCount.lines[0].countedQuantity, 95);
    });

    it('should prevent recounting after approval', async () => {
      const service = new StockCountDomainService(mockRepo);
      mockCount.status = new CountStatus('Approved');
      try {
        await service.recount('sc1', []);
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Recount is allowed only before approval');
      }
    });
  });
});
