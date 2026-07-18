import { IDomainEvent } from './domain-event.interface';

export class CustomerCreatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerCreated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly customerId: string,
    public readonly restaurantId: string
  ) {}
}

export class CustomerUpdatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerUpdated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly customerId: string,
    public readonly restaurantId: string
  ) {}
}

export class CustomerActivatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerActivated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly customerId: string,
    public readonly restaurantId: string
  ) {}
}

export class CustomerDeactivatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerDeactivated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly customerId: string,
    public readonly restaurantId: string
  ) {}
}

export class CustomerArchivedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerArchived';
  public readonly occurredOn = new Date();

  constructor(
    public readonly customerId: string,
    public readonly restaurantId: string
  ) {}
}
