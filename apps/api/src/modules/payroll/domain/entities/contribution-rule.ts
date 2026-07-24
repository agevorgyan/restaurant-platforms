import { Entity, Identifier } from '@saas/domain';

export class ContributionRuleId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ContributionRuleId { return new ContributionRuleId(value); }
  public static generate(): ContributionRuleId { return new ContributionRuleId(crypto.randomUUID()); }
}

export class ContributionRule extends Entity<ContributionRuleId> {
  constructor(
    id: ContributionRuleId,
    public readonly code: string,
    public readonly name: string,
    public readonly employeeRate: number,
    public readonly employerRate: number,
    public readonly maxCap: number | null
  ) {
    super(id);
  }

  public static create(code: string, name: string, employeeRate: number, employerRate: number, maxCap: number | null): ContributionRule {
    if (employeeRate < 0 || employerRate < 0) throw new Error('Contribution rates cannot be negative.');
    return new ContributionRule(ContributionRuleId.generate(), code, name, employeeRate, employerRate, maxCap);
  }
}
