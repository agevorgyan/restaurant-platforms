import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { ReturnStatus } from './value-objects/return-status.value-object';
import { ReturnReason } from './value-objects/return-reason.value-object';
import { ReturnAuthorization } from './value-objects/return-authorization.value-object';
import { validateCreatePurchaseReturn } from '../application/validation/purchase-return.schema';
import { PurchaseReturnDomainService } from './services/purchase-return.domain.service';
import { IPurchaseReturnRepository } from './repositories/purchase-return.repository.interface';
import { IGoodsReceiptRepository } from './repositories/goods-receipt.repository.interface';
import { IPurchaseReturn } from './entities/purchase-return.interface';
import { IGoodsReceipt } from './entities/goods-receipt.interface';

describe('Purchase Return Domain', () => {
  describe('Value Objects', () => {
    it('ReturnStatus should validate types', () => {
      assert.doesNotThrow(() => new ReturnStatus('Draft'));
      assert.doesNotThrow(() => new ReturnStatus('Authorized'));
      assert.doesNotThrow(() => new ReturnStatus('Posted'));
      assert.throws(() => new ReturnStatus('Invalid' as any), /Invalid return status/);
    });

    it('ReturnReason should validate types', () => {
      assert.doesNotThrow(() => new ReturnReason('Damaged'));
      assert.doesNotThrow(() => new ReturnReason('Expired'));
      assert.throws(() => new ReturnReason('Invalid' as any), /Invalid return reason/);
    });

    it('ReturnAuthorization should validate parameters', () => {
      assert.doesNotThrow(() => new ReturnAuthorization('AUTH-01', 'John', new Date()));
      assert.throws(() => new ReturnAuthorization('', 'John', new Date()), /Authorization code cannot be empty/);
    });
  });

  describe('Validation', () => {
    it('should validate CreatePurchaseReturnDto', () => {
      const errors = validateCreatePurchaseReturn({
        restaurantId: '',
        supplierId: '',
        goodsReceiptId: '',
        returnNumber: '',
        reason: '',
        returnDate: new Date('invalid'),
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('supplierId is required'), true);
      assert.strictEqual(errors.includes('goodsReceiptId is required'), true);
      assert.strictEqual(errors.includes('returnNumber is required'), true);
      assert.strictEqual(errors.includes('reason is required'), true);
      assert.strictEqual(errors.includes('returnDate must be a valid date'), true);
      assert.strictEqual(errors.includes('Purchase return must contain at least one line'), true);
    });

    it('should prevent duplicate goods receipt lines', () => {
      const errors = validateCreatePurchaseReturn({
        restaurantId: 'r1',
        supplierId: 's1',
        goodsReceiptId: 'gr1',
        returnNumber: 'RET-01',
        reason: 'Damaged',
        returnDate: new Date(),
        lines: [
          { goodsReceiptLineId: 'grl1', ingredientId: 'ing1', returnedQuantity: 10, acceptedReturnQuantity: 0, unitOfMeasure: 'kg' },
          { goodsReceiptLineId: 'grl1', ingredientId: 'ing2', returnedQuantity: 5, acceptedReturnQuantity: 0, unitOfMeasure: 'kg' }
        ]
      });
      assert.strictEqual(errors.includes('Duplicate goods receipt lines are not allowed within the same return'), true);
    });
  });

  describe('Domain Service', () => {
    let mockReturn: IPurchaseReturn;
    const findByReturnNumberResult: IPurchaseReturn | null = null;
    let mockGoodsReceipt: IGoodsReceipt | null = null;

    const mockReturnRepo: IPurchaseReturnRepository = {
      findById: async () => mockReturn,
      findByReturnNumber: async () => findByReturnNumberResult,
      save: async (ret) => { mockReturn = ret; }
    };

    const mockGrRepo: IGoodsReceiptRepository = {
      findById: async () => mockGoodsReceipt,
      findByReceiptNumber: async () => null,
      save: async () => {}
    };

    const service = new PurchaseReturnDomainService(mockReturnRepo, mockGrRepo);

    it('should prevent creating return for non-existent goods receipt', async () => {
      mockGoodsReceipt = null;
      try {
        await service.createPurchaseReturn('ret1', {
          restaurantId: 'r1',
          supplierId: 's1',
          goodsReceiptId: 'gr1',
          returnNumber: 'RET-01',
          reason: 'Damaged',
          returnDate: new Date(),
          lines: [{ goodsReceiptLineId: 'grl1', ingredientId: 'ing1', returnedQuantity: 10, acceptedReturnQuantity: 0, unitOfMeasure: 'kg' }]
        });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Goods receipt not found');
      }
    });

    it('should prevent returning more than received', async () => {
      mockGoodsReceipt = {
        id: 'gr1',
        lines: [{ ingredientId: 'ing1', receivedQuantity: 5 } as any]
      } as any;
      
      try {
        await service.createPurchaseReturn('ret1', {
          restaurantId: 'r1',
          supplierId: 's1',
          goodsReceiptId: 'gr1',
          returnNumber: 'RET-01',
          reason: 'Damaged',
          returnDate: new Date(),
          lines: [{ goodsReceiptLineId: 'grl1', ingredientId: 'ing1', returnedQuantity: 10, acceptedReturnQuantity: 0, unitOfMeasure: 'kg' }]
        });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Returned quantity cannot exceed the quantity received on the referenced goods receipt line for ingredient ing1');
      }
    });

    it('should create return', async () => {
      mockGoodsReceipt = {
        id: 'gr1',
        lines: [{ ingredientId: 'ing1', receivedQuantity: 20 } as any]
      } as any;
      
      const ret = await service.createPurchaseReturn('ret1', {
        restaurantId: 'r1',
        supplierId: 's1',
        goodsReceiptId: 'gr1',
        returnNumber: 'RET-01',
        reason: 'Damaged',
        returnDate: new Date(),
        lines: [{ goodsReceiptLineId: 'grl1', ingredientId: 'ing1', returnedQuantity: 10, acceptedReturnQuantity: 0, unitOfMeasure: 'kg' }]
      });

      assert.strictEqual(ret.id, 'ret1');
      assert.strictEqual(ret.status.isDraft(), true);
      assert.strictEqual(ret.lines[0].returnedQuantity, 10);
    });

    it('should allow authorize and post operations', async () => {
      await service.authorizePurchaseReturn('ret1', 'AUTH-123', 'John', new Date());
      assert.strictEqual(mockReturn.status.isAuthorized(), true);

      await service.postPurchaseReturn('ret1', 'CREDIT-999');
      assert.strictEqual(mockReturn.status.isPosted(), true);
      assert.strictEqual(mockReturn.supplierCreditReference?.value, 'CREDIT-999');
    });

    it('should prevent modifying posted return', async () => {
      try {
        await service.cancelPurchaseReturn('ret1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Posted returns are immutable');
      }
    });
  });
});
