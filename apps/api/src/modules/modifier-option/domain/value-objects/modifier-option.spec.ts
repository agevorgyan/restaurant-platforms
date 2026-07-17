import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ModifierOptionStatus } from './modifier-option-status.value-object';
import { ModifierOptionAvailability } from './modifier-option-availability.value-object';
import { ModifierOptionPrice } from './modifier-option-price.value-object';

describe('Modifier Option Domain Value Objects', () => {
  describe('ModifierOptionStatus', () => {
    it('should create valid statuses', () => {
      const active = new ModifierOptionStatus('Active');
      const archived = new ModifierOptionStatus('Archived');
      
      assert.strictEqual(active.value, 'Active');
      assert.strictEqual(archived.value, 'Archived');
      assert.strictEqual(archived.isArchived(), true);
      assert.strictEqual(active.isArchived(), false);
    });

    it('should throw on invalid status', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new ModifierOptionStatus('InvalidStatus'));
    });
  });

  describe('ModifierOptionAvailability', () => {
    it('should create valid availability', () => {
      const available = new ModifierOptionAvailability('Available');
      const hidden = new ModifierOptionAvailability('Hidden');
      
      assert.strictEqual(available.value, 'Available');
      assert.strictEqual(hidden.value, 'Hidden');
      assert.strictEqual(available.isAvailable(), true);
      assert.strictEqual(hidden.isAvailable(), false);
    });

    it('should throw on invalid availability', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new ModifierOptionAvailability('InvalidVis'));
    });
  });

  describe('ModifierOptionPrice', () => {
    it('should create a valid product price adjustment', () => {
      const price = new ModifierOptionPrice(-2.50, 'USD');
      assert.strictEqual(price.priceAdjustment, -2.50);
      assert.strictEqual(price.currency, 'USD');
    });

    it('should validate against base price correctly', () => {
      const price = new ModifierOptionPrice(-5.00, 'USD');
      
      // Base price 10.00, -5.00 adjustment = 5.00 (Valid)
      assert.strictEqual(price.canApplyTo(10.00), true);
      
      // Base price 5.00, -5.00 adjustment = 0.00 (Valid)
      assert.strictEqual(price.canApplyTo(5.00), true);
      
      // Base price 3.00, -5.00 adjustment = -2.00 (Invalid - Negative final price)
      assert.strictEqual(price.canApplyTo(3.00), false);
    });
  });
});
