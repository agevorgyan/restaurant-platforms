import { PolicyResult } from './policy-result';
import { PolicyContext } from './policy-context';

export interface Policy<TSubject> {
  evaluate(subject: TSubject, context: PolicyContext): PolicyResult;
}
