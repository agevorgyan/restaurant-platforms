import { OrderQuotation } from '../aggregates/order-quotation.aggregate';
import { QuotationStatusEnum } from '../value-objects/quotation-status.value-object';

export class QuotationExpirationSpecification {
  public isSatisfiedBy(quotation: OrderQuotation, now: Date = new Date()): boolean {
    // Only published quotations can expire
    if (quotation.status.value !== QuotationStatusEnum.PUBLISHED) {
      return false;
    }

    if (!quotation.expiration) {
      return false;
    }

    return quotation.expiration.isExpired(now);
  }
}
