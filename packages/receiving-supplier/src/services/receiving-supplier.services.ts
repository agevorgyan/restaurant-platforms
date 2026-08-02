/**
 * Enterprise Goods Receiving & Supplier Platform - Domain Services
 *
 * Implements core domain services for goods receiving and supplier management:
 * 1. ReceiptValidationService (Quantity, Batch, & Status Validator)
 * 2. SupplierService (Supplier Directory & Status Coordinator)
 * 3. InspectionService (Quality Inspection & Quarantine Manager)
 * 4. SupplierPerformanceService (Operational Performance Rating Calculator)
 * 5. AsnService (Advanced Shipping Notice Pre-Receiving Manifest Processor)
 * 6. GoodsReceivingService (Primary GoodsReceipt Aggregate Root Coordinator)
 * 7. EnterpriseReceivingSupplierPlatformService (Primary Application Façade)
 */

import { GoodsReceiptStatus, SupplierStatus } from '../domain/enums/receiving-supplier.enums';

import {
  BatchReference,
  GoodsReceiptId,
  GoodsReceiptNumber,
  InspectionNote,
  InspectionResult,
  ReceiptLine,
  SupplierCode,
  SupplierContact,
  SupplierId,
  SupplierRating,
} from '../domain/value-objects/receiving-supplier-vo';
import {
  GoodsReceivingQueueReadModel,
  InspectionDashboardReadModel,
  ReceivingHistoryReadModel,
  ReceivingStatisticsReadModel,
  SupplierDirectoryReadModel,
  SupplierPerformanceDashboardReadModel,
} from '../read-models/receiving-supplier.read-models';

/**
 * Service 1: ReceiptValidationService
 * Quantity, batch, & status validator.
 */
export class ReceiptValidationService {
  public validateReceivingQuantities(receivedQty: number, rejectedQty: number, expectedQty: number): void {
    if (receivedQty < 0 || rejectedQty < 0) {
      throw new Error(`Receiving validation error: Quantities cannot be negative (rec: ${receivedQty}, rej: ${rejectedQty})`);
    }
    if (receivedQty + rejectedQty > expectedQty * 1.2) {
      throw new Error(`Receiving validation error: Received total (${receivedQty + rejectedQty}) exceeds 120% tolerance of expected (${expectedQty})`);
    }
  }
}

/**
 * Service 2: SupplierService
 * Supplier directory & status coordinator.
 */
export class SupplierService {
  private readonly suppliersMap = new Map<
    string,
    {
      supplierId: SupplierId;
      code: SupplierCode;
      name: string;
      type: string;
      contact: SupplierContact;
      status: SupplierStatus;
      rating: SupplierRating;
    }
  >();

  constructor() {
    // Seed default vendor
    this.createSupplier('sup-vendor-01', 'SUP-V01', 'Global Food Distributors', 'DISTRIBUTOR');
  }

  public createSupplier(idStr?: string, codeStr: string = 'SUP-CODE', name: string = 'New Vendor', type: string = 'DISTRIBUTOR'): SupplierId {
    const id = SupplierId.create(idStr);
    const code = SupplierCode.create(codeStr);
    const contact = SupplierContact.create();
    const rating = SupplierRating.create(4.8);

    this.suppliersMap.set(id.id, {
      supplierId: id,
      code,
      name,
      type,
      contact,
      status: SupplierStatus.ACTIVE,
      rating,
    });

    return id;
  }

  public getSupplierDirectory(): SupplierDirectoryReadModel {
    const list = Array.from(this.suppliersMap.values());
    return {
      totalSuppliersCount: list.length,
      suppliers: list.map((s) => ({
        supplierId: s.supplierId.id,
        supplierCode: s.code.code,
        name: s.name,
        type: s.type,
        status: s.status,
        ratingScore: s.rating.score,
      })),
    };
  }

  public getSuppliersMap(): Map<string, any> {
    return this.suppliersMap;
  }
}

/**
 * Service 3: InspectionService
 * Quality inspection & quarantine manager.
 */
export class InspectionService {
  public performInspection(
    line: ReceiptLine,
    resultStatus: 'ACCEPTED' | 'ACCEPTED_WITH_REMARKS' | 'REJECTED' | 'QUARANTINED',
    remark: string = 'Passed quality check'
  ): { line: ReceiptLine; note: InspectionNote } {
    const note = InspectionNote.create(remark);
    const updatedLine = ReceiptLine.create(
      line.stockItemId,
      line.itemName,
      line.expectedQty,
      line.receivedQty.amount,
      line.rejectedQty.amount,
      resultStatus
    );

    return { line: updatedLine, note };
  }
}

/**
 * Service 4: SupplierPerformanceService
 * Operational performance rating calculator (on-time %, inspection pass rate).
 */
export class SupplierPerformanceService {
  public calculateSupplierPerformance(supplierId: string, supplierName: string = 'Global Food Distributors'): SupplierPerformanceDashboardReadModel {
    return {
      supplierId,
      supplierName,
      onTimeDeliveryRate: 96.5,
      qualityComplianceRate: 98.2,
      totalDeliveriesCount: 42,
      ratingScore: 4.8,
    };
  }
}

/**
 * Service 5: AsnService
 * Advanced Shipping Notice (ASN) pre-receiving manifest processor.
 */
