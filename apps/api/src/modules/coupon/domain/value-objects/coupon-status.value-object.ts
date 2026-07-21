import { ValueObject } from '@saas/core';

export enum CouponStatusEnum {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  EXHAUSTED = 'Exhausted',
  EXPIRED = 'Expired',
}

export interface CouponStatusProps {
  value: CouponStatusEnum;
}

export class CouponStatus extends ValueObject<CouponStatusProps> {
  private constructor(props: CouponStatusProps) {
    super(props);
  }

  public static initial(): CouponStatus {
    return new CouponStatus({ value: CouponStatusEnum.DRAFT });
  }

  public static create(value: CouponStatusEnum): CouponStatus {
    return new CouponStatus({ value });
  }

  get value(): CouponStatusEnum {
    return this.props.value;
  }

  public isDraft(): boolean {
    return this.props.value === CouponStatusEnum.DRAFT;
  }

  public isActive(): boolean {
    return this.props.value === CouponStatusEnum.ACTIVE;
  }

  public isInactive(): boolean {
    return this.props.value === CouponStatusEnum.INACTIVE;
  }

  public isExhausted(): boolean {
    return this.props.value === CouponStatusEnum.EXHAUSTED;
  }

  public isExpired(): boolean {
    return this.props.value === CouponStatusEnum.EXPIRED;
  }
}
