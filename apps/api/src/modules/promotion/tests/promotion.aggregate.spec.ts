import { Promotion } from '../domain/aggregates/promotion.aggregate';
import { PromotionId } from '../domain/value-objects/promotion-id.value-object';
import { PromotionName } from '../domain/value-objects/promotion-name.value-object';
import { PromotionType } from '../domain/value-objects/promotion-type.value-object';
import { PromotionPeriod } from '../domain/value-objects/promotion-period.value-object';
import { PromotionLimit } from '../domain/value-objects/promotion-limit.value-object';
import { PromotionPriority } from '../domain/value-objects/promotion-priority.value-object';
import { PromotionRule } from '../domain/entities/promotion-rule.entity';

describe('Promotion Aggregate', () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);
  
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 10);

  const activePeriod = PromotionPeriod.create(pastDate, futureDate);

  it('should create a valid Promotion in Draft status', () => {
    const promotion = Promotion.create(
      PromotionId.create('promo-1'),
      PromotionName.create('Summer Sale'),
      PromotionType.create('Percentage'),
      activePeriod
    );

    expect(promotion.promotionId.value).toBe('promo-1');
    expect(promotion.status.value).toBe('Draft');
    expect(promotion.domainEvents).toHaveLength(1);
    expect(promotion.domainEvents[0].constructor.name).toBe('PromotionCreated');
  });

  it('should prevent activation if no rules are present', () => {
    const promotion = Promotion.create(
      PromotionId.create('promo-2'),
      PromotionName.create('Empty Promo'),
      PromotionType.create('Percentage'),
      activePeriod
    );

    expect(() => promotion.activate()).toThrow('Promotion cannot be activated without at least one rule');
  });

  it('should activate successfully with rules and emit event', () => {
    const promotion = Promotion.create(
      PromotionId.create('promo-3'),
      PromotionName.create('Valid Promo'),
      PromotionType.create('Percentage'),
      activePeriod
    );

    promotion.addRule(PromotionRule.create({ id: 'rule-1', name: 'Rule 1', conditions: [] }));
    promotion.activate();

    expect(promotion.status.value).toBe('Active');
    const events = promotion.domainEvents;
    expect(events[events.length - 1].constructor.name).toBe('PromotionActivated');
  });

  it('should successfully record usage and enforce limits', () => {
    const promotion = Promotion.create(
      PromotionId.create('promo-4'),
      PromotionName.create('Limited Promo'),
      PromotionType.create('Percentage'),
      activePeriod,
      PromotionPriority.create(1),
      PromotionLimit.create(1, 0)
    );

    promotion.addRule(PromotionRule.create({ id: 'rule-1', name: 'Rule 1', conditions: [] }));
    promotion.activate();

    expect(promotion.canBeApplied()).toBe(true);
    promotion.recordUsage();

    expect(promotion.canBeApplied()).toBe(false);
    expect(() => promotion.recordUsage()).toThrow('Promotion cannot be applied');
  });
});
