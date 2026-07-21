import { OrderQuotation } from '../aggregates/order-quotation.aggregate';
import { QuotationStatusEnum } from '../value-objects/quotation-status.value-object';

export class QuotationValiditySpecification {
  public isSatisfiedBy(quotation: OrderQuotation): boolean {
    const validStatuses = [
      QuotationStatusEnum.DRAFT,
      QuotationStatusEnum.CALCULATED,
      QuotationStatusEnum.PUBLISHED,
      QuotationStatusEnum.ACCEPTED
    ];

    if (!validStatuses.includes(quotation.status.value)) {
      return false;
    }

    // Published and Accepted quotations must have a pricing snapshot and fingerprint
    if (
      (quotation.status.value === QuotationStatusEnum.PUBLISHED || 
       quotation.status.value === QuotationStatusEnum.ACCEPTED) &&
      (!quotation.pricingSnapshot || !quotation.pricingFingerprint)
    ) {
      return false;
    }

    return true;
  }
}
