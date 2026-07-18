import { ISupplier } from '../entities/supplier.interface';

export interface ISupplierRepository {
  findById(id: string): Promise<ISupplier | null>;
  findBySupplierCode(restaurantId: string, code: string): Promise<ISupplier | null>;
  findByTaxNumber(restaurantId: string, taxNumber: string): Promise<ISupplier | null>;
  save(supplier: ISupplier): Promise<void>;
}
