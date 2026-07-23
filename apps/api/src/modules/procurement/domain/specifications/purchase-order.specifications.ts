import { PurchaseOrderLine } from '../entities/purchase-order/purchase-order-line.entity';
import { PurchaseOrderAmount } from '../value-objects/purchase-order/purchase-order-amount.value-object';

export class PurchaseOrderConsistencySpecification {
  public static isSatisfiedBy(lines: PurchaseOrderLine[], totalAmount: PurchaseOrderAmount): boolean {
    const calculatedTotal = lines.reduce((sum, line) => sum + line.totalPrice.amount, 0);
    // Tolerate minor floating point errors
    return Math.abs(calculatedTotal - totalAmount.amount) < 0.01;
  }
}

export class PurchaseOrderApprovalSpecification {
  public static isSatisfiedBy(totalAmount: PurchaseOrderAmount): boolean {
    // Example logic: auto approve if < 1000, otherwise requires approval
    return totalAmount.amount < 1000;
  }
}

export class PurchaseOrderLineSpecification {
  public static isSatisfiedBy(lines: PurchaseOrderLine[]): boolean {
    return lines.length > 0;
  }
}

export class SupplierReferenceSpecification {
  public static isSatisfiedBy(supplierRef: any): boolean {
    return !!supplierRef && !!supplierRef.value;
  }
}

export class DeliveryScheduleSpecification {
  public static isSatisfiedBy(schedule: any): boolean {
    return !!schedule && !!schedule.expectedDate;
  }
}