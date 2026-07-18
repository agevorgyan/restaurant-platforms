import { IDomainEvent } from './domain-event.interface';

export class SupplierContractCreatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierContractCreated';
  public readonly occurredOn = new Date();
  constructor(public readonly contractId: string, public readonly restaurantId: string) {}
}

export class SupplierContractActivatedEvent implements IDomainEvent {
  public readonly eventName = 'SupplierContractActivated';
  public readonly occurredOn = new Date();
  constructor(public readonly contractId: string, public readonly restaurantId: string) {}
}

export class SupplierContractExpiredEvent implements IDomainEvent {
  public readonly eventName = 'SupplierContractExpired';
  public readonly occurredOn = new Date();
  constructor(public readonly contractId: string, public readonly restaurantId: string) {}
}
