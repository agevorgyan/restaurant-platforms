import { ValueObject } from '@saas/core';
import { VerificationStatusEnum } from '../enums/customer.enums';

export interface VerificationStatusProps { status: VerificationStatusEnum; }

export class VerificationStatus extends ValueObject<VerificationStatusProps> {
  get status(): VerificationStatusEnum { return this.props.status; }
  private constructor(props: VerificationStatusProps) { super(props); }
  public static create(status: VerificationStatusEnum): VerificationStatus {
    return new VerificationStatus({ status });
  }
}