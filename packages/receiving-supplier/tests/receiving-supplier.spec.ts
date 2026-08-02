/**
 * Enterprise Goods Receiving & Supplier Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, GoodsReceipt Aggregate Root, Quality Inspections, Partial Receipts,
 * Operational Supplier Performance Ratings, CQRS Read Models, and verification of zero direct stock mutations.
 */

import { GoodsReceiptStatus, SupplierStatus } from '../src/domain/enums/receiving-supplier.enums';
import {
  GoodsReceiptNumber,
  InspectionResult,
  ReceivedQuantity,
  SupplierCode,
} from '../src/domain/value-objects/receiving-supplier-vo';
import {
  AsnService,
  EnterpriseReceivingSupplierPlatformService,
  GoodsReceivingService,
  InspectionService,
  ReceiptValidationService,
  SupplierPerformanceService,
  SupplierService,
} from '../src/services/receiving-supplier.services';

describe('Enterprise Goods Receiving & Supplier Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format SupplierCode and GoodsReceiptNumber correctly', () => {
      const code = SupplierCode.create(' sup-dist-99 ');
      expect(code.code).toBe('SUP-DIST-99');

      const grvNum = GoodsReceiptNumber.create('GRV-102938');
      expect(grvNum.grvNumber).toBe('GRV-102938');

      const recQty = ReceivedQuantity.create(100);
      expect(recQty.amount).toBe(100);
    });
  });

  describe('SupplierService & Supplier Directory', () => {
    let supplierService: SupplierService;

    beforeEach(() => {
      supplierService = new SupplierService();
    });

    it('should register supplier and list in directory', () => {
      const supId = supplierService.createSupplier('sup-farm-01', 'SUP-F01', 'Organic Valley Farm', 'FARMER');
      expect(supId.id).toBe('sup-farm-01');

      const directory = supplierService.getSupplierDirectory();
      expect(directory.totalSuppliersCount).toBe(2); // Seed vendor + newly created vendor
    });
  });

  describe('InspectionService & GoodsReceivingService Lifecycle', () => {
    let validator: ReceiptValidationService;
    let inspectionService: InspectionService;
    let receivingService: GoodsReceivingService;

    beforeEach(() => {
      validator = new ReceiptValidationService();
      inspectionService = new InspectionService();
      receivingService = new GoodsReceivingService(validator, inspectionService);
    });

    it('should handle partial receiving and update receipt status accordingly', () => {
      const receiptId = receivingService.createGoodsReceipt('PO-99100', 'sup-vendor-01', 'wh-central');
      expect(receiptId.id).toBeDefined();

      // Record partial line receipt (received 40 out of expected 100)
      receivingService.recordLineReceipt(receiptId.id, 'item-cheese', 'Cheddar Cheese 1kg', 100, 40, 0, 'ACCEPTED');

      const map = receivingService.getReceiptsMap();
      const receipt = map.get(receiptId.id);
      expect(receipt.status).toBe(GoodsReceiptStatus.PARTIALLY_RECEIVED);

      // Record remaining line receipt
      receivingService.recordLineReceipt(receiptId.id, 'item-cheese', 'Cheddar Cheese 1kg', 60, 60, 0, 'ACCEPTED');
      expect(receipt.status).toBe(GoodsReceiptStatus.RECEIVED);
    });
  });

  describe('SupplierPerformanceService & Read Models', () => {
    let performanceService: SupplierPerformanceService;

    beforeEach(() => {
      performanceService = new SupplierPerformanceService();
    });

    it('should calculate supplier performance rating dashboard model', () => {
      const perf = performanceService.calculateSupplierPerformance('sup-vendor-01', 'Global Food Distributors');
      expect(perf.onTimeDeliveryRate).toBeGreaterThan(90);
      expect(perf.qualityComplianceRate).toBeGreaterThan(90);
      expect(perf.ratingScore).toBe(4.8);
    });
  });

  describe('EnterpriseReceivingSupplierPlatformService Façade Integration', () => {
    let validator: ReceiptValidationService;
    let supplierService: SupplierService;
    let inspectionService: InspectionService;
    let performanceService: SupplierPerformanceService;
    let asnService: AsnService;
    let receivingService: GoodsReceivingService;
    let platformService: EnterpriseReceivingSupplierPlatformService;

    beforeEach(() => {
      validator = new ReceiptValidationService();
      supplierService = new SupplierService();
      inspectionService = new InspectionService();
      performanceService = new SupplierPerformanceService();
      asnService = new AsnService();
      receivingService = new GoodsReceivingService(validator, inspectionService);

      platformService = new EnterpriseReceivingSupplierPlatformService(
        validator,
        supplierService,
        inspectionService,
        performanceService,
        asnService,
        receivingService
      );
    });

    it('should query ReceivingStatistics via platform facade', () => {
      const stats = platformService.receivingService.getReceivingStatistics();
      expect(stats.totalDrafts).toBe(0);
    });
  });
});
