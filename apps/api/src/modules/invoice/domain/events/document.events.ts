export class InvoiceIssuedEvent {
  constructor(public readonly invoiceId: string, public readonly orderId: string) {}
}

export class InvoiceCancelledEvent {
  constructor(public readonly invoiceId: string, public readonly orderId: string) {}
}

export class ReceiptIssuedEvent {
  constructor(public readonly receiptId: string, public readonly paymentId: string) {}
}

export class ReceiptVoidedEvent {
  constructor(public readonly receiptId: string, public readonly paymentId: string) {}
}
