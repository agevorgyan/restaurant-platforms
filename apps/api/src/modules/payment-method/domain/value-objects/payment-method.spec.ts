import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { PaymentMethodConfiguration } from './payment-method-configuration.value-object';
import { PaymentMethodAvailability } from './payment-method-availability.value-object';

describe('Payment Method Domain', () => {
  describe('PaymentMethodConfiguration', () => {
    it('should throw if non-manual provider has no settings', () => {
      assert.throws(() => new PaymentMethodConfiguration('Stripe', {}), /settings are required for provider/);
      assert.doesNotThrow(() => new PaymentMethodConfiguration('Stripe', { publicKey: 'test' }));
    });

    it('should not throw if manual provider has no settings', () => {
      assert.doesNotThrow(() => new PaymentMethodConfiguration('Manual', {}));
    });
  });

  describe('PaymentMethodAvailability', () => {
    it('should allow only active status to be selected', () => {
      assert.strictEqual(new PaymentMethodAvailability('Active').canBeSelected(), true);
      assert.strictEqual(new PaymentMethodAvailability('Inactive').canBeSelected(), false);
      assert.strictEqual(new PaymentMethodAvailability('Disabled').canBeSelected(), false);
    });

    it('should reject invalid status strings', () => {
      assert.throws(() => new PaymentMethodAvailability('InvalidStatus' as any), /Invalid Payment Method Status/);
    });
  });
});
