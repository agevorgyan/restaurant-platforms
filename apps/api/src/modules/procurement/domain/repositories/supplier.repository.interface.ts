import { SupplierId } from '../value-objects/supplier-id.value-object';

export interface SupplierRepository {
  findById(id: SupplierId): Promise<any | null>;
  save(supplier: any): Promise<void>;
  delete(id: SupplierId): Promise<void>;
}
