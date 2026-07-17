import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { PaymentAmount } from './payment-amount.value-object';
import { PaymentStatus } from './payment-status.value-object';
import { PaymentType } from './payment-type.value-object';
import { PaymentReference } from './payment-reference.value-object';

describe('Payment Domain', () => {
  describe('PaymentAmount', () => {
    it('should throw if amount is less than or equal to zero', () => {
      assert.throws(() => new PaymentAmount(0, 'USD'), /amount must be greater than zero/);
      assert.throws(() => new PaymentAmount(-100, 'USD'), /amount must be greater than zero/);
    });

    it('should validate exact currency mapping', () => {
      const amount = new PaymentAmount(1500, 'EUR');
      assert.strictEqual(amount.matchesCurrency('EUR'), true);
      assert.strictEqual(amount.matchesCurrency('USD'), false);
    });
  });

  describe('PaymentStatus', () => {
    it('should identify terminal refunded status', () => {
      assert.strictEqual(new PaymentStatus('Refunded').isTerminal(), true);
      assert.strictEqual(new PaymentStatus('Captured').isTerminal(), false);
    });

    it('should block cancelled from capturing', () => {
      const cancelled = new PaymentStatus('Cancelled');
      assert.strictEqual(cancelled.canTransitionTo('Captured'), false);
    });

    it('should block all transitions from terminal refunded state', () => {
      const refunded = new PaymentStatus('Refunded');
      assert.strictEqual(refunded.canTransitionTo('Pending'), false);
      assert.strictEqual(refunded.canTransitionTo('Cancelled'), false);
    });

    it('should lock amount modification if Captured, Refunded, or Cancelled', () => {
      assert.strictEqual(new PaymentStatus('Captured').canChangeAmount(), false);
      assert.strictEqual(new PaymentStatus('Refunded').canChangeAmount(), false);
      assert.strictEqual(new PaymentStatus('Cancelled').canChangeAmount(), false);
      assert.strictEqual(new PaymentStatus('Pending').canChangeAmount(), true);
    });
  });

  describe('PaymentType', () => {
    it('should allow valid types', () => {
      assert.doesNotThrow(() => new PaymentType('Online'));
      assert.doesNotThrow(() => new PaymentType('GiftCard'));
    });

    it('should reject invalid types', () => {
      assert.throws(() => new PaymentType('Bitcoin' as any), /Invalid Payment Type/);
    });
  });

  describe('PaymentReference', () => {
    it('should reject empty references', () => {
      assert.throws(() => new PaymentReference(''), /reference cannot be empty/);
      assert.throws(() => new PaymentReference('   '), /reference cannot be empty/);
    });
  });
});
