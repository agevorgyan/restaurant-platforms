import { Entity, Identifier } from '@saas/domain';

export class PayrollValidationIssueId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollValidationIssueId { return new PayrollValidationIssueId(value); }
  public static generate(): PayrollValidationIssueId { return new PayrollValidationIssueId(crypto.randomUUID()); }
}

export class PayrollValidationIssue extends Entity<PayrollValidationIssueId> {
  constructor(
    id: PayrollValidationIssueId,
    public readonly description: string,
    public readonly severity: 'WARNING' | 'ERROR',
    public readonly relatedStaffId?: string
  ) {
    super(id);
  }

  public static create(
    description: string,
    severity: 'WARNING' | 'ERROR',
    relatedStaffId?: string
  ): PayrollValidationIssue {
    return new PayrollValidationIssue(
      PayrollValidationIssueId.generate(),
      description,
      severity,
      relatedStaffId
    );
  }
}
