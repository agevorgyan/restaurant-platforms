import { SupplierId } from '../value-objects/supplier-id.value-object';
import { Supplier } from '../aggregates/supplier.aggregate';

export interface SupplierRepository {
  findById(id: SupplierId): Promise<Supplier | null>;
  save(supplier: Supplier): Promise<void>;
  delete(id: SupplierId): Promise<void>;
}
