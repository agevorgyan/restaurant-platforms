/**
 * Enterprise Goods Receiving & Supplier Platform - Value Objects
 *
 * Immutable Value Objects encapsulating supplier IDs, codes, contacts, ratings, goods receipt IDs,
 * GRV numbers, receipt lines, inspection results/notes, quantities, and batch references.
 */

/**
 * Supplier Attributes: SupplierId, SupplierCode, SupplierContact, SupplierRating
 */
export class SupplierId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): SupplierId {
    return new SupplierId(id || `sup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class SupplierCode {
  public readonly code: string;

  private constructor(code: string) {
    this.code = code.trim().toUpperCase();
  }

  public static create(code: string): SupplierCode {
    return new SupplierCode(code);
  }
}

export class SupplierContact {
  public readonly email: string;
  public readonly phone: string;
  public readonly address: string;

  private constructor(email: string, phone: string, address: string) {
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  public static create(email: string = 'vendor@supplier.com', phone: string = '+1-800-555-0199', address: string = '100 Industrial Parkway'): SupplierContact {
    return new SupplierContact(email, phone, address);
  }
}

export class SupplierRating {
  public readonly score: number; // 0..5 scale

  private constructor(score: number) {
    this.score = Math.max(0, Math.min(5, Math.round(score * 10) / 10));
  }

  public static create(score: number = 4.8): SupplierRating {
    return new SupplierRating(score);
  }
}

/**
 * Goods Receipt Attributes: GoodsReceiptId, GoodsReceiptNumber, BatchReference, InspectionResult, InspectionNote
 */
export class GoodsReceiptId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): GoodsReceiptId {
    return new GoodsReceiptId(id || `grv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class GoodsReceiptNumber {
  public readonly grvNumber: string;

  private constructor(grvNumber: string) {
    this.grvNumber = grvNumber;
  }

  public static create(grvNumber?: string): GoodsReceiptNumber {
    return new GoodsReceiptNumber(grvNumber || `GRV-${Math.floor(100000 + Math.random() * 900000)}`);
  }
}

export class BatchReference {
  public readonly batchNo: string;
  public readonly expiryDate: Date;

  private constructor(batchNo: string, expiryDate: Date) {
    this.batchNo = batchNo;
    this.expiryDate = expiryDate;
  }

  public static create(batchNo?: string, expiryDaysFromNow: number = 60): BatchReference {
    const d = new Date();
    d.setDate(d.getDate() + expiryDaysFromNow);
    return new BatchReference(batchNo || `BATCH-${Math.floor(10000 + Math.random() * 90000)}`, d);
  }
}

export class InspectionResult {
  public readonly status: 'ACCEPTED' | 'ACCEPTED_WITH_REMARKS' | 'REJECTED' | 'QUARANTINED';

  private constructor(status: 'ACCEPTED' | 'ACCEPTED_WITH_REMARKS' | 'REJECTED' | 'QUARANTINED') {
    this.status = status;
  }

  public static create(status: 'ACCEPTED' | 'ACCEPTED_WITH_REMARKS' | 'REJECTED' | 'QUARANTINED' = 'ACCEPTED'): InspectionResult {
    return new InspectionResult(status);
  }
}

export class InspectionNote {
  public readonly remark: string;

  private constructor(remark: string) {
    this.remark = remark;
  }

  public static create(remark: string = 'Passed dock inspection'): InspectionNote {
    return new InspectionNote(remark);
  }
}

/**
 * Quantities & Receipt Lines: ReceivedQuantity, RejectedQuantity, ReceiptLine
 */
export class ReceivedQuantity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, amount);
  }

  public static create(amount: number): ReceivedQuantity {
    return new ReceivedQuantity(amount);
  }
}

export class RejectedQuantity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, amount);
  }

  public static create(amount: number): RejectedQuantity {
    return new RejectedQuantity(amount);
  }
}

export class ReceiptLine {
  public readonly lineId: string;
  public readonly stockItemId: string;
  public readonly itemName: string;
  public readonly expectedQty: number;
  public readonly receivedQty: ReceivedQuantity;
  public readonly rejectedQty: RejectedQuantity;
  public readonly batchRef: BatchReference;
  public readonly inspectionResult: InspectionResult;

  private constructor(
    lineId: string,
    stockItemId: string,
    itemName: string,
    expectedQty: number,
    receivedQty: ReceivedQuantity,
    rejectedQty: RejectedQuantity,
    batchRef: BatchReference,
    inspectionResult: InspectionResult
  ) {
    this.lineId = lineId;
    this.stockItemId = stockItemId;
    this.itemName = itemName;
    this.expectedQty = expectedQty;
    this.receivedQty = receivedQty;
    this.rejectedQty = rejectedQty;
    this.batchRef = batchRef;
    this.inspectionResult = inspectionResult;
  }

  public static create(
    stockItemId: string,
    itemName: string,
    expectedQty: number,
    receivedQtyAmount: number,
    rejectedQtyAmount: number = 0,
    inspectionStatus: 'ACCEPTED' | 'ACCEPTED_WITH_REMARKS' | 'REJECTED' | 'QUARANTINED' = 'ACCEPTED'
  ): ReceiptLine {
    const lineId = `rline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    return new ReceiptLine(
      lineId,
      stockItemId,
      itemName,
      expectedQty,
      ReceivedQuantity.create(receivedQtyAmount),
      RejectedQuantity.create(rejectedQtyAmount),
      BatchReference.create(),
      InspectionResult.create(inspectionStatus)
    );
  }
}
