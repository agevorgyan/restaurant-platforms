import { MarketingEventRegistry } from '../components/marketing-event-registry';
import { MarketingEventFactory } from '../components/marketing-event-factory';
import { MarketingEventMapper } from '../components/marketing-event-mapper';
import { EventCompatibilitySpecification } from '../specifications/event-compatibility.specification';
import { EventOrderingSpecification } from '../specifications/event-ordering.specification';
import { EventPublicationPolicy } from '../policies/event-publication.policy';
import { EventConsistencyPolicy } from '../policies/event-consistency.policy';
import { EventSourceEnum } from '../value-objects/event-source.value-object';
import { EventPriorityEnum } from '../value-objects/event-priority.value-object';
import { DomainEvent } from '@saas/core';

// Mock event for testing
class TestDomainEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly id: string) {}
  getAggregateId(): string { return this.id; }
}

describe('Marketing Integration Layer', () => {
  
  beforeEach(() => {
    MarketingEventRegistry.clear();
  });

  describe('Registry', () => {
    it('should register an event successfully', () => {
      MarketingEventRegistry.registerEvent('TestDomainEvent', 1);
      expect(MarketingEventRegistry.isRegistered('TestDomainEvent', 1)).toBe(true);
    });

    it('should prevent duplicate registration of same event and version', () => {
      MarketingEventRegistry.registerEvent('TestDomainEvent', 1);
      expect(() => MarketingEventRegistry.registerEvent('TestDomainEvent', 1))
        .toThrow('Event TestDomainEvent version 1 is already registered in the Integration Layer.');
    });
  });

  describe('Factory and Metadata', () => {
    it('should throw error if event is not registered', () => {
      const event = new TestDomainEvent('123');
      expect(() => MarketingEventFactory.createIntegrationEvent(event, EventSourceEnum.CAMPAIGN))
        .toThrow('DomainEvent TestDomainEvent v1 is not registered in the Marketing Event Registry');
    });

    it('should wrap a DomainEvent into an IntegrationEvent with Metadata', () => {
      MarketingEventRegistry.registerEvent('TestDomainEvent', 1);
      
      const domainEvent = new TestDomainEvent('123');
      const integrationEvent = MarketingEventFactory.createIntegrationEvent(
        domainEvent,
        EventSourceEnum.PROMOTION,
        EventPriorityEnum.HIGH,
        'corr-1',
        'caus-1'
      );

      expect(integrationEvent.metadata.eventId.value).toBeDefined();
      expect(integrationEvent.metadata.version.value).toBe(1);
      expect(integrationEvent.metadata.source.value).toBe(EventSourceEnum.PROMOTION);
      expect(integrationEvent.metadata.priority.value).toBe(EventPriorityEnum.HIGH);
      expect(integrationEvent.metadata.correlationId?.value).toBe('corr-1');
      expect(integrationEvent.metadata.causationId?.value).toBe('caus-1');
      expect(integrationEvent.payload).toBe(domainEvent);
    });
  });

  describe('Mapper', () => {
    it('should correctly map to transport format', () => {
      MarketingEventRegistry.registerEvent('TestDomainEvent', 1);
      const domainEvent = new TestDomainEvent('123');
      const integrationEvent = MarketingEventFactory.createIntegrationEvent(
        domainEvent,
        EventSourceEnum.COUPON
      );

      const transport = MarketingEventMapper.mapToTransport(integrationEvent);
      
      expect(transport.eventId).toBeDefined();
      expect(transport.eventName).toBe('TestDomainEvent');
      expect(transport.version).toBe(1);
      expect(transport.source).toBe(EventSourceEnum.COUPON);
      expect(transport.payload.id).toBe('123');
      expect(transport.correlationId).toBeNull();
    });
  });

  describe('Policies and Specifications', () => {
    let spec: EventCompatibilitySpecification;
    let pubPolicy: EventPublicationPolicy;

    beforeEach(() => {
      MarketingEventRegistry.registerEvent('TestDomainEvent', 1);
      spec = new EventCompatibilitySpecification();
      pubPolicy = new EventPublicationPolicy();
    });

    it('should validate compatibility specification', () => {
      const domainEvent = new TestDomainEvent('123');
      const integrationEvent = MarketingEventFactory.createIntegrationEvent(domainEvent, EventSourceEnum.CAMPAIGN);
      
      expect(spec.isSatisfiedBy(integrationEvent)).toBe(true);
    });

    it('should throw if critical priority event lacks correlation ID', () => {
      const domainEvent = new TestDomainEvent('123');
      const integrationEvent = MarketingEventFactory.createIntegrationEvent(
        domainEvent, 
        EventSourceEnum.CAMPAIGN,
        EventPriorityEnum.CRITICAL
        // Missing correlationId
      );

      expect(() => pubPolicy.canPublish(integrationEvent))
        .toThrow('Critical priority events must include a correlation ID for tracing');
    });

    it('should allow publishing if policies are met', () => {
      const domainEvent = new TestDomainEvent('123');
      const integrationEvent = MarketingEventFactory.createIntegrationEvent(
        domainEvent, 
        EventSourceEnum.CAMPAIGN,
        EventPriorityEnum.NORMAL
      );

      expect(pubPolicy.canPublish(integrationEvent)).toBe(true);
    });

    it('should ensure consistency across a batch of events', () => {
      const e1 = MarketingEventFactory.createIntegrationEvent(new TestDomainEvent('1'), EventSourceEnum.CAMPAIGN, EventPriorityEnum.NORMAL, 'corr-A');
      const e2 = MarketingEventFactory.createIntegrationEvent(new TestDomainEvent('2'), EventSourceEnum.CAMPAIGN, EventPriorityEnum.NORMAL, 'corr-A');
      const e3 = MarketingEventFactory.createIntegrationEvent(new TestDomainEvent('3'), EventSourceEnum.CAMPAIGN, EventPriorityEnum.NORMAL, 'corr-B'); // Inconsistent

      expect(() => EventConsistencyPolicy.ensureCorrelationConsistency([e1, e2, e3], 'corr-A'))
        .toThrow(/Event consistency policy violated/);
        
      expect(() => EventConsistencyPolicy.ensureCorrelationConsistency([e1, e2], 'corr-A')).not.toThrow();
    });
    
    it('should validate ordering specification', () => {
      const orderingSpec = new EventOrderingSpecification();
      const e1 = MarketingEventFactory.createIntegrationEvent(new TestDomainEvent('1'), EventSourceEnum.CAMPAIGN);
      
      // Artificial delay
      const futureDate = new Date(e1.metadata.timestamp.getTime() + 1000);
      
      const e2 = MarketingEventFactory.createIntegrationEvent(new TestDomainEvent('2'), EventSourceEnum.CAMPAIGN, EventPriorityEnum.NORMAL, undefined, e1.metadata.eventId.value);
      // Hack timestamp for test
      Object.defineProperty(e2.metadata, 'timestamp', { value: futureDate });

      expect(orderingSpec.isStrictlyBefore(e1, e2)).toBe(true);
      expect(orderingSpec.isStrictlyBefore(e2, e1)).toBe(false);
    });
  });
});
