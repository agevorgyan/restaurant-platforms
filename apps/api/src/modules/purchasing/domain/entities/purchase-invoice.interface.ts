import { InvoiceStatus } from '../value-objects/invoice-status.value-object';
import { InvoiceNumber } from '../value-objects/invoice-number.value-object';
import { DueDate } from '../value-objects/due-date.value-object';
import { IPurchaseInvoiceLine } from './purchase-invoice-line.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface IPurchaseInvoice {
  id: string;
  restaurantId: string;
  supplierId: string;
  purchaseOrderId?: string;
  goodsReceiptId?: string;
  invoiceNumber: InvoiceNumber;
  supplierInvoiceNumber: string;
  status: InvoiceStatus;
  invoiceDate: Date;
  dueDate: DueDate;
  currency: string;
  lines: IPurchaseInvoiceLine[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
