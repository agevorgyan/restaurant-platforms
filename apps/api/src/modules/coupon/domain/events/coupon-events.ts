import { DomainEvent } from '@saas/core';

export class CouponCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly couponId: string,
    public readonly code: string,
    public readonly promotionId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.couponId;
  }
}

export class CouponActivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly couponId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.couponId;
  }
}

export class CouponDeactivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly couponId: string, public readonly reason?: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.couponId;
  }
}

export class CouponRedeemed implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly couponId: string,
    public readonly redemptionId: string,
    public readonly orderId: string,
    public readonly customerId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.couponId;
  }
}

export class CouponExpired implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly couponId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.couponId;
  }
}

export class CouponUsageLimitReached implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly couponId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.couponId;
  }
}
