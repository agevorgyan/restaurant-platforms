import { IDomainEvent } from './domain-event.interface';

export class SupplierCreatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierUpdatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierUpdated';
  public readonly occurredOn = new Date();
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierActivatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierActivated';
  public readonly occurredOn = new Date();
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierDeactivatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierDeactivated';
  public readonly occurredOn = new Date();
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}

export class SupplierArchivedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierArchived';
  public readonly occurredOn = new Date();
  constructor(public readonly supplierId: string, public readonly restaurantId: string) {}
}
