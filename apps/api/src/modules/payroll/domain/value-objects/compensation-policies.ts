import { DomainPrimitive } from '@saas/domain';

export interface BonusPolicyProps {
  type: string;
  condition: string;
  targetAmount: number;
}

export class BonusPolicy extends DomainPrimitive<BonusPolicyProps> {
  private constructor(value: BonusPolicyProps) { super(value); }
  public static create(value: BonusPolicyProps): BonusPolicy {
    if (value.targetAmount < 0) {
      throw new Error('Bonus target amount cannot be negative.');
    }
    return new BonusPolicy(value);
  }
}

export interface DeductionPolicyProps {
  type: string;
  isMandatory: boolean;
  percentage?: number;
  fixedAmount?: number;
}

export class DeductionPolicy extends DomainPrimitive<DeductionPolicyProps> {
  private constructor(value: DeductionPolicyProps) { super(value); }
  public static create(value: DeductionPolicyProps): DeductionPolicy {
    if (value.percentage && value.percentage < 0) {
      throw new Error('Deduction percentage cannot be negative.');
    }
    if (value.fixedAmount && value.fixedAmount < 0) {
      throw new Error('Deduction fixed amount cannot be negative.');
    }
    return new DeductionPolicy(value);
  }
}
