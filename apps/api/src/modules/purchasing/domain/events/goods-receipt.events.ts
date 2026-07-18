import { IDomainEvent } from './domain-event.interface';

export class GoodsReceiptCreatedEvent implements IDomainEvent {
  public readonly eventName = 'GoodsReceiptCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly receiptId: string, public readonly restaurantId: string) {}
}

export class GoodsReceiptPostedEvent implements IDomainEvent {
  public readonly eventName = 'GoodsReceiptPosted';
  public readonly occurredOn = new Date();
  constructor(public readonly receiptId: string, public readonly restaurantId: string) {}
}

export class GoodsReceiptCancelledEvent implements IDomainEvent {
  public readonly eventName = 'GoodsReceiptCancelled';
  public readonly occurredOn = new Date();
  constructor(public readonly receiptId: string, public readonly restaurantId: string) {}
}

export class GoodsReceiptLineRejectedEvent implements IDomainEvent {
  public readonly eventName = 'GoodsReceiptLineRejected';
  public readonly occurredOn = new Date();
  constructor(
    public readonly receiptId: string,
    public readonly restaurantId: string,
    public readonly lineId: string,
    public readonly ingredientId: string,
    public readonly rejectedQuantity: number
  ) {}
}
