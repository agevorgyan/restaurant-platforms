import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';

export interface IInventoryLedgerRepository {
  findById(id: string): Promise<InventoryLedger | null>;
  findByInventoryId(inventoryId: string): Promise<InventoryLedger | null>;
  save(ledger: InventoryLedger): Promise<void>;
}
