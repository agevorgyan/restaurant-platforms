/**
 * Enterprise Procurement & Purchase Order Platform - Value Objects
 *
 * Immutable Value Objects encapsulating purchase order IDs, PO numbers, requisition IDs, PO lines,
 * requested & ordered quantities, expected delivery dates, contract prices, approval levels, and procurement policies.
 */

/**
 * Identifiers & Numbers: PurchaseOrderId, PurchaseOrderNumber, RequisitionId
 */
export class PurchaseOrderId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): PurchaseOrderId {
    return new PurchaseOrderId(id || `po-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class PurchaseOrderNumber {
  public readonly poNumber: string;

  private constructor(poNumber: string) {
    this.poNumber = poNumber;
  }

  public static create(poNumber?: string): PurchaseOrderNumber {
    return new PurchaseOrderNumber(poNumber || `PO-${Math.floor(100000 + Math.random() * 900000)}`);
  }
}

export class RequisitionId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): RequisitionId {
    return new RequisitionId(id || `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * Quantities & Pricing: RequestedQuantity, OrderedQuantity, ContractPrice
 */
export class RequestedQuantity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(1, amount);
  }

  public static create(amount: number): RequestedQuantity {
    return new RequestedQuantity(amount);
  }
}

export class OrderedQuantity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(1, amount);
  }

  public static create(amount: number): OrderedQuantity {
    return new OrderedQuantity(amount);
  }
}

export class ContractPrice {
  public readonly unitPrice: number;

  private constructor(unitPrice: number) {
    this.unitPrice = Math.max(0, Math.round(unitPrice * 100) / 100);
  }

  public static create(unitPrice: number): ContractPrice {
    return new ContractPrice(unitPrice);
  }
}

/**
 * Approvals & Policies & Dates: ExpectedDeliveryDate, ApprovalLevel, ProcurementPolicy, PurchaseOrderLine
 */
export class ExpectedDeliveryDate {
  public readonly date: Date;

  private constructor(date: Date) {
    this.date = date;
  }

  public static create(dateInDaysFromNow: number = 7): ExpectedDeliveryDate {
    const d = new Date();
    d.setDate(d.getDate() + dateInDaysFromNow);
    return new ExpectedDeliveryDate(d);
  }
}

export class ApprovalLevel {
  public readonly level: number; // 1: Buyer, 2: Manager, 3: Director
  public readonly title: string;

  private constructor(level: number, title: string) {
    this.level = level;
    this.title = title;
  }

  public static create(level: number = 1, title: string = 'Store Manager'): ApprovalLevel {
    return new ApprovalLevel(level, title);
  }
}

export class ProcurementPolicy {
  public readonly maxAutoApproveAmount: number;
  public readonly managerApprovalThreshold: number;

  private constructor(maxAutoApproveAmount: number, managerApprovalThreshold: number) {
    this.maxAutoApproveAmount = maxAutoApproveAmount;
    this.managerApprovalThreshold = managerApprovalThreshold;
  }

  public static create(maxAutoApproveAmount: number = 500, managerApprovalThreshold: number = 5000): ProcurementPolicy {
    return new ProcurementPolicy(maxAutoApproveAmount, managerApprovalThreshold);
  }
}

export class PurchaseOrderLine {
  public readonly lineId: string;
  public readonly stockItemId: string;
  public readonly itemName: string;
  public readonly requestedQty: RequestedQuantity;
  public readonly orderedQty: OrderedQuantity;
  public readonly unitPrice: ContractPrice;
  public readonly lineTotal: number;

  private constructor(
    lineId: string,
    stockItemId: string,
    itemName: string,
    requestedQty: RequestedQuantity,
    orderedQty: OrderedQuantity,
    unitPrice: ContractPrice
  ) {
    this.lineId = lineId;
    this.stockItemId = stockItemId;
    this.itemName = itemName;
    this.requestedQty = requestedQty;
    this.orderedQty = orderedQty;
    this.unitPrice = unitPrice;
    this.lineTotal = Math.round(orderedQty.amount * unitPrice.unitPrice * 100) / 100;
  }

  public static create(stockItemId: string, itemName: string, qty: number, unitPrice: number): PurchaseOrderLine {
    const lineId = `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    return new PurchaseOrderLine(
      lineId,
      stockItemId,
      itemName,
      RequestedQuantity.create(qty),
      OrderedQuantity.create(qty),
      ContractPrice.create(unitPrice)
    );
  }
}
