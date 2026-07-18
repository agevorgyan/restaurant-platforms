import { IDomainEvent } from './domain-event.interface';

export class SupplierPriceListCreatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierPriceListCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly priceListId: string, public readonly restaurantId: string) {}
}

export class SupplierPriceListPublishedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierPriceListPublished';
  public readonly occurredOn = new Date();
  constructor(public readonly priceListId: string, public readonly restaurantId: string) {}
}

export class SupplierPriceUpdatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierPriceUpdated';
  public readonly occurredOn = new Date();
  constructor(public readonly priceListId: string, public readonly ingredientId: string, public readonly restaurantId: string) {}
}
