import { Payment } from '../aggregates/payment.aggregate';
import { Capture } from '../entities/capture.entity';
import { CaptureSpecification } from '../specifications/capture.specification';

export class CapturePolicy {
  private readonly captureSpec = new CaptureSpecification();

  public evaluate(payment: Payment, capture: Capture): { isSuccess: boolean; error?: string } {
    if (!this.captureSpec.isSatisfiedBy(payment, capture)) {
      return { isSuccess: false, error: 'Capture exceeds authorized amount, authorization expired, or currency mismatch' };
    }

    return { isSuccess: true };
  }
}
