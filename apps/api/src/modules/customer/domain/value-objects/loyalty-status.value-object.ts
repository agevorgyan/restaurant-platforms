import { ValueObject } from '@saas/core';
import { LoyaltyStatus as LoyaltyStatusEnum } from '../enums/loyalty.enums';

export interface LoyaltyStatusVoProps { status: LoyaltyStatusEnum; }

export class LoyaltyStatusVo extends ValueObject<LoyaltyStatusVoProps> {
  get status(): LoyaltyStatusEnum { return this.props.status; }
  private constructor(props: LoyaltyStatusVoProps) { super(props); }
  public static create(status: LoyaltyStatusEnum): LoyaltyStatusVo {
    return new LoyaltyStatusVo({ status });
  }
}