import { IntegrationContractSpecification } from '../specifications/integration-contract.specification';
import { EventVersionSpecification } from '../specifications/event-version.specification';
import { CorrelationSpecification } from '../specifications/correlation.specification';
import { InventoryEventVersion } from '../value-objects/inventory-event-version.value-object';
import { InventoryIntegrationEventPayload } from '../components/inventory-integration-event';

describe('Integration Specifications', () => {
  describe('IntegrationContractSpecification', () => {
    it('should validate correctly formed payload', () => {
      const payload: InventoryIntegrationEventPayload = {
        metadata: {
          eventId: 'event1',
          correlationId: 'corr1',
          timestamp: '2026-07-22T00:00:00Z',
          version: 'v1.0',
          priority: 'NORMAL',
          source: 'Order',
          eventName: 'InventoryReservationRequested'
        },
        data: { some: 'data' }
      };

      expect(IntegrationContractSpecification.isSatisfiedBy(payload)).toBe(true);
    });

    it('should reject malformed payload', () => {
      const payload = {
        metadata: {
          eventId: 'event1',
          // missing correlationId
        },
        data: {}
      };
      expect(IntegrationContractSpecification.isSatisfiedBy(payload)).toBe(false);
    });
  });

  describe('EventVersionSpecification', () => {
    it('should validate compatible versions', () => {
      const payload = { metadata: { version: 'v1.2' } } as any;
      const minVersion = InventoryEventVersion.create(1, 0);

      expect(EventVersionSpecification.isSatisfiedBy(payload, minVersion)).toBe(true);
    });

    it('should reject incompatible versions', () => {
      const payload = { metadata: { version: 'v2.0' } } as any;
      const minVersion = InventoryEventVersion.create(1, 0);

      expect(EventVersionSpecification.isSatisfiedBy(payload, minVersion)).toBe(false);
    });
  });

  describe('CorrelationSpecification', () => {
    it('should validate payload with correlation identifiers', () => {
      const payload = { metadata: { correlationId: 'corr1', eventId: 'event1' } } as any;
      expect(CorrelationSpecification.isSatisfiedBy(payload)).toBe(true);
    });

    it('should reject payload missing correlation identifiers', () => {
      const payload = { metadata: { eventId: 'event1' } } as any; // missing correlationId
      expect(CorrelationSpecification.isSatisfiedBy(payload)).toBe(false);
    });
  });
});
