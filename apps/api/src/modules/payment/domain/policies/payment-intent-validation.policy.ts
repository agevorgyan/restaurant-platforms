import { PaymentIntent } from '../aggregates/payment-intent.aggregate';
import { PaymentIntentConsistencySpecification } from '../specifications/payment-intent-consistency.specification';
import { PaymentIntentReferenceSpecification } from '../specifications/payment-intent-reference.specification';

export class PaymentIntentValidationPolicy {
  private readonly consistencySpec = new PaymentIntentConsistencySpecification();
  private readonly referenceSpec = new PaymentIntentReferenceSpecification();

  public evaluate(intent: PaymentIntent): { isSuccess: boolean; error?: string } {
    if (!this.referenceSpec.isSatisfiedBy(intent)) {
      return { isSuccess: false, error: 'Missing required references' };
    }

    if (!this.consistencySpec.isSatisfiedBy(intent)) {
      return { isSuccess: false, error: 'Intent state is inconsistent or contains duplicate references' };
    }

    return { isSuccess: true };
  }
}
