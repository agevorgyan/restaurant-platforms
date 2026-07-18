import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { PurchaseOrderStatus } from './value-objects/purchase-order-status.value-object';
import { ApprovalStatus } from './value-objects/approval-status.value-object';
import { PurchaseOrderTotals } from './value-objects/purchase-order-totals.value-object';
import { validateCreatePurchaseOrder } from '../application/validation/purchase-order.schema';
import { PurchaseOrderDomainService } from './services/purchase-order.domain.service';
import { IPurchaseOrderRepository } from './repositories/purchase-order.repository.interface';
import { ISupplierRepository } from './repositories/supplier.repository.interface';
import { IPurchaseOrder } from './entities/purchase-order.interface';
import { ISupplier } from './entities/supplier.interface';
import { SupplierStatus } from './value-objects/supplier-status.value-object';

describe('Purchase Order Domain', () => {
  describe('Value Objects', () => {
    it('PurchaseOrderStatus should validate types', () => {
      assert.doesNotThrow(() => new PurchaseOrderStatus('Draft'));
      assert.doesNotThrow(() => new PurchaseOrderStatus('Submitted'));
      assert.throws(() => new PurchaseOrderStatus('Invalid' as any), /Invalid purchase order status/);
    });

    it('ApprovalStatus should validate types', () => {
      assert.doesNotThrow(() => new ApprovalStatus('Pending'));
      assert.throws(() => new ApprovalStatus('Invalid' as any), /Invalid approval status/);
    });

    it('PurchaseOrderTotals should calculate correctly and reject negatives', () => {
      const totals = new PurchaseOrderTotals(100, 10, 5); // 100 - 10 + 5
      assert.strictEqual(totals.total, 95);

      assert.throws(() => new PurchaseOrderTotals(-1, 0, 0), /Subtotal cannot be negative/);
      assert.throws(() => new PurchaseOrderTotals(100, -1, 0), /Discount cannot be negative/);
    });
  });

  describe('Validation', () => {
    it('should validate CreatePurchaseOrderDto', () => {
      const errors = validateCreatePurchaseOrder({
        restaurantId: '',
        supplierId: '',
        purchaseOrderNumber: '',
        currency: '',
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('supplierId is required'), true);
      assert.strictEqual(errors.includes('Purchase order must contain at least one line'), true);
    });

    it('should prevent duplicate ingredients in DTO', () => {
      const errors = validateCreatePurchaseOrder({
        restaurantId: 'r1',
        supplierId: 's1',
        purchaseOrderNumber: 'PO-01',
        currency: 'USD',
        lines: [
          { ingredientId: 'ing1', description: 'desc', orderedQuantity: 10, unitOfMeasure: 'kg', unitPrice: 1, discount: 0, taxRate: 0 },
          { ingredientId: 'ing1', description: 'desc', orderedQuantity: 5, unitOfMeasure: 'kg', unitPrice: 1, discount: 0, taxRate: 0 }
        ]
      });
      assert.strictEqual(errors.includes('Duplicate ingredients within the same purchase order are not allowed'), true);
    });
  });

  describe('Domain Service', () => {
    let mockPo: IPurchaseOrder;
    let findByOrderNumberResult: IPurchaseOrder | null = null;
    let mockSupplier: ISupplier | null = null;

    const mockPoRepo: IPurchaseOrderRepository = {
      findById: async () => mockPo,
      findByOrderNumber: async () => findByOrderNumberResult,
      save: async (po) => { mockPo = po; }
    };

    const mockSupplierRepo: ISupplierRepository = {
      findById: async () => mockSupplier,
      findBySupplierCode: async () => null,
      findByTaxNumber: async () => null,
      save: async () => {}
    };

    const service = new PurchaseOrderDomainService(mockPoRepo, mockSupplierRepo);

    it('should prevent creating PO for non-existent supplier', async () => {
      mockSupplier = null;
      try {
        await service.createPurchaseOrder('po1', {
          restaurantId: 'r1',
          supplierId: 's1',
          purchaseOrderNumber: 'PO-001',
          currency: 'USD',
          lines: [{ ingredientId: 'ing1', description: 'Desc', orderedQuantity: 10, unitOfMeasure: 'kg', unitPrice: 5, discount: 0, taxRate: 10 }]
        });
        assert.fail('Should throw error');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Supplier not found');
      }
    });

    it('should prevent creating PO for inactive supplier', async () => {
      mockSupplier = { status: new SupplierStatus('Draft') } as any;
      try {
        await service.createPurchaseOrder('po1', {
          restaurantId: 'r1',
          supplierId: 's1',
          purchaseOrderNumber: 'PO-001',
          currency: 'USD',
          lines: [{ ingredientId: 'ing1', description: 'Desc', orderedQuantity: 10, unitOfMeasure: 'kg', unitPrice: 5, discount: 0, taxRate: 10 }]
        });
        assert.fail('Should throw error');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Purchase order can only reference an Active supplier');
      }
    });

    it('should create PO and calculate totals', async () => {
      mockSupplier = { status: new SupplierStatus('Active') } as any;
      findByOrderNumberResult = null;

      const po = await service.createPurchaseOrder('po1', {
        restaurantId: 'r1',
        supplierId: 's1',
        purchaseOrderNumber: 'PO-001',
        currency: 'USD',
        lines: [
          { ingredientId: 'ing1', description: 'Desc1', orderedQuantity: 10, unitOfMeasure: 'kg', unitPrice: 10, discount: 10, taxRate: 10 },
          { ingredientId: 'ing2', description: 'Desc2', orderedQuantity: 5, unitOfMeasure: 'kg', unitPrice: 20, discount: 0, taxRate: 5 }
        ]
      });

      // Line 1: 10*10 = 100. Discount 10. Sub = 90. Tax = 10% of 90 = 9. Total = 99
      // Line 2: 5*20 = 100. Discount 0. Sub = 100. Tax = 5% of 100 = 5. Total = 105
      // PO Totals: Subtotal = 200, Discount = 10, Tax = 14. Total = 200 - 10 + 14 = 204

      assert.strictEqual(po.totals.subtotal, 200);
      assert.strictEqual(po.totals.discount, 10);
      assert.strictEqual(po.totals.tax, 14);
      assert.strictEqual(po.totals.total, 204);
      
      assert.strictEqual(po.lines[0].lineTotal, 99);
      assert.strictEqual(po.lines[1].lineTotal, 105);
      
      assert.strictEqual(po.status.isDraft(), true);
    });

    it('should allow submit, approve, and receive operations', async () => {
      await service.submitPurchaseOrder('po1');
      assert.strictEqual(mockPo.status.isSubmitted(), true);

      await service.approvePurchaseOrder('po1');
      assert.strictEqual(mockPo.status.isApproved(), true);

      // Partially receive
      await service.receiveGoods('po1', [
        { ingredientId: 'ing1', receivedQuantity: 5 }
      ]);
      assert.strictEqual(mockPo.status.isPartiallyReceived(), true);
      assert.strictEqual(mockPo.lines[0].receivedQuantity, 5);

      // Prevent over-receiving
      try {
        await service.receiveGoods('po1', [
          { ingredientId: 'ing1', receivedQuantity: 6 } // 5 + 6 = 11 > 10
        ]);
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Received quantity cannot exceed ordered quantity for ingredient ing1');
      }

      // Fully receive
      await service.receiveGoods('po1', [
        { ingredientId: 'ing1', receivedQuantity: 5 },
        { ingredientId: 'ing2', receivedQuantity: 5 }
      ]);
      assert.strictEqual(mockPo.status.isCompleted(), true);
    });

    it('should prevent mutating completed PO', async () => {
      try {
        await service.cancelPurchaseOrder('po1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Completed purchase orders are immutable');
      }
    });
  });
});
