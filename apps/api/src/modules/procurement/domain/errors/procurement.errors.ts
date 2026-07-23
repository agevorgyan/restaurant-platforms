export class ProcurementDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProcurementDomainError';
  }
}

export class SupplierDomainError extends ProcurementDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'SupplierDomainError';
  }
}

export class PurchaseOrderDomainError extends ProcurementDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'PurchaseOrderDomainError';
  }
}

export class PurchaseRequisitionDomainError extends ProcurementDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'PurchaseRequisitionDomainError';
  }
}

export class GoodsReceiptDomainError extends ProcurementDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'GoodsReceiptDomainError';
  }
}
