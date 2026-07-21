import { OrderQuotation } from '../aggregates/order-quotation.aggregate';
import { QuotationStatusEnum } from '../value-objects/quotation-status.value-object';

export class QuotationAcceptancePolicy {
  public canAccept(quotation: OrderQuotation): boolean {
    if (quotation.status.value !== QuotationStatusEnum.PUBLISHED) {
      throw new Error('Only published quotations can be accepted');
    }
    
    if (quotation.expiration && quotation.expiration.isExpired(new Date())) {
      throw new Error('Cannot accept an expired quotation');
    }

    return true;
  }

  public canReject(quotation: OrderQuotation): boolean {
    if (quotation.status.value !== QuotationStatusEnum.PUBLISHED) {
      throw new Error('Only published quotations can be rejected');
    }

    return true;
  }
}
