import { MarketingEvaluationContext } from '../value-objects/marketing-evaluation-context.value-object';
import { CustomerSegment } from '../value-objects/customer-segment.value-object';

export class CustomerSegmentationService {
  public evaluate(context: MarketingEvaluationContext): CustomerSegment | undefined {
    return context.currentSegment;
  }
}