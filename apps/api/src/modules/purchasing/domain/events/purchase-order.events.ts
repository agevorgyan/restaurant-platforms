import { IDomainEvent } from './domain-event.interface';

export class PurchaseOrderCreatedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseOrderCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderSubmittedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseOrderSubmitted';
  public readonly occurredOn = new Date();
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderApprovedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseOrderApproved';
  public readonly occurredOn = new Date();
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderRejectedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseOrderRejected';
  public readonly occurredOn = new Date();
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderCancelledEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseOrderCancelled';
  public readonly occurredOn = new Date();
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderPartiallyReceivedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseOrderPartiallyReceived';
  public readonly occurredOn = new Date();
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}

export class PurchaseOrderCompletedEvent implements IDomainEvent {
  public readonly eventName = 'PurchaseOrderCompleted';
  public readonly occurredOn = new Date();
  constructor(public readonly orderId: string, public readonly restaurantId: string) {}
}
