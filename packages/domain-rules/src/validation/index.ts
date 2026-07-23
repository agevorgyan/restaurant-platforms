import { IValidationRule } from '../interfaces';
import { ValidationContext } from '../evaluation';
import { RuleEvaluationResult } from '../results';

export abstract class ValidationRule<T> implements IValidationRule<T> {
  abstract validate(candidate: T, context: ValidationContext): RuleEvaluationResult;
}
