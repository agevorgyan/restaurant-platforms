import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { GoodsReceiptStatus } from './value-objects/goods-receipt-status.value-object';
import { ReceivingResult } from './value-objects/receiving-result.value-object';
import { validateCreateGoodsReceipt } from '../application/validation/goods-receipt.schema';
import { GoodsReceiptDomainService } from './services/goods-receipt.domain.service';
import { IGoodsReceiptRepository } from './repositories/goods-receipt.repository.interface';
import { IPurchaseOrderRepository } from './repositories/purchase-order.repository.interface';
import { IGoodsReceipt } from './entities/goods-receipt.interface';
import { IPurchaseOrder } from './entities/purchase-order.interface';

describe('Goods Receipt Domain', () => {
  describe('Value Objects', () => {
    it('GoodsReceiptStatus should validate types', () => {
      assert.doesNotThrow(() => new GoodsReceiptStatus('Draft'));
      assert.doesNotThrow(() => new GoodsReceiptStatus('Posted'));
      assert.throws(() => new GoodsReceiptStatus('Invalid' as any), /Invalid goods receipt status/);
    });

    it('ReceivingResult should validate types', () => {
      assert.doesNotThrow(() => new ReceivingResult('Accepted'));
      assert.doesNotThrow(() => new ReceivingResult('PartiallyAccepted'));
      assert.throws(() => new ReceivingResult('Invalid' as any), /Invalid receiving result/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateGoodsReceiptDto', () => {
      const errors = validateCreateGoodsReceipt({
        restaurantId: '',
        purchaseOrderId: '',
        receiptNumber: '',
        receivedBy: '',
        receiptDate: new Date('invalid'),
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('purchaseOrderId is required'), true);
      assert.strictEqual(errors.includes('receiptNumber is required'), true);
      assert.strictEqual(errors.includes('receivedBy is required'), true);
      assert.strictEqual(errors.includes('receiptDate must be a valid date'), true);
      assert.strictEqual(errors.includes('Goods receipt must contain at least one line'), true);
    });

    it('should prevent invalid quantities in lines', () => {
      const errors = validateCreateGoodsReceipt({
        restaurantId: 'r1',
        purchaseOrderId: 'po1',
        receiptNumber: 'GR-01',
        receivedBy: 'John',
        receiptDate: new Date(),
        lines: [
          { purchaseOrderLineId: 'pol1', ingredientId: 'ing1', orderedQuantity: 10, receivedQuantity: 10, acceptedQuantity: 11, rejectedQuantity: -1, unitOfMeasure: 'kg' },
          { purchaseOrderLineId: 'pol2', ingredientId: 'ing2', orderedQuantity: 10, receivedQuantity: 10, acceptedQuantity: 5, rejectedQuantity: 4, unitOfMeasure: 'kg' }
        ]
      });
      assert.strictEqual(errors.includes('Line [0]: rejectedQuantity cannot be negative'), true);
      assert.strictEqual(errors.includes('Line [0]: acceptedQuantity cannot exceed ordered quantity'), true);
      assert.strictEqual(errors.includes('Line [1]: acceptedQuantity plus rejectedQuantity must equal receivedQuantity'), true);
    });
  });

  describe('Domain Service', () => {
    let mockGr: IGoodsReceipt;
    let mockPo: IPurchaseOrder | null = null;
    const findByReceiptNumberResult: IGoodsReceipt | null = null;

    const mockGrRepo: IGoodsReceiptRepository = {
      findById: async () => mockGr,
      findByReceiptNumber: async () => findByReceiptNumberResult,
      save: async (gr) => { mockGr = gr; }
    };

    const mockPoRepo: IPurchaseOrderRepository = {
      findById: async () => mockPo,
      findByOrderNumber: async () => null,
      save: async () => {}
    };

    const service = new GoodsReceiptDomainService(mockGrRepo, mockPoRepo);

    it('should prevent creating GR if PO not found', async () => {
      mockPo = null;
      try {
        await service.createGoodsReceipt('gr1', {
          restaurantId: 'r1',
          purchaseOrderId: 'po1',
          receiptNumber: 'GR-01',
          receivedBy: 'John',
          receiptDate: new Date(),
          lines: [{ purchaseOrderLineId: 'pol1', ingredientId: 'ing1', orderedQuantity: 10, receivedQuantity: 10, acceptedQuantity: 10, rejectedQuantity: 0, unitOfMeasure: 'kg' }]
        });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Purchase order not found');
      }
    });

    it('should create GR when valid', async () => {
      mockPo = {
        id: 'po1',
        lines: [{ ingredientId: 'ing1' } as any]
      } as any;
      
      const gr = await service.createGoodsReceipt('gr1', {
        restaurantId: 'r1',
        purchaseOrderId: 'po1',
        receiptNumber: 'GR-01',
        receivedBy: 'John',
        receiptDate: new Date(),
        lines: [{ purchaseOrderLineId: 'pol1', ingredientId: 'ing1', orderedQuantity: 10, receivedQuantity: 10, acceptedQuantity: 10, rejectedQuantity: 0, unitOfMeasure: 'kg' }]
      });

      assert.strictEqual(gr.id, 'gr1');
      assert.strictEqual(gr.status.isDraft(), true);
    });

    it('should post GR', async () => {
      await service.postGoodsReceipt('gr1');
      assert.strictEqual(mockGr.status.isPosted(), true);
    });

    it('should prevent modifying posted GR', async () => {
      try {
        await service.cancelGoodsReceipt('gr1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Posted receipts are immutable');
      }
    });
  });
});
