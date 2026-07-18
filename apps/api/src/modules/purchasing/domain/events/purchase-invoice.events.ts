export class PurchaseInvoiceCreatedEvent {
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}

export class PurchaseInvoicePostedEvent {
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}

export class PurchaseInvoiceCancelledEvent {
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}

export class PurchaseInvoiceMatchedEvent {
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}
