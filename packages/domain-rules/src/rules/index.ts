import { IRule, IRuleSet } from '../interfaces';
import { RuleEvaluationResult } from '../results';
import { RuleEvaluationContext } from '../evaluation';

export abstract class Rule<T> implements IRule<T> {
  abstract evaluate(candidate: T, context: RuleEvaluationContext): RuleEvaluationResult;
}

export class RuleSet<T> implements IRuleSet<T> {
  constructor(private readonly rules: IRule<T>[]) {}

  public evaluateSequential(candidate: T, context: RuleEvaluationContext): RuleEvaluationResult[] {
    return this.rules.map(rule => rule.evaluate(candidate, context));
  }

  public async evaluateParallel(candidate: T, context: RuleEvaluationContext): Promise<RuleEvaluationResult[]> {
    return Promise.all(this.rules.map(async rule => rule.evaluate(candidate, context)));
  }

  public evaluateShortCircuit(candidate: T, context: RuleEvaluationContext): RuleEvaluationResult {
    for (const rule of this.rules) {
      const result = rule.evaluate(candidate, context);
      if (!result.passed) {
        return result;
      }
    }
    return { passed: true };
  }
}
