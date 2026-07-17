import { DocumentNumber } from '../value-objects/document-number.value-object';
import { DocumentStatus } from '../value-objects/document-status.value-object';
import { CustomerSnapshot } from '../value-objects/customer-snapshot.value-object';
import { TaxSummary } from '../value-objects/tax-summary.value-object';

export interface IInvoice {
  id: string;
  restaurantId: string;
  orderId: string;
  paymentId: string;
  documentNumber: DocumentNumber;
  customerSnapshot: CustomerSnapshot;
  taxSummary: TaxSummary;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
  status: DocumentStatus;
  issuedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
