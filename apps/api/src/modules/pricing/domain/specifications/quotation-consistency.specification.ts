import { OrderQuotation } from '../aggregates/order-quotation.aggregate';
import { QuotationStatusEnum } from '../value-objects/quotation-status.value-object';

export class QuotationConsistencySpecification {
  public isSatisfiedBy(quotation: OrderQuotation): boolean {
    if (!quotation.lineItems || quotation.lineItems.length === 0) {
      return false;
    }

    // Check for duplicate line items
    const itemIds = quotation.lineItems.map(item => item.id);
    const uniqueItemIds = new Set(itemIds);
    if (itemIds.length !== uniqueItemIds.size) {
      return false;
    }

    if (quotation.status.value !== QuotationStatusEnum.DRAFT) {
      // Must have totals
      if (!quotation.totals) {
        return false;
      }
      // Cannot have negative grand total
      if (quotation.totals.grandTotal.amount.value < 0) {
        return false;
      }
    }

    return true;
  }
}
