import { IDomainEvent } from '../../events/domain-event.interface';
import { CustomerEventMetadata } from '../value-objects/customer-event-metadata.value-object';

export interface CustomerDomainEvent<TPayload = any> extends IDomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
  readonly metadata: CustomerEventMetadata;
  readonly payload: TPayload;
}
