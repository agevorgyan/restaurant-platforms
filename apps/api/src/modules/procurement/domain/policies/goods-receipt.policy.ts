import { GoodsReceiptStatus } from '../enums/procurement.enums';

export class GoodsReceiptLifecyclePolicy {
  public static ensureCanStartReceiving(status: GoodsReceiptStatus): void {
    if (status !== GoodsReceiptStatus.DRAFT) {
      throw new Error('Only DRAFT receipts can be started');
    }
  }

  public static ensureCanInspect(status: GoodsReceiptStatus): void {
    if (status !== GoodsReceiptStatus.RECEIVING) {
      throw new Error('Can only inspect goods that are RECEIVING');
    }
  }

  public static ensureCanComplete(status: GoodsReceiptStatus): void {
    if (status !== GoodsReceiptStatus.INSPECTION) {
      throw new Error('Can only complete goods that have been inspected (status: INSPECTION)');
    }
  }

  public static ensureCanCancel(status: GoodsReceiptStatus): void {
    if (status === GoodsReceiptStatus.COMPLETED || status === GoodsReceiptStatus.REJECTED || status === GoodsReceiptStatus.CANCELLED) {
      throw new Error(`Cannot cancel receipt in status ${status}`);
    }
  }
}

export class InspectionPolicy {
  public static isInspectionRequired(): boolean {
    // Usually a configurable business rule, defaulting to true
    return true;
  }
}

export class ReceivingPolicy {
  public static isReceiptDateValid(receiptDate: Date): boolean {
    const today = new Date();
    return receiptDate <= today;
  }
}

export class BatchAcceptancePolicy {
  public static canAcceptBatch(expirationDate?: Date): boolean {
    if (!expirationDate) return true;
    return expirationDate > new Date(); // Cannot accept expired batches
  }
}