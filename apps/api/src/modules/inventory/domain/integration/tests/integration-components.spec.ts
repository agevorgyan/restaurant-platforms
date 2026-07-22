import { InventoryEventRegistry } from '../components/inventory-event-registry';
import { InventoryIntegrationMapper } from '../components/inventory-integration-mapper';
import { InventoryContractValidator } from '../components/inventory-contract-validator';
import { InventoryEventVersionResolver } from '../components/inventory-event-version-resolver';
import { InventoryIntegrationContext } from '../value-objects/inventory-integration-context.value-object';
import { InventoryEventVersion } from '../value-objects/inventory-event-version.value-object';
import { DomainEvent } from '@saas/core';

class MockDomainEvent implements DomainEvent {
  dateTimeOccurred = new Date();
  constructor(public readonly aggregateId: string) {}
  getAggregateId() { return this.aggregateId; }
}

describe('Integration Components', () => {
  describe('InventoryEventRegistry & Mapper', () => {
    it('should map domain event to multiple outbound integration events', () => {
      const registry = new InventoryEventRegistry();
      registry.registerOutbound('MockDomainEvent', 'OutboundIntegrationEventA');
      registry.registerOutbound('MockDomainEvent', 'OutboundIntegrationEventB');

      const mapper = new InventoryIntegrationMapper(registry);
      const context = InventoryIntegrationContext.create({
        correlationId: 'corr1',
        source: 'Inventory',
        priority: 'NORMAL'
      });

      const domainEvent = new MockDomainEvent('agg1');
      const events = mapper.mapToIntegrationEvents(domainEvent, context);

      expect(events.length).toBe(2);
      expect(events[0].metadata.eventName).toBe('OutboundIntegrationEventA');
      expect(events[1].metadata.eventName).toBe('OutboundIntegrationEventB');
      expect(events[0].metadata.correlationId).toBe('corr1');
    });

    it('should map inbound integration event to domain action', () => {
      const registry = new InventoryEventRegistry();
      registry.registerInbound('InboundIntegrationEvent', 'ProcessInboundAction');
      const mapper = new InventoryIntegrationMapper(registry);

      const payload = {
        metadata: { eventName: 'InboundIntegrationEvent' },
        data: { field: 1 }
      } as any;

      const result = mapper.mapToDomainAction(payload);
      expect(result.action).toBe('ProcessInboundAction');
      expect(result.data.field).toBe(1);
    });
  });

  describe('InventoryContractValidator', () => {
    it('should throw error for invalid payload structure', () => {
      expect(() => InventoryContractValidator.validate({ foo: 'bar' })).toThrow(/does not satisfy/);
    });

    it('should throw error for missing correlation', () => {
      const payload = {
        metadata: {
          eventId: 'event1',
          timestamp: '2026-07-22T00:00:00Z',
          version: 'v1.0',
          priority: 'NORMAL',
          source: 'Order',
          eventName: 'InventoryReservationRequested'
        },
        data: {}
      };
      expect(() => InventoryContractValidator.validate(payload)).toThrow(/does not satisfy/);
    });
  });

  describe('InventoryEventVersionResolver', () => {
    it('should resolve valid versions', () => {
      const resolver = new InventoryEventVersionResolver(InventoryEventVersion.create(1, 0));
      const payload = { metadata: { version: 'v1.1' } } as any;

      const version = resolver.resolveAndValidate(payload);
      expect(version.major).toBe(1);
      expect(version.minor).toBe(1);
    });

    it('should throw on invalid minimum version constraints', () => {
      const resolver = new InventoryEventVersionResolver(InventoryEventVersion.create(2, 0));
      const payload = { metadata: { version: 'v1.0' } } as any;

      expect(() => resolver.resolveAndValidate(payload)).toThrow(/incompatible/);
    });
  });
});
