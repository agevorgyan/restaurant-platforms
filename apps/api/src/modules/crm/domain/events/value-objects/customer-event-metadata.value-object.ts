import { CustomerEventVersion } from './customer-event-version.value-object';

export class CustomerEventMetadata {
  constructor(
    public readonly eventId: string,
    public readonly eventType: string,
    public readonly eventVersion: CustomerEventVersion,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly restaurantId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
    public readonly causationId?: string,
    public readonly initiatedBy?: string
  ) {
    if (!eventId) throw new Error('eventId is required');
    if (!eventType) throw new Error('eventType is required');
    if (!aggregateId) throw new Error('aggregateId is required');
    if (!aggregateType) throw new Error('aggregateType is required');
    if (!restaurantId) throw new Error('restaurantId is required');
    if (!occurredAt) throw new Error('occurredAt is required');
  }
}
