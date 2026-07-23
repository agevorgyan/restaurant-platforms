import { PolicyResult, RuleEvaluationResult } from '../results';
import { RuleEvaluationContext, ValidationContext } from '../evaluation';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  explain(): string;
}

export interface IPolicy<T> {
  evaluate(candidate: T): PolicyResult;
}

export interface IRule<T> {
  evaluate(candidate: T, context: RuleEvaluationContext): RuleEvaluationResult;
}

export interface IRuleSet<T> {
  evaluateSequential(candidate: T, context: RuleEvaluationContext): RuleEvaluationResult[];
  evaluateParallel(candidate: T, context: RuleEvaluationContext): Promise<RuleEvaluationResult[]>;
  evaluateShortCircuit(candidate: T, context: RuleEvaluationContext): RuleEvaluationResult;
}

export interface IValidationRule<T> {
  validate(candidate: T, context: ValidationContext): RuleEvaluationResult;
}
