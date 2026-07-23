import { ValueObject } from '@saas/core';

export type WaitlistStatusEnum = 'WAITING' | 'ELIGIBLE' | 'PROMOTED' | 'ACCEPTED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
export interface WaitlistStatusProps { status: WaitlistStatusEnum; }
export class WaitlistStatus extends ValueObject<WaitlistStatusProps> {
  get status(): WaitlistStatusEnum { return this.props.status; }
  private constructor(props: WaitlistStatusProps) { super(props); }
  public static create(status: WaitlistStatusEnum): WaitlistStatus { return new WaitlistStatus({ status }); }
}