import * as assert from 'node:assert';
import { AdjustmentType } from './value-objects/adjustment-type.value-object';
import { AdjustmentReason } from './value-objects/adjustment-reason.value-object';
import { AdjustmentStatus } from './value-objects/adjustment-status.value-object';
import { ApprovalStatus } from './value-objects/approval-status.value-object';
import { AdjustmentQuantity } from './value-objects/adjustment-quantity.value-object';
import { validateCreateInventoryAdjustment, validateUpdateInventoryAdjustment } from '../application/validation/inventory-adjustment.schema';
import { InventoryAdjustmentDomainService } from './services/inventory-adjustment.domain.service';
import { IInventoryAdjustmentRepository } from './repositories/inventory-adjustment.repository.interface';
import { IInventoryAdjustment } from './entities/inventory-adjustment.interface';

describe('InventoryAdjustment Domain', () => {
  describe('Value Objects', () => {
    it('AdjustmentType should validate types', () => {
      assert.doesNotThrow(() => new AdjustmentType('Increase'));
      assert.doesNotThrow(() => new AdjustmentType('Damage'));
      assert.throws(() => new AdjustmentType('Invalid' as any), /Invalid adjustment type/);
    });

    it('AdjustmentReason should not be empty', () => {
      assert.doesNotThrow(() => new AdjustmentReason('Spoilage'));
      assert.throws(() => new AdjustmentReason('  '), /Adjustment reason must not be empty/);
    });

    it('AdjustmentStatus should validate statuses', () => {
      assert.doesNotThrow(() => new AdjustmentStatus('Draft'));
      assert.doesNotThrow(() => new AdjustmentStatus('Posted'));
      assert.throws(() => new AdjustmentStatus('Deleted' as any), /Invalid adjustment status/);
    });

    it('ApprovalStatus should validate statuses', () => {
      assert.doesNotThrow(() => new ApprovalStatus('Pending'));
      assert.doesNotThrow(() => new ApprovalStatus('NotRequired'));
      assert.throws(() => new ApprovalStatus('ApprovedByBoss' as any), /Invalid approval status/);
    });

    it('AdjustmentQuantity should enforce actual minus expected', () => {
      assert.doesNotThrow(() => new AdjustmentQuantity(10, 8, -2));
      assert.doesNotThrow(() => new AdjustmentQuantity(5, 10, 5));
      assert.throws(() => new AdjustmentQuantity(-1, 5, 6), /Expected quantity cannot be negative/);
      assert.throws(() => new AdjustmentQuantity(5, -1, -6), /Actual quantity cannot be negative/);
      assert.throws(() => new AdjustmentQuantity(10, 8, -1), /Difference quantity must equal actual minus expected/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateInventoryAdjustmentDto', () => {
      const errors = validateCreateInventoryAdjustment({
        restaurantId: '',
        inventoryId: '',
        adjustmentNumber: '',
        adjustmentType: '',
        reason: '',
        approvalStatus: '',
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('inventoryId is required'), true);
      assert.strictEqual(errors.includes('adjustmentNumber is required'), true);
      assert.strictEqual(errors.includes('adjustmentType is required'), true);
      assert.strictEqual(errors.includes('reason is required'), true);
      assert.strictEqual(errors.includes('approvalStatus is required'), true);
      assert.strictEqual(errors.includes('Adjustment must contain at least one line'), true);
    });

    it('should prevent duplicate ingredients in DTO', () => {
      const errors = validateCreateInventoryAdjustment({
        restaurantId: 'r1',
        inventoryId: 'i1',
        adjustmentNumber: 'ADJ-01',
        adjustmentType: 'Loss',
        reason: 'Lost',
        approvalStatus: 'Pending',
        lines: [
          { ingredientId: 'ing1', expectedQuantity: 10, actualQuantity: 8, differenceQuantity: -2, unitOfMeasure: 'Kg' },
          { ingredientId: 'ing1', expectedQuantity: 5, actualQuantity: 0, differenceQuantity: -5, unitOfMeasure: 'Kg' }
        ]
      });
      assert.strictEqual(errors.includes('Duplicate ingredients within the same adjustment are not allowed'), true);
    });

    it('should validate UpdateInventoryAdjustmentDto', () => {
      const errors = validateUpdateInventoryAdjustment({
        reason: '  ',
        lines: [{ ingredientId: '', expectedQuantity: -1, actualQuantity: -1, differenceQuantity: 0, unitOfMeasure: '' }]
      });
      assert.strictEqual(errors.includes('reason cannot be empty'), true);
      assert.strictEqual(errors.includes('Line [0]: ingredientId is required'), true);
      assert.strictEqual(errors.includes('Line [0]: expectedQuantity cannot be negative'), true);
    });
  });

  describe('Domain Service', () => {
    let mockAdjustment: IInventoryAdjustment;
    let findByNumberResult: IInventoryAdjustment | null = null;

    const mockRepo: IInventoryAdjustmentRepository = {
      findById: async () => mockAdjustment,
      findByAdjustmentNumber: async () => findByNumberResult,
      save: async (adj) => { mockAdjustment = adj; }
    };

    it('should create adjustment in Draft state', async () => {
      findByNumberResult = null;
      const service = new InventoryAdjustmentDomainService(mockRepo);
      const adjustment = await service.createAdjustment('adj1', {
        restaurantId: 'r1',
        inventoryId: 'i1',
        adjustmentNumber: 'ADJ-001',
        adjustmentType: 'Damage',
        reason: 'Water leak',
        approvalStatus: 'Pending',
        lines: [
          { ingredientId: 'ing1', expectedQuantity: 100, actualQuantity: 80, differenceQuantity: -20, unitOfMeasure: 'Piece' }
        ]
      });

      assert.strictEqual(adjustment.id, 'adj1');
      assert.strictEqual(adjustment.status.value, 'Draft');
      assert.strictEqual(adjustment.approvalStatus.value, 'Pending');
    });

    it('should approve an adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      await service.approveAdjustment('adj1');
      assert.strictEqual(mockAdjustment.status.isApproved(), true);
      assert.strictEqual(mockAdjustment.approvalStatus.isApprovedOrNotRequired(), true);
    });

    it('should post an approved adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      await service.postAdjustment('adj1');
      assert.strictEqual(mockAdjustment.status.isPosted(), true);
    });

    it('should prevent editing a posted adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      try {
        await service.updateAdjustment('adj1', { reason: 'New reason' });
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Posted adjustments are immutable');
      }
    });

    it('should prevent cancelling a posted adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      try {
        await service.cancelAdjustment('adj1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Posted adjustments are immutable and cannot be cancelled');
      }
    });

    it('should allow cancelling a draft adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      mockAdjustment.status = new AdjustmentStatus('Draft');
      
      await service.cancelAdjustment('adj1');
      assert.strictEqual(mockAdjustment.status.isCancelled(), true);
    });

    it('should prevent posting a cancelled adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      try {
        await service.postAdjustment('adj1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Cancelled or rejected adjustments cannot be posted');
      }
    });

    it('should reject a pending adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      mockAdjustment.status = new AdjustmentStatus('Draft');
      mockAdjustment.approvalStatus = new ApprovalStatus('Pending');

      await service.rejectAdjustment('adj1');
      assert.strictEqual(mockAdjustment.status.isRejected(), true);
      assert.strictEqual(mockAdjustment.approvalStatus.isRejected(), true);
    });

    it('should prevent posting an unapproved adjustment', async () => {
      const service = new InventoryAdjustmentDomainService(mockRepo);
      mockAdjustment.status = new AdjustmentStatus('Draft');
      mockAdjustment.approvalStatus = new ApprovalStatus('Pending');

      try {
        await service.postAdjustment('adj1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only Approved or NotRequired adjustments may be posted');
      }
    });
  });
});
