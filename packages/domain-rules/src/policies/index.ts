import { IPolicy } from '../interfaces';
import { PolicyResult } from '../results';

export abstract class Policy<T> implements IPolicy<T> {
  abstract evaluate(candidate: T): PolicyResult;
}

export abstract class CompositePolicy<T> extends Policy<T> {
  protected policies: IPolicy<T>[] = [];

  constructor(policies?: IPolicy<T>[]) {
    super();
    if (policies) {
      this.policies = policies;
    }
  }

  public add(policy: IPolicy<T>): void {
    this.policies.push(policy);
  }

  public evaluate(candidate: T): PolicyResult {
    let success = true;
    const failures: string[] = [];
    const warnings: string[] = [];
    const messages: string[] = [];

    for (const policy of this.policies) {
      const result = policy.evaluate(candidate);
      if (!result.success) {
        success = false;
      }
      failures.push(...result.failures);
      warnings.push(...result.warnings);
      messages.push(...result.messages);
    }

    return {
      success,
      failures,
      warnings,
      messages
    };
  }
}
