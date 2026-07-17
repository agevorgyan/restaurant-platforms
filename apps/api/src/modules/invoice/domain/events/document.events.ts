import { IInvoice } from '../entities/invoice.interface';
import { IReceipt } from '../entities/receipt.interface';

export class InvoiceIssuedEvent {
  constructor(public readonly invoice: IInvoice) {}
}

export class InvoiceCancelledEvent {
  constructor(public readonly invoice: IInvoice) {}
}

export class ReceiptIssuedEvent {
  constructor(public readonly receipt: IReceipt) {}
}

export class ReceiptVoidedEvent {
  constructor(public readonly receipt: IReceipt) {}
}
