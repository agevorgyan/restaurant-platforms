import { PricingEventFactory } from './pricing-event-factory';
import { PricingEventMetadata } from '../value-objects/pricing-event-metadata.value-object';
import { PricingEventId } from '../value-objects/pricing-event-id.value-object';
import { PricingCorrelationId } from '../value-objects/pricing-correlation-id.value-object';
import { PricingEventSource, PricingEventSourceEnum } from '../value-objects/pricing-event-source.value-object';
import { PricingEventVersion } from '../value-objects/pricing-event-version.value-object';
import { PricingEventPriority, PricingEventPriorityEnum } from '../value-objects/pricing-event-priority.value-object';
import { DomainEvent } from '@saas/core';

class OrderQuotationPublishedTestEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly quotationId: string) {}
  getAggregateId(): string {
    return this.quotationId;
  }
}

describe('PricingEventFactory and Mapper', () => {
  let metadata: PricingEventMetadata;
  let domainEvent: OrderQuotationPublishedTestEvent;

  beforeEach(() => {
    metadata = PricingEventMetadata.create({
      eventId: PricingEventId.create('evt-123'),
      correlationId: PricingCorrelationId.create('corr-456'),
      source: PricingEventSource.create(PricingEventSourceEnum.ORDER_QUOTATION),
      version: PricingEventVersion.initial(),
      priority: PricingEventPriority.create(PricingEventPriorityEnum.HIGH),
      timestamp: new Date('2026-07-21T10:00:00Z')
    });
    domainEvent = new OrderQuotationPublishedTestEvent('qtn-999');
  });

  it('should correctly map a domain event to an integration event payload', () => {
    const integrationEvent = PricingEventFactory.createIntegrationEvent(domainEvent, metadata);
    
    expect(integrationEvent.eventName).toBe('OrderQuotationPublishedTestEvent');
    expect(integrationEvent.aggregateId).toBe('qtn-999');
    expect(integrationEvent.metadata.eventId).toBe('evt-123');
    expect(integrationEvent.metadata.correlationId).toBe('corr-456');
    expect(integrationEvent.metadata.source).toBe(PricingEventSourceEnum.ORDER_QUOTATION);
    expect(integrationEvent.metadata.priority).toBe(PricingEventPriorityEnum.HIGH);
    expect(integrationEvent.data.quotationId).toBe('qtn-999');
  });
});
