import { OrderQuotation } from '../aggregates/order-quotation.aggregate';
import { QuotationExpirationSpecification } from '../specifications/quotation-expiration.specification';

export class QuotationExpirationPolicy {
  constructor(private readonly expirationSpec: QuotationExpirationSpecification) {}

  public canExpire(quotation: OrderQuotation, now: Date = new Date()): boolean {
    return this.expirationSpec.isSatisfiedBy(quotation, now);
  }
}
