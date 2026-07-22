import { KitchenCorrelationId } from '../value-objects/acl/kitchen-correlation-id.value-object';
import { KitchenCausationId } from '../value-objects/acl/kitchen-causation-id.value-object';
import { KitchenEventVersion } from '../value-objects/acl/kitchen-event-version.value-object';
import { KitchenEventPriorityLevel } from '../value-objects/acl/kitchen-event-priority.value-object';
import { KitchenIntegrationContext } from '../value-objects/acl/kitchen-integration-context.value-object';

describe('Kitchen ACL Value Objects', () => {
  describe('KitchenCorrelationId', () => {
    it('should create valid id', () => {
      const id = KitchenCorrelationId.create('corr-1');
      expect(id.value).toBe('corr-1');
    });

    it('should generate valid uuid', () => {
      const id = KitchenCorrelationId.generate();
      expect(id.value).toBeDefined();
    });

    it('should throw on empty string', () => {
      expect(() => KitchenCorrelationId.create('')).toThrow();
    });
  });

  describe('KitchenCausationId', () => {
    it('should create valid id', () => {
      const id = KitchenCausationId.create('cause-1');
      expect(id.value).toBe('cause-1');
    });

    it('should throw on empty', () => {
      expect(() => KitchenCausationId.create('')).toThrow();
    });
  });

  describe('KitchenEventVersion', () => {
    it('should create version', () => {
      const v = KitchenEventVersion.create(1, 2);
      expect(v.major).toBe(1);
      expect(v.minor).toBe(2);
      expect(v.value).toBe('1.2');
    });

    it('should parse from string', () => {
      const v = KitchenEventVersion.fromString('2.0');
      expect(v.major).toBe(2);
      expect(v.minor).toBe(0);
    });

    it('should throw on invalid format', () => {
      expect(() => KitchenEventVersion.fromString('1.a')).toThrow();
    });
  });

  describe('KitchenIntegrationContext', () => {
    it('should create valid context', () => {
      const corr = KitchenCorrelationId.create('corr-1');
      const ver = KitchenEventVersion.create(1, 0);
      const ctx = KitchenIntegrationContext.create(corr, ver, 'TestEvent', { data: 'test' });
      
      expect(ctx.correlationId.value).toBe('corr-1');
      expect(ctx.eventName).toBe('TestEvent');
      expect(ctx.priority.level).toBe(KitchenEventPriorityLevel.NORMAL);
      expect(ctx.payload.data).toBe('test');
    });

    it('should throw on empty event name', () => {
      const corr = KitchenCorrelationId.create('corr-1');
      const ver = KitchenEventVersion.create(1, 0);
      expect(() => KitchenIntegrationContext.create(corr, ver, '', { data: 'test' })).toThrow();
    });
  });
});
