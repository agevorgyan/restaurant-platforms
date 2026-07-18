import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { InvoiceStatus } from './value-objects/invoice-status.value-object';
import { InvoiceTotals } from './value-objects/invoice-totals.value-object';
import { DueDate } from './value-objects/due-date.value-object';
import { validateCreatePurchaseInvoice } from '../application/validation/purchase-invoice.schema';
import { PurchaseInvoiceDomainService } from './services/purchase-invoice.domain.service';
import { IPurchaseInvoiceRepository } from './repositories/purchase-invoice.repository.interface';
import { ISupplierRepository } from './repositories/supplier.repository.interface';
import { IPurchaseInvoice } from './entities/purchase-invoice.interface';

describe('Purchase Invoice Domain', () => {
  describe('Value Objects', () => {
    it('InvoiceStatus should validate types', () => {
      assert.doesNotThrow(() => new InvoiceStatus('Draft'));
      assert.doesNotThrow(() => new InvoiceStatus('Matched'));
      assert.throws(() => new InvoiceStatus('Invalid' as any), /Invalid invoice status/);
    });

    it('InvoiceTotals should calculate correctly', () => {
      const totals = new InvoiceTotals(100, 10, 5); // 100 + 10 - 5
      assert.strictEqual(totals.total, 105);

      assert.throws(() => new InvoiceTotals(-1, 0, 0), /Subtotal cannot be negative/);
      assert.throws(() => new InvoiceTotals(100, -1, 0), /Tax cannot be negative/);
      assert.throws(() => new InvoiceTotals(100, 0, -1), /Discount cannot be negative/);
    });

    it('DueDate should track overdue status', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const past = new Date();
      past.setDate(past.getDate() - 1);

      assert.strictEqual(new DueDate(future).isOverdue(), false);
      assert.strictEqual(new DueDate(past).isOverdue(), true);
    });
  });

  describe('Validation', () => {
    it('should validate CreatePurchaseInvoiceDto', () => {
      const errors = validateCreatePurchaseInvoice({
        restaurantId: '',
        supplierId: '',
        invoiceNumber: '',
        supplierInvoiceNumber: '',
        currency: '',
        invoiceDate: new Date('invalid'),
        dueDate: new Date('invalid'),
        lines: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('supplierId is required'), true);
      assert.strictEqual(errors.includes('invoiceNumber is required'), true);
      assert.strictEqual(errors.includes('Purchase invoice must contain at least one line'), true);
    });

    it('should prevent duplicate purchase order lines', () => {
      const errors = validateCreatePurchaseInvoice({
        restaurantId: 'r1',
        supplierId: 's1',
        invoiceNumber: 'INV-01',
        supplierInvoiceNumber: 'SINV-01',
        currency: 'USD',
        invoiceDate: new Date(),
        dueDate: new Date(),
        lines: [
          { purchaseOrderLineId: 'pol1', ingredientId: 'ing1', description: 'Desc', quantity: 10, unitOfMeasure: 'kg', unitPrice: 1, discount: 0, taxRate: 0 },
          { purchaseOrderLineId: 'pol1', ingredientId: 'ing2', description: 'Desc', quantity: 5, unitOfMeasure: 'kg', unitPrice: 1, discount: 0, taxRate: 0 }
        ]
      });
      assert.strictEqual(errors.includes('Duplicate purchase order lines are not allowed within the same invoice'), true);
    });
  });

  describe('Domain Service', () => {
    let mockInvoice: IPurchaseInvoice;
    let findByInvoiceNumberResult: IPurchaseInvoice | null = null;
    let findBySupplierInvoiceResult: IPurchaseInvoice | null = null;
    let mockSupplier: any = null;

    const mockInvoiceRepo: IPurchaseInvoiceRepository = {
      findById: async () => mockInvoice,
      findByInvoiceNumber: async () => findByInvoiceNumberResult,
      findBySupplierInvoiceNumber: async () => findBySupplierInvoiceResult,
      save: async (inv) => { mockInvoice = inv; }
    };

    const mockSupplierRepo: ISupplierRepository = {
      findById: async () => mockSupplier,
      findBySupplierCode: async () => null,
      findByTaxNumber: async () => null,
      save: async () => {}
    };

    const service = new PurchaseInvoiceDomainService(mockInvoiceRepo, mockSupplierRepo);

    it('should prevent creating invoice for non-existent supplier', async () => {
      mockSupplier = null;
      try {
        await service.createPurchaseInvoice('inv1', {
          restaurantId: 'r1',
          supplierId: 's1',
          invoiceNumber: 'INV-01',
          supplierInvoiceNumber: 'SINV-01',
          currency: 'USD',
          invoiceDate: new Date(),
          dueDate: new Date(),
          lines: [{ ingredientId: 'ing1', description: 'Desc', quantity: 10, unitOfMeasure: 'kg', unitPrice: 5, discount: 0, taxRate: 0 }]
        });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Supplier not found');
      }
    });

    it('should create invoice and calculate totals', async () => {
      mockSupplier = { id: 's1' };
      findByInvoiceNumberResult = null;
      findBySupplierInvoiceResult = null;

      const invoice = await service.createPurchaseInvoice('inv1', {
        restaurantId: 'r1',
        supplierId: 's1',
        invoiceNumber: 'INV-01',
        supplierInvoiceNumber: 'SINV-01',
        currency: 'USD',
        invoiceDate: new Date(),
        dueDate: new Date(),
        lines: [
          { ingredientId: 'ing1', description: 'Desc', quantity: 10, unitOfMeasure: 'kg', unitPrice: 10, discount: 10, taxRate: 10 }
        ]
      });

      // Quantity 10 * 10 = 100. Discount = 10. Sub = 90. Tax = 10% of 90 = 9. Total = 99
      assert.strictEqual(invoice.subtotal, 100);
      assert.strictEqual(invoice.discount, 10);
      assert.strictEqual(invoice.tax, 9);
      assert.strictEqual(invoice.total, 99);
      assert.strictEqual(invoice.status.isDraft(), true);
    });

    it('should allow post and match operations', async () => {
      await service.postPurchaseInvoice('inv1');
      assert.strictEqual(mockInvoice.status.isPosted(), true);

      await service.matchPurchaseInvoice('inv1');
      assert.strictEqual(mockInvoice.status.isMatched(), true);
    });

    it('should prevent modifying matched invoice', async () => {
      try {
        await service.cancelPurchaseInvoice('inv1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Matched invoices cannot be modified');
      }
    });
  });
});
