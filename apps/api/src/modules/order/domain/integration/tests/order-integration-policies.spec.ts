import { IntegrationCompatibilityPolicy } from '../policies/integration-compatibility.policy';
import { IntegrationVersionPolicy } from '../policies/integration-version.policy';
import { OrderEventVersion } from '../value-objects/order-event-version.value-object';

describe('Order Integration Policies', () => {
  describe('IntegrationCompatibilityPolicy', () => {
    let policy: IntegrationCompatibilityPolicy;

    beforeEach(() => {
      policy = new IntegrationCompatibilityPolicy();
    });

    it('should succeed for matching major versions', () => {
      const producerVersion = OrderEventVersion.create(1, 2);
      const consumerVersion = OrderEventVersion.create(1, 0);

      const result = policy.evaluate(producerVersion, consumerVersion);
      expect('isSuccess' in result).toBe(true);
    });

    it('should fail for mismatched major versions', () => {
      const producerVersion = OrderEventVersion.create(2, 0);
      const consumerVersion = OrderEventVersion.create(1, 0);

      const result = policy.evaluate(producerVersion, consumerVersion);
      expect('isFailure' in result).toBe(true);
      if ('isFailure' in result) {
        expect(result.error).toMatch(/Incompatible integration contract versions/);
      }
    });
  });

  describe('IntegrationVersionPolicy', () => {
    let policy: IntegrationVersionPolicy;

    beforeEach(() => {
      policy = new IntegrationVersionPolicy();
    });

    it('should prevent downgrading major version', () => {
      const v2 = OrderEventVersion.create(2, 0);
      const v1 = OrderEventVersion.create(1, 0);

      expect(policy.validateBump(v2, v1)).toBe(false);
    });

    it('should prevent downgrading minor version on same major', () => {
      const v1_2 = OrderEventVersion.create(1, 2);
      const v1_1 = OrderEventVersion.create(1, 1);

      expect(policy.validateBump(v1_2, v1_1)).toBe(false);
    });

    it('should allow bumping minor version', () => {
      const v1_1 = OrderEventVersion.create(1, 1);
      const v1_2 = OrderEventVersion.create(1, 2);

      expect(policy.validateBump(v1_1, v1_2)).toBe(true);
    });
  });
});
