import { PromotionReward } from '../domain/entities/promotion-reward.entity';
import { PromotionPeriod } from '../domain/value-objects/promotion-period.value-object';
import { PromotionLimit } from '../domain/value-objects/promotion-limit.value-object';

describe('Promotion Domain Value Objects', () => {
  describe('PromotionReward', () => {
    it('should validate percentage bounds', () => {
      expect(() => PromotionReward.create({ id: '1', type: 'Percentage', value: 50 })).not.toThrow();
      expect(() => PromotionReward.create({ id: '2', type: 'Percentage', value: 150 })).toThrow('Percentage discount must be between 0 and 100');
    });

    it('should validate fixed amount bounds', () => {
      expect(() => PromotionReward.create({ id: '3', type: 'FixedAmount', value: 10 })).not.toThrow();
      expect(() => PromotionReward.create({ id: '4', type: 'FixedAmount', value: -5 })).toThrow('Fixed amount must be greater than zero');
    });

    it('should validate BuyXGetY bounds', () => {
      expect(() => PromotionReward.create({ id: '5', type: 'BuyXGetY', buyQuantity: 2, getQuantity: 1 })).not.toThrow();
      expect(() => PromotionReward.create({ id: '6', type: 'BuyXGetY', buyQuantity: 0, getQuantity: 1 })).toThrow('BuyXGetY requires valid buy and reward quantities');
    });
  });

  describe('PromotionPeriod', () => {
    it('should throw if end date is before start date', () => {
      const start = new Date('2024-01-02');
      const end = new Date('2024-01-01');
      expect(() => PromotionPeriod.create(start, end)).toThrow('Validity end date must not be before start date');
    });

    it('should determine active status natively', () => {
      const past = new Date('2024-01-01');
      const future = new Date('2025-01-01');
      
      const period = PromotionPeriod.create(past, future);
      expect(period.isActive(new Date('2024-06-01'))).toBe(true);
      expect(period.isActive(new Date('2026-01-01'))).toBe(false);
    });
  });

  describe('PromotionLimit', () => {
    it('should block negative usage mapping', () => {
      expect(() => PromotionLimit.create(-5)).toThrow('Usage limits must never be negative');
    });

    it('should determine usage limits dynamically', () => {
      const limit = PromotionLimit.create(5, 4);
      expect(limit.canBeUsed()).toBe(true);
      
      const incremented = limit.increment();
      expect(incremented.currentUses).toBe(5);
      expect(incremented.canBeUsed()).toBe(false);

      expect(() => incremented.increment()).toThrow('Promotion usage limit reached');
    });
  });
});
