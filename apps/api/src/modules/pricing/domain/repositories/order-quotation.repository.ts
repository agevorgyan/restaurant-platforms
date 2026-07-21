import { OrderQuotation } from '../aggregates/order-quotation.aggregate';
import { OrderQuotationId } from '../value-objects/order-quotation-id.value-object';
import { QuotationNumber } from '../value-objects/quotation-number.value-object';

export interface OrderQuotationRepository {
  findById(id: OrderQuotationId): Promise<OrderQuotation | null>;
  findByNumber(quotationNumber: QuotationNumber): Promise<OrderQuotation | null>;
  save(quotation: OrderQuotation): Promise<void>;
}
