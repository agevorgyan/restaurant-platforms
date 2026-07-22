import { KitchenEventRegistry } from '../services/acl/kitchen-event-registry';
import { KitchenEventVersionResolver } from '../services/acl/kitchen-event-version-resolver';
import { KitchenContractValidator } from '../services/acl/kitchen-contract-validator';
import { KitchenIntegrationMapper } from '../services/acl/kitchen-integration-mapper';
import { KitchenEventFactory } from '../services/acl/kitchen-event-factory';
import { KitchenIntegrationContext } from '../value-objects/acl/kitchen-integration-context.value-object';
import { KitchenCorrelationId } from '../value-objects/acl/kitchen-correlation-id.value-object';
import { KitchenEventVersion } from '../value-objects/acl/kitchen-event-version.value-object';

describe('Kitchen ACL Services', () => {
  describe('KitchenEventRegistry', () => {
    it('should contain known events', () => {
      const events = KitchenEventRegistry.getInboundEventNames();
      expect(events.has('KitchenTicketRequested')).toBe(true);
      expect(events.has('UnknownEvent')).toBe(false);
    });

    it('should return registration info', () => {
      const reg = KitchenEventRegistry.getRegistration('OrderCancelled');
      expect(reg).toBeDefined();
      expect(reg?.requiredFields).toContain('reason');
    });
  });

  describe('KitchenEventVersionResolver', () => {
    it('should resolve version for known event', () => {
      const v = KitchenEventVersionResolver.resolveInboundVersion('OrderCancelled', '1.0');
      expect(v.major).toBe(1);
    });

    it('should throw on unknown event', () => {
      expect(() => KitchenEventVersionResolver.resolveInboundVersion('Unknown', '1.0')).toThrow();
    });
  });

  describe('KitchenContractValidator', () => {
    it('should validate inbound payload strictly', () => {
      expect(() => KitchenContractValidator.validateInboundPayload('OrderCancelled', { orderId: 'o-1', reason: 'test' })).not.toThrow();
      expect(() => KitchenContractValidator.validateInboundPayload('OrderCancelled', { orderId: 'o-1' })).toThrow(); // missing reason
    });
  });

  describe('KitchenIntegrationMapper', () => {
    it('should map valid payload to integration context', () => {
      const ctx = KitchenIntegrationMapper.mapInboundEventToContext(
        'OrderCancelled',
        { orderId: 'o-1', reason: 'test' },
        'corr-1',
        '1.0'
      );
      expect(ctx.correlationId.value).toBe('corr-1');
      expect(ctx.eventName).toBe('OrderCancelled');
      expect(ctx.version.value).toBe('1.0');
    });
  });

  describe('KitchenEventFactory', () => {
    const createContext = () => KitchenIntegrationContext.create(
      KitchenCorrelationId.create('corr-1'),
      KitchenEventVersion.create(1, 0),
      'TestEvent',
      {}
    );

    it('should create integration started event if not processed', () => {
      const ctx = createContext();
      const processed = new Set<string>();
      const event = KitchenEventFactory.createIntegrationStarted(ctx, processed);
      expect(event.getAggregateId()).toBe('corr-1');
    });

    it('should throw on integration started if duplicate', () => {
      const ctx = createContext();
      const processed = new Set(['corr-1']);
      expect(() => KitchenEventFactory.createIntegrationStarted(ctx, processed)).toThrow();
    });

    it('should create completed event', () => {
      const ctx = createContext();
      const event = KitchenEventFactory.createIntegrationCompleted(ctx, { success: true });
      expect(event.getAggregateId()).toBe('corr-1');
      expect(event.resultPayload.success).toBe(true);
    });

    it('should create failed event', () => {
      const ctx = createContext();
      const event = KitchenEventFactory.createIntegrationFailed(ctx, 'Failed parsing');
      expect(event.getAggregateId()).toBe('corr-1');
      expect(event.reason).toBe('Failed parsing');
    });
  });
});
