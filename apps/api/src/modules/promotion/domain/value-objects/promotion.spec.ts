import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { PromotionReward } from './promotion-reward.value-object';
import { PromotionValidity } from './promotion-validity.value-object';
import { PromotionUsageLimit } from './promotion-usage-limit.value-object';

describe('Promotion Domain Value Objects', () => {
  describe('PromotionReward', () => {
    it('should validate percentage bounds', () => {
      // Valid
      assert.doesNotThrow(() => new PromotionReward('Percentage', 50));
      // Invalid
      assert.throws(() => new PromotionReward('Percentage', 150), /Percentage discount must be between 0 and 100/);
      assert.throws(() => new PromotionReward('Percentage', -10), /Percentage discount must be between 0 and 100/);
    });

    it('should validate fixed amount bounds', () => {
      // Valid
      assert.doesNotThrow(() => new PromotionReward('FixedAmount', 10));
      // Invalid
      assert.throws(() => new PromotionReward('FixedAmount', 0), /Fixed amount must be greater than zero/);
      assert.throws(() => new PromotionReward('FixedAmount', -5), /Fixed amount must be greater than zero/);
    });

    it('should validate BuyXGetY bounds', () => {
      // Valid
      assert.doesNotThrow(() => new PromotionReward('BuyXGetY', undefined, 2, 1));
      // Invalid
      assert.throws(() => new PromotionReward('BuyXGetY', undefined, 0, 1), /BuyXGetY requires valid buy and reward quantities/);
      assert.throws(() => new PromotionReward('BuyXGetY', undefined, 2, 0), /BuyXGetY requires valid buy and reward quantities/);
    });
  });

  describe('PromotionValidity', () => {
    it('should throw if end date is before start date', () => {
      const start = new Date('2024-01-02');
      const end = new Date('2024-01-01');
      assert.throws(() => new PromotionValidity(start, end), /Validity end date must not be before start date/);
    });

    it('should determine active status natively', () => {
      const past = new Date('2024-01-01');
      const future = new Date('2025-01-01');
      
      const validity = new PromotionValidity(past, future);
      assert.strictEqual(validity.isActive(new Date('2024-06-01')), true);
      assert.strictEqual(validity.isActive(new Date('2026-01-01')), false); // Past end date
      assert.strictEqual(validity.isActive(new Date('2023-01-01')), false); // Before start date
    });
  });

  describe('PromotionUsageLimit', () => {
    it('should block negative usage mapping', () => {
      assert.throws(() => new PromotionUsageLimit(-5), /Usage limits must never be negative/);
      assert.throws(() => new PromotionUsageLimit(10, -1), /Current uses cannot be negative/);
    });

    it('should determine usage limits dynamically', () => {
      const limit = new PromotionUsageLimit(5, 4);
      assert.strictEqual(limit.canBeUsed(), true);
      
      const incremented = limit.increment();
      assert.strictEqual(incremented.currentUses, 5);
      assert.strictEqual(incremented.canBeUsed(), false);

      assert.throws(() => incremented.increment(), /Promotion usage limit reached/);
    });
  });
});
