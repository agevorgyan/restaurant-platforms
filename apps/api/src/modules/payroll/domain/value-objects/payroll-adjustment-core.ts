import { Identifier, DomainPrimitive } from '@saas/domain';

export class PayrollAdjustmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollAdjustmentId { return new PayrollAdjustmentId(value); }
  public static generate(): PayrollAdjustmentId { return new PayrollAdjustmentId(crypto.randomUUID()); }
}

export class AdjustmentNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AdjustmentNumber {
    if (!value || value.trim().length === 0) throw new Error('Adjustment number cannot be empty.');
    return new AdjustmentNumber(value);
  }
}

export enum AdjustmentTypeEnum {
  BONUS = 'BONUS',
  PENALTY = 'PENALTY',
  COMMISSION = 'COMMISSION',
  REIMBURSEMENT = 'REIMBURSEMENT',
  MANUAL_CORRECTION = 'MANUAL_CORRECTION',
  RETROACTIVE_PAYMENT = 'RETROACTIVE_PAYMENT'
}

export class AdjustmentType extends DomainPrimitive<AdjustmentTypeEnum> {
  private constructor(value: AdjustmentTypeEnum) { super(value); }
  public static create(value: AdjustmentTypeEnum): AdjustmentType {
    if (!Object.values(AdjustmentTypeEnum).includes(value)) {
      throw new Error(`Invalid adjustment type: ${value}`);
    }
    return new AdjustmentType(value);
  }
}

export class AdjustmentReason extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AdjustmentReason {
    if (!value || value.trim().length === 0) throw new Error('Reason cannot be empty.');
    return new AdjustmentReason(value);
  }
}

export class AdjustmentAmount extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): AdjustmentAmount {
    if (value === 0) throw new Error('Adjustment amount cannot be zero.');
    return new AdjustmentAmount(value);
  }
}

export class EffectiveDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): EffectiveDate {
    return new EffectiveDate(value);
  }
}

export enum AdjustmentApprovalStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class AdjustmentApprovalStatus extends DomainPrimitive<AdjustmentApprovalStatusEnum> {
  private constructor(value: AdjustmentApprovalStatusEnum) { super(value); }
  public static create(value: AdjustmentApprovalStatusEnum): AdjustmentApprovalStatus {
    if (!Object.values(AdjustmentApprovalStatusEnum).includes(value)) {
      throw new Error(`Invalid adjustment approval status: ${value}`);
    }
    return new AdjustmentApprovalStatus(value);
  }
}

export enum AdjustmentStatusEnum {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPLIED = 'APPLIED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED'
}

export class AdjustmentStatus extends DomainPrimitive<AdjustmentStatusEnum> {
  private constructor(value: AdjustmentStatusEnum) { super(value); }
  public static create(value: AdjustmentStatusEnum): AdjustmentStatus {
    if (!Object.values(AdjustmentStatusEnum).includes(value)) {
      throw new Error(`Invalid adjustment status: ${value}`);
    }
    return new AdjustmentStatus(value);
  }
}
