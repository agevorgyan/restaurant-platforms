import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { PaymentLimits } from './payment-limits.value-object';
import { SplitPaymentPolicy } from './split-payment-policy.value-object';
import { PaymentTimeoutPolicy, PaymentRetryPolicy, CurrencyPolicy, PolicyStatus } from './payment-policy-shared.value-object';

describe('Payment Policy Domain', () => {
  describe('PaymentLimits', () => {
    it('should throw if min amount is not greater than zero', () => {
      assert.throws(() => new PaymentLimits(0, 100), /Minimum payment amount must be greater than zero/);
    });

    it('should throw if max amount is less than min amount', () => {
      assert.throws(() => new PaymentLimits(50, 10), /Maximum payment amount must be greater than or equal to/);
    });

    it('should allow valid limits', () => {
      assert.doesNotThrow(() => new PaymentLimits(10, 100));
      assert.doesNotThrow(() => new PaymentLimits(10, 10));
    });
  });

  describe('SplitPaymentPolicy', () => {
    it('should enforce split bounds when allowed', () => {
      assert.throws(() => new SplitPaymentPolicy(true, 1), /If split payments are allowed, max splits must be at least 2/);
      assert.doesNotThrow(() => new SplitPaymentPolicy(true, 3));
    });

    it('should enforce max split exactly 1 when not allowed', () => {
      assert.throws(() => new SplitPaymentPolicy(false, 2), /If split payments are not allowed, max splits must be exactly 1/);
      assert.doesNotThrow(() => new SplitPaymentPolicy(false, 1));
    });
  });

  describe('Shared Policies', () => {
    it('should validate timeout greater than zero', () => {
      assert.throws(() => new PaymentTimeoutPolicy(0), /Timeout duration must be greater than zero/);
      assert.doesNotThrow(() => new PaymentTimeoutPolicy(60));
    });

    it('should validate retry zero or greater', () => {
      assert.throws(() => new PaymentRetryPolicy(-1), /Retry attempts must be zero or greater/);
      assert.doesNotThrow(() => new PaymentRetryPolicy(0));
      assert.doesNotThrow(() => new PaymentRetryPolicy(3));
    });

    it('should validate at least one currency is provided', () => {
      assert.throws(() => new CurrencyPolicy([]), /At least one supported currency is required/);
      assert.doesNotThrow(() => new CurrencyPolicy(['USD']));
    });

    it('should identify active policies correctly', () => {
      assert.strictEqual(new PolicyStatus('Active').canBeApplied(), true);
      assert.strictEqual(new PolicyStatus('Draft').canBeApplied(), false);
      assert.strictEqual(new PolicyStatus('Inactive').canBeApplied(), false);
    });
  });
});
