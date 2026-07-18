export interface IDomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
}
