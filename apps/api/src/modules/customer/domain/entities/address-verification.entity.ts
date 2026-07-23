import { Entity } from '@saas/core';
import { VerificationStatus } from '../value-objects/verification-status.value-object';
import { VerificationDate } from '../value-objects/verification-date.value-object';

export interface AddressVerificationProps {
  status: VerificationStatus;
  verifiedAt?: VerificationDate;
}

export class AddressVerification extends Entity<AddressVerificationProps> {
  get status(): VerificationStatus { return this.props.status; }
  get verifiedAt(): VerificationDate | undefined { return this.props.verifiedAt; }
  private constructor(id: string, props: AddressVerificationProps) { super(id, props); }
  public static create(id: string, props: AddressVerificationProps): AddressVerification {
    return new AddressVerification(id, props);
  }
}