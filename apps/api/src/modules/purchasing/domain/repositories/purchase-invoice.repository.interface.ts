import { IPurchaseInvoice } from '../entities/purchase-invoice.interface';

export interface IPurchaseInvoiceRepository {
  findById(id: string): Promise<IPurchaseInvoice | null>;
  findByInvoiceNumber(restaurantId: string, invoiceNumber: string): Promise<IPurchaseInvoice | null>;
  findBySupplierInvoiceNumber(supplierId: string, supplierInvoiceNumber: string): Promise<IPurchaseInvoice | null>;
  save(purchaseInvoice: IPurchaseInvoice): Promise<void>;
}
