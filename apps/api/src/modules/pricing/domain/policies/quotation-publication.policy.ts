import { OrderQuotation } from '../aggregates/order-quotation.aggregate';
import { QuotationStatusEnum } from '../value-objects/quotation-status.value-object';

export class QuotationPublicationPolicy {
  public canPublish(quotation: OrderQuotation): boolean {
    if (quotation.status.value !== QuotationStatusEnum.CALCULATED) {
      throw new Error('Only calculated quotations can be published');
    }
    
    if (!quotation.pricingSnapshot || !quotation.pricingFingerprint || !quotation.expiration) {
      throw new Error('Quotation is missing required data for publication');
    }

    return true;
  }
}
