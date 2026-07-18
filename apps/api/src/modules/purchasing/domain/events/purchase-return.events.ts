import { IDomainEvent } from './domain-event.interface';

export class PurchaseReturnCreatedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseReturnCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}

export class PurchaseReturnAuthorizedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseReturnAuthorized';
  public readonly occurredOn = new Date();
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}

export class PurchaseReturnPostedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseReturnPosted';
  public readonly occurredOn = new Date();
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}

export class PurchaseReturnCancelledEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseReturnCancelled';
  public readonly occurredOn = new Date();
  constructor(public readonly returnId: string, public readonly restaurantId: string) {}
}
