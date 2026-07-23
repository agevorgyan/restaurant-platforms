import { Policy } from './policy';
import { PolicyResult } from './policy-result';
import { PolicyContext } from './policy-context';

export class CompositePolicy<TSubject> implements Policy<TSubject> {
  private constructor(private readonly policies: ReadonlyArray<Policy<TSubject>>) {}

  public static create<T>(policies: Policy<T>[]): CompositePolicy<T> {
    return new CompositePolicy(policies);
  }

  public evaluate(subject: TSubject, context: PolicyContext): PolicyResult {
    let finalResult = PolicyResult.success();
    for (const policy of this.policies) {
      const result = policy.evaluate(subject, context);
      finalResult = finalResult.merge(result);
    }
    return finalResult;
  }
}