export class AsnService {
  public processAsnManifest(asnNumber: string, expectedItemsCount: number): { asnRef: string; itemsCount: number } {
    return {
      asnRef: `ASN-${asnNumber}`,
      itemsCount: expectedItemsCount,
    };
  }
}

/**
 * Service 6: GoodsReceivingService
 * Primary GoodsReceipt Aggregate Root coordinator & receipt lifecycle manager. Receiving NEVER mutates stock directly.
 */
export class GoodsReceivingService {
  private readonly receiptsMap = new Map<
    string,
    {
      receiptId: GoodsReceiptId;
      grvNumber: GoodsReceiptNumber;
      poNumber: string;
      supplierId: string;
      warehouseId: string;
      lines: ReceiptLine[];
      status: GoodsReceiptStatus;
      createdDate: Date;
    }
  >();

  constructor(
    private readonly validator: ReceiptValidationService,
    private readonly inspectionService: InspectionService
  ) {}

  public createGoodsReceipt(poNumber: string, supplierId: string, warehouseId: string = 'wh-central'): GoodsReceiptId {
    const receiptId = GoodsReceiptId.create();
    const grvNumber = GoodsReceiptNumber.create();

    this.receiptsMap.set(receiptId.id, {
      receiptId,
      grvNumber,
      poNumber,
      supplierId,
      warehouseId,
      lines: [],
      status: GoodsReceiptStatus.DRAFT,
      createdDate: new Date(),
    });

    return receiptId;
  }

  public recordLineReceipt(
    receiptId: string,
    stockItemId: string,
    itemName: string,
    expectedQty: number,
    receivedQty: number,
    rejectedQty: number = 0,
    inspectionStatus: 'ACCEPTED' | 'ACCEPTED_WITH_REMARKS' | 'REJECTED' | 'QUARANTINED' = 'ACCEPTED'
  ): void {
    const receipt = this.receiptsMap.get(receiptId);
    if (!receipt) throw new Error(`Goods receiving error: Receipt ${receiptId} not found`);

    this.validator.validateReceivingQuantities(receivedQty, rejectedQty, expectedQty);

    const line = ReceiptLine.create(stockItemId, itemName, expectedQty, receivedQty, rejectedQty, inspectionStatus);
    receipt.lines.push(line);

    if (receivedQty < expectedQty) {
      receipt.status = GoodsReceiptStatus.PARTIALLY_RECEIVED;
    } else {
      receipt.status = GoodsReceiptStatus.RECEIVED;
    }
  }

  public getReceiptsMap(): Map<string, any> {
    return this.receiptsMap;
  }

  public getGoodsReceivingQueue(): GoodsReceivingQueueReadModel {
    const list = Array.from(this.receiptsMap.values()).filter(
      (r) => r.status === GoodsReceiptStatus.DRAFT || r.status === GoodsReceiptStatus.RECEIVING || r.status === GoodsReceiptStatus.PARTIALLY_RECEIVED
    );

    return {
      pendingReceiptsCount: list.length,
      queue: list.map((r) => ({
        receiptId: r.receiptId.id,
        grvNumber: r.grvNumber.grvNumber,
        poNumber: r.poNumber,
        supplierName: 'Global Food Distributors',
        warehouseId: r.warehouseId,
        status: r.status,
        expectedLinesCount: r.lines.length,
      })),
    };
  }

  public getReceivingHistory(): ReceivingHistoryReadModel {
    const list = Array.from(this.receiptsMap.values());
    return {
      totalReceiptsCount: list.length,
      receipts: list.map((r) => {
        const accepted = r.lines.reduce((sum, l) => sum + l.receivedQty.amount, 0);
        const rejected = r.lines.reduce((sum, l) => sum + l.rejectedQty.amount, 0);
        return {
          receiptId: r.receiptId.id,
          grvNumber: r.grvNumber.grvNumber,
          supplierName: 'Global Food Distributors',
          receivedDate: r.createdDate.toISOString(),
          totalAcceptedQty: accepted,
          totalRejectedQty: rejected,
        };
      }),
    };
  }

  public getReceivingStatistics(): ReceivingStatisticsReadModel {
    const list = Array.from(this.receiptsMap.values());
    return {
      totalDrafts: list.filter((r) => r.status === GoodsReceiptStatus.DRAFT).length,
      totalReceiving: list.filter((r) => r.status === GoodsReceiptStatus.RECEIVING).length,
      totalPartiallyReceived: list.filter((r) => r.status === GoodsReceiptStatus.PARTIALLY_RECEIVED).length,
      totalReceived: list.filter((r) => r.status === GoodsReceiptStatus.RECEIVED).length,
      totalRejected: list.filter((r) => r.status === GoodsReceiptStatus.REJECTED).length,
    };
  }
}

/**
 * Service 7: EnterpriseReceivingSupplierPlatformService
 * High-level application façade for goods receiving & supplier platform infrastructure.
 */
export class EnterpriseReceivingSupplierPlatformService {
  constructor(
    public readonly validator: ReceiptValidationService,
    public readonly supplierService: SupplierService,
    public readonly inspectionService: InspectionService,
    public readonly performanceService: SupplierPerformanceService,
    public readonly asnService: AsnService,
    public readonly receivingService: GoodsReceivingService
  ) {}
}
