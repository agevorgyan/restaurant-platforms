import { Coupon } from './coupon.aggregate';
import { CouponId } from '../value-objects/coupon-id.value-object';
import { CouponCode } from '../value-objects/coupon-code.value-object';
import { CouponAssignment } from '../value-objects/coupon-assignment.value-object';
import { CouponValidityPeriod } from '../value-objects/coupon-validity-period.value-object';
import { CouponUsageLimit } from '../value-objects/coupon-usage-limit.value-object';
import { CouponUsagePolicy } from '../entities/coupon-usage-policy.entity';
import { CouponStatusEnum } from '../value-objects/coupon-status.value-object';

describe('Coupon Aggregate', () => {
  const validCouponId = 'coupon-1';
  const validPromotionId = 'promo-1';
  const validCode = 'SUMMER2026';
  
  let couponId: CouponId;
  let code: CouponCode;
  let assignment: CouponAssignment;
  let period: CouponValidityPeriod;

  beforeEach(() => {
    couponId = CouponId.create(validCouponId);
    code = CouponCode.create(validCode);
    assignment = CouponAssignment.create(validPromotionId);
    period = CouponValidityPeriod.create(new Date('2026-01-01'), new Date('2026-12-31'));
  });

  describe('Creation', () => {
    it('should create a valid coupon in Draft status', () => {
      const coupon = Coupon.create(couponId, code, assignment, period);
      
      expect(coupon.id).toBe(validCouponId);
      expect(coupon.code.value).toBe(validCode);
      expect(coupon.status.value).toBe(CouponStatusEnum.DRAFT);
      expect(coupon.domainEvents.length).toBe(1);
      expect(coupon.domainEvents[0].constructor.name).toBe('CouponCreated');
    });

    it('should throw an error if coupon code is empty', () => {
      expect(() => CouponCode.create('')).toThrow('Coupon code cannot be empty');
    });

    it('should throw an error if coupon code format is invalid', () => {
      expect(() => CouponCode.create('INVALID CODE!')).toThrow('Coupon code format is invalid');
    });
  });

  describe('Activation & Deactivation', () => {
    it('should activate a draft coupon', () => {
      const coupon = Coupon.create(couponId, code, assignment, period);
      coupon.activate();
      expect(coupon.status.value).toBe(CouponStatusEnum.ACTIVE);
      expect(coupon.domainEvents[1].constructor.name).toBe('CouponActivated');
    });

    it('should deactivate an active coupon', () => {
      const coupon = Coupon.create(couponId, code, assignment, period);
      coupon.activate();
      coupon.deactivate('Seasonal end');
      expect(coupon.status.value).toBe(CouponStatusEnum.INACTIVE);
      expect(coupon.domainEvents[2].constructor.name).toBe('CouponDeactivated');
    });

    it('should not activate if expired', () => {
      const pastPeriod = CouponValidityPeriod.create(new Date('2025-01-01'), new Date('2025-12-31'));
      const coupon = Coupon.create(couponId, code, assignment, pastPeriod);
      expect(() => coupon.activate()).toThrow('Cannot activate an expired coupon');
    });
  });

  describe('Redemption & Limits', () => {
    let activeCoupon: Coupon;

    beforeEach(() => {
      const usageLimit = CouponUsageLimit.create(2, 1);
      const activePeriod = CouponValidityPeriod.create(new Date('2020-01-01'), new Date('2030-12-31'));
      activeCoupon = Coupon.create(couponId, code, assignment, activePeriod, usageLimit);
      activeCoupon.activate();
    });

    it('should redeem a coupon successfully', () => {
      activeCoupon.redeem('redemption-1', 'customer-1', 'order-1');
      expect(activeCoupon.redemptions.length).toBe(1);
      expect(activeCoupon.redemptionLimit.currentTotalUses).toBe(1);
      expect(activeCoupon.status.value).toBe(CouponStatusEnum.ACTIVE);
    });

    it('should fail to redeem if coupon is not active', () => {
      activeCoupon.deactivate();
      expect(() => activeCoupon.redeem('redemption-1', 'customer-1', 'order-1')).toThrow('Coupon cannot be redeemed');
    });

    it('should enforce per-customer usage limit', () => {
      activeCoupon.redeem('redemption-1', 'customer-1', 'order-1');
      expect(() => activeCoupon.redeem('redemption-2', 'customer-1', 'order-2')).toThrow('Customer has reached the usage limit');
    });

    it('should enforce global usage limit and transition to EXHAUSTED', () => {
      activeCoupon.redeem('redemption-1', 'customer-1', 'order-1');
      activeCoupon.redeem('redemption-2', 'customer-2', 'order-2');
      
      expect(activeCoupon.status.value).toBe(CouponStatusEnum.EXHAUSTED);
      expect(activeCoupon.domainEvents.some(e => e.constructor.name === 'CouponUsageLimitReached')).toBeTruthy();
      
      expect(() => activeCoupon.redeem('redemption-3', 'customer-3', 'order-3')).toThrow('Coupon cannot be redeemed. Current status: Exhausted');
    });
    
    it('should enforce one coupon per order', () => {
      activeCoupon.redeem('redemption-1', 'customer-1', 'order-1');
      expect(() => activeCoupon.redeem('redemption-2', 'customer-2', 'order-1')).toThrow('Coupon has already been applied to this order');
    });
  });

  describe('Usage Policies', () => {
    it('should fail redemption if policy is not satisfied', () => {
      const activePeriod = CouponValidityPeriod.create(new Date('2020-01-01'), new Date('2030-12-31'));
      const coupon = Coupon.create(couponId, code, assignment, activePeriod);
      coupon.activate();

      const policy = CouponUsagePolicy.create('policy-1', { minOrderAmount: 50 });
      coupon.addPolicy(policy);

      expect(() => coupon.redeem('redemption-1', 'customer-1', 'order-1', { orderAmount: 30 }))
        .toThrow('Coupon usage policy not satisfied');
        
      expect(() => coupon.redeem('redemption-1', 'customer-1', 'order-1', { orderAmount: 60 }))
        .not.toThrow();
    });
  });
});
