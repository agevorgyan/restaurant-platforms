import { PolicyViolation } from './policy-violation';

export class PolicyResult {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly violations: ReadonlyArray<PolicyViolation>
  ) {}

  public static success(): PolicyResult {
    return new PolicyResult(true, []);
  }

  public static failure(violations: PolicyViolation | PolicyViolation[]): PolicyResult {
    const arr = Array.isArray(violations) ? violations : [violations];
    return new PolicyResult(false, arr);
  }

  public merge(other: PolicyResult): PolicyResult {
    if (this.isSuccess && other.isSuccess) return PolicyResult.success();
    return PolicyResult.failure([...this.violations, ...other.violations]);
  }
}
