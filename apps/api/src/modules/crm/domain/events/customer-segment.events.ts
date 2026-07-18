import { IDomainEvent } from './domain-event.interface';

export class CustomerSegmentCreatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerSegmentCreated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly segmentId: string,
    public readonly restaurantId: string
  ) {}
}

export class CustomerSegmentUpdatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerSegmentUpdated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly segmentId: string,
    public readonly restaurantId: string
  ) {}
}

export class CustomerSegmentActivatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerSegmentActivated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly segmentId: string,
    public readonly restaurantId: string
  ) {}
}

export class CustomerSegmentArchivedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerSegmentArchived';
  public readonly occurredOn = new Date();

  constructor(
    public readonly segmentId: string,
    public readonly restaurantId: string
  ) {}
}
