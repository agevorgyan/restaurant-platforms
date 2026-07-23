import { MarketingEvaluationContext } from '../value-objects/marketing-evaluation-context.value-object';

export class CustomerMarketingResolver {
  public resolveTargetEndpoint(context: MarketingEvaluationContext): string {
    void context;
    return 'marketing-service.internal';
  }
}