import { PurchaseOrderStatus } from '../enums/procurement.enums';
import { PurchaseOrderLine } from '../entities/purchase-order/purchase-order-line.entity';

export class PurchaseOrderLifecyclePolicy {
  public static ensureCanSubmit(status: PurchaseOrderStatus, lines: PurchaseOrderLine[]): void {
    if (status !== PurchaseOrderStatus.DRAFT) {
      throw new Error('Only DRAFT purchase orders can be submitted');
    }
    if (lines.length === 0) {
      throw new Error('Purchase order must have at least one line to be submitted');
    }
  }

  public static ensureCanCancel(status: PurchaseOrderStatus): void {
    if (status === PurchaseOrderStatus.CONFIRMED || status === PurchaseOrderStatus.PARTIALLY_RECEIVED || status === PurchaseOrderStatus.FULLY_RECEIVED || status === PurchaseOrderStatus.CLOSED || status === PurchaseOrderStatus.CANCELLED) {
      throw new Error(`Cannot cancel purchase order in status ${status}`);
    }
  }

  public static ensureCanConfirm(status: PurchaseOrderStatus): void {
    if (status !== PurchaseOrderStatus.PENDING_SUPPLIER_CONFIRMATION) {
      throw new Error('Only PENDING_SUPPLIER_CONFIRMATION purchase orders can be confirmed');
    }
  }
}

export class SupplierConfirmationPolicy {
  public static isConfirmationValid(confirmationDate: Date): boolean {
    return confirmationDate <= new Date();
  }
}

export class DeliveryPolicy {
  public static isDeliveryDateValid(expectedDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expectedDate >= today;
  }
}

export class PurchaseOrderValidationPolicy {
  public static ensureNumberImmutable(isSubmitted: boolean, newNumber: string, oldNumber: string): void {
    if (isSubmitted && newNumber !== oldNumber) {
      throw new Error('Purchase order number is immutable after submission');
    }
  }

  public static ensureLinesImmutableAfterConfirmation(status: PurchaseOrderStatus): void {
    const immutableStatuses = [
      PurchaseOrderStatus.CONFIRMED,
      PurchaseOrderStatus.PARTIALLY_RECEIVED,
      PurchaseOrderStatus.FULLY_RECEIVED,
      PurchaseOrderStatus.CLOSED
    ];
    if (immutableStatuses.includes(status)) {
      throw new Error('Purchase order lines are immutable after supplier confirmation');
    }
  }
}