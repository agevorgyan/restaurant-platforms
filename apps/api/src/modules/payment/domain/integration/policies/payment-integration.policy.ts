import { PaymentIntegrationEvent } from '../services/payment-event-factory.service';
import { PaymentContractValidator } from '../services/payment-contract-validator.service';

export class PaymentIntegrationPolicy {
  private readonly validator = new PaymentContractValidator();

  public evaluate<T>(event: PaymentIntegrationEvent<T>): { isSuccess: boolean; error?: string } {
    try {
      this.validator.validate(event);
      return { isSuccess: true };
    } catch (err: any) {
      return { isSuccess: false, error: err.message };
    }
  }
}
