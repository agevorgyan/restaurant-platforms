import { AggregateRoot } from '@saas/core';
import { CouponId } from '../value-objects/coupon-id.value-object';
import { CouponCode } from '../value-objects/coupon-code.value-object';
import { CouponStatus, CouponStatusEnum } from '../value-objects/coupon-status.value-object';
import { CouponValidityPeriod } from '../value-objects/coupon-validity-period.value-object';
import { CouponUsageLimit } from '../value-objects/coupon-usage-limit.value-object';
import { CouponRedemptionLimit } from '../value-objects/coupon-redemption-limit.value-object';
import { CouponAssignment } from '../value-objects/coupon-assignment.value-object';
import { CouponRedemption } from '../entities/coupon-redemption.entity';
import { CouponUsagePolicy } from '../entities/coupon-usage-policy.entity';
import {
  CouponCreated,
  CouponActivated,
  CouponDeactivated,
  CouponRedeemed,
  CouponExpired,
  CouponUsageLimitReached,
} from '../events/coupon-events';

export interface CouponProps {
  id: CouponId;
  code: CouponCode;
  status: CouponStatus;
  assignment: CouponAssignment;
  validityPeriod: CouponValidityPeriod;
  usageLimit?: CouponUsageLimit;
  redemptionLimit: CouponRedemptionLimit;
  redemptions: CouponRedemption[];
  policies: CouponUsagePolicy[];
}

export class Coupon extends AggregateRoot<CouponProps> {
  private constructor(props: CouponProps) {
    super(props.id.value, props);
  }

  public static create(
    id: CouponId,
    code: CouponCode,
    assignment: CouponAssignment,
    validityPeriod: CouponValidityPeriod,
    usageLimit?: CouponUsageLimit
  ): Coupon {
    const coupon = new Coupon({
      id,
      code,
      status: CouponStatus.initial(),
      assignment,
      validityPeriod,
      usageLimit,
      redemptionLimit: CouponRedemptionLimit.initial(),
      redemptions: [],
      policies: [],
    });

    coupon.addDomainEvent(
      new CouponCreated(id.value, code.value, assignment.promotionId)
    );

    return coupon;
  }

  // Getters
  get couponId(): CouponId { return this.props.id; }
  get code(): CouponCode { return this.props.code; }
  get status(): CouponStatus { return this.props.status; }
  get assignment(): CouponAssignment { return this.props.assignment; }
  get validityPeriod(): CouponValidityPeriod { return this.props.validityPeriod; }
  get usageLimit(): CouponUsageLimit | undefined { return this.props.usageLimit; }
  get redemptionLimit(): CouponRedemptionLimit { return this.props.redemptionLimit; }
  get redemptions(): CouponRedemption[] { return [...this.props.redemptions]; }
  get policies(): CouponUsagePolicy[] { return [...this.props.policies]; }

  // Business logic

  public activate(): void {
    if (this.props.status.isActive()) {
      throw new Error('Coupon is already active');
    }
    if (this.props.status.isExpired()) {
      throw new Error('Cannot activate an expired coupon');
    }
    if (this.props.status.isExhausted()) {
      throw new Error('Cannot activate an exhausted coupon');
    }
    
    // Check if period is valid right now if start date exists
    if (this.props.validityPeriod.startDate && new Date() < this.props.validityPeriod.startDate) {
      throw new Error('Cannot activate coupon before its start date');
    }
    
    // Check if period is already expired
    if (this.props.validityPeriod.isExpired(new Date())) {
      throw new Error('Cannot activate an expired coupon');
    }

    this.props.status = CouponStatus.create(CouponStatusEnum.ACTIVE);
    this.addDomainEvent(new CouponActivated(this.id));
  }

  public deactivate(reason?: string): void {
    if (this.props.status.isInactive()) {
      throw new Error('Coupon is already inactive');
    }
    if (this.props.status.isExpired() || this.props.status.isExhausted()) {
      throw new Error('Cannot deactivate an expired or exhausted coupon');
    }

    this.props.status = CouponStatus.create(CouponStatusEnum.INACTIVE);
    this.addDomainEvent(new CouponDeactivated(this.id, reason));
  }

  public expire(): void {
    if (this.props.status.isExpired()) return;

    this.props.status = CouponStatus.create(CouponStatusEnum.EXPIRED);
    this.addDomainEvent(new CouponExpired(this.id));
  }

  public addPolicy(policy: CouponUsagePolicy): void {
    if (this.props.status.isExpired() || this.props.status.isExhausted()) {
      throw new Error('Cannot modify policies for an expired or exhausted coupon');
    }
    this.props.policies.push(policy);
  }

  public removePolicy(policyId: string): void {
    if (this.props.status.isExpired() || this.props.status.isExhausted()) {
      throw new Error('Cannot modify policies for an expired or exhausted coupon');
    }
    this.props.policies = this.props.policies.filter(p => p.id !== policyId);
  }

  public redeem(
    redemptionId: string,
    customerId: string,
    orderId: string,
    context: {
      customerSegment?: string;
      loyaltyTier?: string;
      restaurantId?: string;
      branchId?: string;
      orderAmount?: number;
      productIds?: string[];
      isFirstOrder?: boolean;
    } = {},
    discountAmount?: number,
    redeemedAt: Date = new Date()
  ): void {
    // 1. Check Status
    if (!this.props.status.isActive()) {
      throw new Error(`Coupon cannot be redeemed. Current status: ${this.props.status.value}`);
    }

    // 2. Check Validity Period
    if (!this.props.validityPeriod.isValid(redeemedAt)) {
      throw new Error('Coupon cannot be redeemed outside its validity period');
    }

    // 3. Check Limits
    if (this.props.usageLimit) {
      if (this.props.redemptionLimit.hasReachedLimit(this.props.usageLimit.maxTotalUses)) {
        throw new Error('Coupon global usage limit has been reached');
      }

      if (this.props.usageLimit.maxUsesPerCustomer !== undefined) {
        const customerRedemptions = this.props.redemptions.filter(r => r.customerId === customerId).length;
        if (customerRedemptions >= this.props.usageLimit.maxUsesPerCustomer) {
          throw new Error('Customer has reached the usage limit for this coupon');
        }
      }
    }

    // 4. Check one coupon per order constraint
    const hasOrderRedemption = this.props.redemptions.some(r => r.orderId === orderId);
    if (hasOrderRedemption) {
      throw new Error('Coupon has already been applied to this order');
    }

    // 5. Evaluate Policies
    for (const policy of this.props.policies) {
      if (!policy.isSatisfiedBy(context)) {
        throw new Error(`Coupon usage policy not satisfied: ${policy.id}`);
      }
    }

    // 6. Apply Redemption
    const redemption = CouponRedemption.create(
      redemptionId,
      this.id,
      customerId,
      orderId,
      discountAmount,
      redeemedAt
    );

    this.props.redemptions.push(redemption);
    this.props.redemptionLimit = this.props.redemptionLimit.increment();

    this.addDomainEvent(new CouponRedeemed(this.id, redemptionId, orderId, customerId));

    // 7. Check if exhausted after redemption
    if (
      this.props.usageLimit?.maxTotalUses !== undefined &&
      this.props.redemptionLimit.hasReachedLimit(this.props.usageLimit.maxTotalUses)
    ) {
      this.props.status = CouponStatus.create(CouponStatusEnum.EXHAUSTED);
      this.addDomainEvent(new CouponUsageLimitReached(this.id));
    }
  }
}
