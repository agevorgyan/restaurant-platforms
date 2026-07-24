import { Entity, Identifier } from '@saas/domain';
import { ApprovalDate } from '../value-objects/payroll-dates';

export class PayrollApprovalId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollApprovalId { return new PayrollApprovalId(value); }
  public static generate(): PayrollApprovalId { return new PayrollApprovalId(crypto.randomUUID()); }
}

export class PayrollApproval extends Entity<PayrollApprovalId> {
  constructor(
    id: PayrollApprovalId,
    public readonly approvedBy: string,
    public readonly approvalDate: ApprovalDate,
    public readonly remarks?: string
  ) {
    super(id);
  }

  public static create(approvedBy: string, remarks?: string): PayrollApproval {
    return new PayrollApproval(
      PayrollApprovalId.generate(), 
      approvedBy, 
      ApprovalDate.create(new Date()), 
      remarks
    );
  }
}
