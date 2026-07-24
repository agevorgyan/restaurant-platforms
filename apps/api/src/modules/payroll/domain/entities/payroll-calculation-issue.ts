import { Entity, Identifier } from '@saas/domain';

export class PayrollCalculationIssueId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollCalculationIssueId { return new PayrollCalculationIssueId(value); }
  public static generate(): PayrollCalculationIssueId { return new PayrollCalculationIssueId(crypto.randomUUID()); }
}

export class PayrollCalculationIssue extends Entity<PayrollCalculationIssueId> {
  constructor(
    id: PayrollCalculationIssueId,
    public readonly description: string,
    public readonly severity: 'WARNING' | 'ERROR',
    public readonly employeeId?: string
  ) {
    super(id);
  }

  public static create(description: string, severity: 'WARNING' | 'ERROR', employeeId?: string): PayrollCalculationIssue {
    return new PayrollCalculationIssue(PayrollCalculationIssueId.generate(), description, severity, employeeId);
  }
}
