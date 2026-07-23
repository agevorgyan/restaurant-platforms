import { MarketingEvaluationContext } from '../value-objects/marketing-evaluation-context.value-object';

export class ConsentEvaluationService {
  public evaluate(context: MarketingEvaluationContext): string {
    return context.currentConsent ? 'GRANTED' : 'DENIED';
  }
}