import * as assert from 'node:assert';
import { MovementType } from './value-objects/movement-type.value-object';
import { MovementReason } from './value-objects/movement-reason.value-object';
import { MovementStatus } from './value-objects/movement-status.value-object';
import { MovementQuantity } from './value-objects/movement-quantity.value-object';
import { ReferenceType } from './value-objects/reference-type.value-object';
import { ReferenceId } from './value-objects/reference-id.value-object';
import { validateCreateStockMovement, validateUpdateStockMovement } from '../application/validation/stock-movement.schema';
import { StockMovementDomainService } from './services/stock-movement.domain.service';
import { IStockMovementRepository } from './repositories/stock-movement.repository.interface';
import { IStockMovement } from './entities/stock-movement.interface';

describe('StockMovement Domain', () => {
  describe('Value Objects', () => {
    it('MovementType should validate types', () => {
      assert.doesNotThrow(() => new MovementType('StockIn'));
      assert.doesNotThrow(() => new MovementType('TransferOut'));
      assert.throws(() => new MovementType('Invalid' as any), /Invalid movement type/);
    });

    it('MovementReason should not be empty', () => {
      assert.doesNotThrow(() => new MovementReason('Supplier delivery'));
      assert.throws(() => new MovementReason('  '), /Movement reason must not be empty/);
    });

    it('MovementStatus should validate statuses', () => {
      assert.doesNotThrow(() => new MovementStatus('Draft'));
      assert.doesNotThrow(() => new MovementStatus('Posted'));
      assert.throws(() => new MovementStatus('Deleted' as any), /Invalid movement status/);
    });

    it('MovementQuantity should be greater than zero', () => {
      assert.doesNotThrow(() => new MovementQuantity(50));
      assert.throws(() => new MovementQuantity(0), /Movement quantity must be greater than zero/);
      assert.throws(() => new MovementQuantity(-10), /Movement quantity must be greater than zero/);
    });

    it('ReferenceType should validate types', () => {
      assert.doesNotThrow(() => new ReferenceType('PurchaseOrder'));
      assert.doesNotThrow(() => new ReferenceType('Manual'));
      assert.throws(() => new ReferenceType('Invoice' as any), /Invalid reference type/);
    });

    it('ReferenceId should not be empty', () => {
      assert.doesNotThrow(() => new ReferenceId('PO-123'));
      assert.throws(() => new ReferenceId(''), /Reference ID must not be empty/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateStockMovementDto', () => {
      const errors = validateCreateStockMovement({
        restaurantId: '',
        inventoryId: '',
        movementNumber: '',
        movementType: '',
        reason: '',
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('inventoryId is required'), true);
      assert.strictEqual(errors.includes('movementNumber is required'), true);
      assert.strictEqual(errors.includes('movementType is required'), true);
      assert.strictEqual(errors.includes('reason is required'), true);
      assert.strictEqual(errors.includes('Movement must contain at least one line'), true);
    });

    it('should prevent duplicate ingredients in DTO', () => {
      const errors = validateCreateStockMovement({
        restaurantId: 'r1',
        inventoryId: 'i1',
        movementNumber: 'M01',
        movementType: 'StockIn',
        reason: 'Delivery',
        lines: [
          { ingredientId: 'ing1', quantity: 10, unitOfMeasure: 'Kg' },
          { ingredientId: 'ing1', quantity: 5, unitOfMeasure: 'Kg' }
        ]
      });
      assert.strictEqual(errors.includes('Duplicate ingredients within the same movement are not allowed'), true);
    });

    it('should validate UpdateStockMovementDto', () => {
      const errors = validateUpdateStockMovement({
        reason: '  ',
        lines: [{ ingredientId: '', quantity: 0, unitOfMeasure: '' }]
      });
      assert.strictEqual(errors.includes('reason cannot be empty'), true);
      assert.strictEqual(errors.includes('Line [0]: ingredientId is required'), true);
      assert.strictEqual(errors.includes('Line [0]: quantity must be greater than zero'), true);
    });
  });

  describe('Domain Service', () => {
    let mockMovement: IStockMovement;
    let findByNumberResult: IStockMovement | null = null;

    const mockRepo: IStockMovementRepository = {
      findById: async () => mockMovement,
      findByMovementNumber: async () => findByNumberResult,
      save: async (mov) => { mockMovement = mov; }
    };

    it('should create movement in Draft state', async () => {
      findByNumberResult = null;
      const service = new StockMovementDomainService(mockRepo);
      const movement = await service.createMovement('mov1', {
        restaurantId: 'r1',
        inventoryId: 'i1',
        movementNumber: 'SM-001',
        movementType: 'StockIn',
        reason: 'Initial load',
        lines: [
          { ingredientId: 'ing1', quantity: 100, unitOfMeasure: 'Piece' }
        ]
      });

      assert.strictEqual(movement.id, 'mov1');
      assert.strictEqual(movement.status.value, 'Draft');
      assert.strictEqual(movement.lines.length, 1);
    });

    it('should post a draft movement', async () => {
      const service = new StockMovementDomainService(mockRepo);
      await service.postMovement('mov1');
      assert.strictEqual(mockMovement.status.isPosted(), true);
    });

    it('should prevent editing a posted movement', async () => {
      const service = new StockMovementDomainService(mockRepo);
      try {
        await service.updateMovement('mov1', { reason: 'New reason' });
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Posted movements are immutable');
      }
    });

    it('should prevent cancelling a posted movement', async () => {
      const service = new StockMovementDomainService(mockRepo);
      try {
        await service.cancelMovement('mov1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Posted movements are immutable and cannot be cancelled');
      }
    });

    it('should allow cancelling a draft movement', async () => {
      const service = new StockMovementDomainService(mockRepo);
      // Reset to draft
      mockMovement.status = new MovementStatus('Draft');
      
      await service.cancelMovement('mov1');
      assert.strictEqual(mockMovement.status.isCancelled(), true);
    });

    it('should prevent posting a cancelled movement', async () => {
      const service = new StockMovementDomainService(mockRepo);
      try {
        await service.postMovement('mov1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Cancelled movements cannot be posted');
      }
    });
  });
});
