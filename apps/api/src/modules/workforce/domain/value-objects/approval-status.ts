import { DomainPrimitive } from '@saas/domain';

export enum ApprovalStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export class ApprovalStatus extends DomainPrimitive<ApprovalStatusEnum> {
  private constructor(value: ApprovalStatusEnum) {
    super(value);
  }

  public static create(value: ApprovalStatusEnum): ApprovalStatus {
    if (!Object.values(ApprovalStatusEnum).includes(value)) {
      throw new Error(`Invalid approval status: ${value}`);
    }
    return new ApprovalStatus(value);
  }
}
