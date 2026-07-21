import { OrderIntegrationMapper } from '../services/order-integration-mapper.service';
import { OrderEventRegistry } from '../services/order-event-registry.service';
import { OrderEventFactory } from '../services/order-event-factory.service';
import { IntegrationPublishingPolicy } from '../policies/integration-publishing.policy';
import { OrderIntegrationContext } from '../value-objects/order-integration-context.value-object';
import { OrderCorrelationId } from '../value-objects/order-correlation-id.value-object';
import { OrderEventVersion } from '../value-objects/order-event-version.value-object';
import { OrderEventPriority } from '../value-objects/order-event-priority.value-object';
import { DomainEvent } from '@saas/core';

class MockDomainEvent implements DomainEvent {
  public dateTimeOccurred = new Date();
  constructor(public id: string) {}
  getAggregateId(): string {
    return this.id;
  }
}

describe('OrderIntegrationMapper', () => {
  let mapper: OrderIntegrationMapper;
  let registry: OrderEventRegistry;
  let factory: OrderEventFactory;
  let publishingPolicy: IntegrationPublishingPolicy;

  beforeEach(() => {
    registry = new OrderEventRegistry();
    factory = new OrderEventFactory();
    publishingPolicy = new IntegrationPublishingPolicy();
    mapper = new OrderIntegrationMapper(registry, factory, publishingPolicy);
  });

  it('should map a domain event to an integration event successfully', () => {
    registry.register('MockDomainEvent', 'TestIntegrationEvent');
    
    mapper.registerMapper('TestIntegrationEvent', (e: MockDomainEvent) => ({
      orderId: e.getAggregateId()
    }));

    const event = new MockDomainEvent('order-123');
    
    const contextFactory = () => OrderIntegrationContext.create({
      correlationId: OrderCorrelationId.create(),
      version: OrderEventVersion.create(1, 0),
      priority: OrderEventPriority.create()
    });

    const results = mapper.mapDomainEvent(event, contextFactory);

    expect(results).toHaveLength(1);
    expect(results[0].eventName).toBe('TestIntegrationEvent');
    expect(results[0].payload).toEqual({ orderId: 'order-123' });
    expect(results[0].context).toBeInstanceOf(OrderIntegrationContext);
  });

  it('should prevent registering duplicate mappers', () => {
    mapper.registerMapper('TestIntegrationEvent', () => ({}));
    expect(() => mapper.registerMapper('TestIntegrationEvent', () => ({}))).toThrow(/already registered/);
  });

  it('should throw if mapper is missing for a registered integration event', () => {
    registry.register('MockDomainEvent', 'MissingMapperEvent');
    const event = new MockDomainEvent('order-123');
    
    expect(() => mapper.mapDomainEvent(event, () => ({} as any))).toThrow(/No payload mapper registered/);
  });
});
