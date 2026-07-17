import { IInvoice } from '../entities/invoice.interface';

export interface IInvoiceRepository {
  findById(id: string): Promise<IInvoice | null>;
  findByDocumentNumber(restaurantId: string, docNumber: string): Promise<IInvoice | null>;
  save(invoice: IInvoice): Promise<void>;
}
