import { KitchenIntegrationSpecification, EventVersionSpecification, KitchenContractSpecification } from '../specifications/acl.specification';
import { KitchenIntegrationPolicy, EventRoutingPolicy, VersionCompatibilityPolicy } from '../policies/acl.policy';
import { KitchenCorrelationId } from '../value-objects/acl/kitchen-correlation-id.value-object';
import { KitchenEventVersion } from '../value-objects/acl/kitchen-event-version.value-object';
import { KitchenIntegrationContext } from '../value-objects/acl/kitchen-integration-context.value-object';

describe('Kitchen ACL Specifications & Policies', () => {
  const createContext = (corrId: string) => {
    return KitchenIntegrationContext.create(
      KitchenCorrelationId.create(corrId),
      KitchenEventVersion.create(1, 0),
      'TestEvent',
      {}
    );
  };

  describe('KitchenIntegrationSpecification / Policy', () => {
    it('should detect duplicate integration', () => {
      const ctx = createContext('corr-1');
      const processed = new Set(['corr-1']);
      expect(KitchenIntegrationSpecification.isDuplicateIntegration(ctx, processed)).toBe(true);
      expect(() => KitchenIntegrationPolicy.ensureIdempotency(ctx, processed)).toThrow();
    });

    it('should pass non-duplicate', () => {
      const ctx = createContext('corr-2');
      const processed = new Set(['corr-1']);
      expect(KitchenIntegrationSpecification.isDuplicateIntegration(ctx, processed)).toBe(false);
      expect(() => KitchenIntegrationPolicy.ensureIdempotency(ctx, processed)).not.toThrow();
    });
  });

  describe('EventVersionSpecification / VersionCompatibilityPolicy', () => {
    it('should accept supported versions (backward compatible)', () => {
      const incoming = KitchenEventVersion.create(1, 0); // Event is v1.0
      const supported = [KitchenEventVersion.create(1, 5)]; // We support up to v1.5

      expect(EventVersionSpecification.isSupportedVersion(incoming, supported)).toBe(true);
      expect(() => VersionCompatibilityPolicy.ensureCompatibleVersion(incoming, supported)).not.toThrow();
    });

    it('should reject incompatible major versions', () => {
      const incoming = KitchenEventVersion.create(2, 0);
      const supported = [KitchenEventVersion.create(1, 0)];

      expect(EventVersionSpecification.isSupportedVersion(incoming, supported)).toBe(false);
      expect(() => VersionCompatibilityPolicy.ensureCompatibleVersion(incoming, supported)).toThrow();
    });
  });

  describe('KitchenContractSpecification / EventRoutingPolicy', () => {
    it('should accept valid routing', () => {
      const registered = new Set(['OrderCancelled']);
      expect(EventRoutingPolicy.canRouteEvent('OrderCancelled', registered)).toBe(true);
      expect(() => EventRoutingPolicy.validateRouting('OrderCancelled', registered)).not.toThrow();
    });

    it('should validate contract payload fields', () => {
      const payload = { orderId: 'o-1', reason: 'Customer requested' };
      expect(KitchenContractSpecification.isValidContractPayload(payload, ['orderId', 'reason'])).toBe(true);
      expect(KitchenContractSpecification.isValidContractPayload(payload, ['orderId', 'missingField'])).toBe(false);
    });
  });
});
