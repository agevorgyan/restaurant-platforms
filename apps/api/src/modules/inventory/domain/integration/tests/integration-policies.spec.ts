import { IntegrationPolicy } from '../policies/integration.policy';
import { VersionPolicy } from '../policies/version.policy';
import { EventRoutingPolicy } from '../policies/event-routing.policy';
import { InventoryEventVersion } from '../value-objects/inventory-event-version.value-object';
describe('Integration Policies', () => {
  describe('IntegrationPolicy', () => {
    it('should reject already processed events (idempotency)', () => {
      const payload = { metadata: { eventId: 'processed123' } } as any;
      const result = IntegrationPolicy.canProcess(payload, ['processed123']);
      expect(result.isAllowed).toBe(false);
      expect(result.reason).toContain('already processed');
    });

    it('should allow unprocessed events', () => {
      const payload = { metadata: { eventId: 'new123' } } as any;
      const result = IntegrationPolicy.canProcess(payload, ['processed123']);
      expect(result.isAllowed).toBe(true);
    });
  });

  describe('VersionPolicy', () => {
    it('should enforce compatibility and throw if incompatible', () => {
      const payload = { metadata: { version: 'v2.0' } } as any;
      const minVersion = InventoryEventVersion.create(1, 0);

      expect(() => VersionPolicy.enforceCompatibility(payload, minVersion)).toThrow('incompatible');
    });

    it('should pass for compatible version', () => {
      const payload = { metadata: { version: 'v1.5' } } as any;
      const minVersion = InventoryEventVersion.create(1, 0);

      expect(() => VersionPolicy.enforceCompatibility(payload, minVersion)).not.toThrow();
    });
  });

  describe('EventRoutingPolicy', () => {
    it('should identify high priority events', () => {
      const payload = { metadata: { priority: 'HIGH' } } as any;
      expect(EventRoutingPolicy.requiresImmediateProcessing(payload)).toBe(true);
      expect(EventRoutingPolicy.canBeDroppedIfOverloaded(payload)).toBe(false);
    });

    it('should identify low priority events that can be dropped', () => {
      const payload = { metadata: { priority: 'LOW' } } as any;
      expect(EventRoutingPolicy.requiresImmediateProcessing(payload)).toBe(false);
      expect(EventRoutingPolicy.canBeDroppedIfOverloaded(payload)).toBe(true);
    });
  });
});
