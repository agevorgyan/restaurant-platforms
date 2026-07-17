import { IReceipt } from '../entities/receipt.interface';

export interface IReceiptRepository {
  findById(id: string): Promise<IReceipt | null>;
  findByDocumentNumber(restaurantId: string, docNumber: string): Promise<IReceipt | null>;
  save(receipt: IReceipt): Promise<void>;
}
