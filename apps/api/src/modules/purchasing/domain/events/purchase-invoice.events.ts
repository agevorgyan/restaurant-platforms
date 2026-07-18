import { IDomainEvent } from './domain-event.interface';

export class PurchaseInvoiceCreatedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseInvoiceCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}

export class PurchaseInvoicePostedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseInvoicePosted';
  public readonly occurredOn = new Date();
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}

export class PurchaseInvoiceCancelledEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseInvoiceCancelled';
  public readonly occurredOn = new Date();
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}

export class PurchaseInvoiceMatchedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseInvoiceMatched';
  public readonly occurredOn = new Date();
  constructor(public readonly invoiceId: string, public readonly restaurantId: string) {}
}
