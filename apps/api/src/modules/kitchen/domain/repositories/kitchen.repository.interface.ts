// Note: KitchenAggregate will be implemented in a subsequent task.
export interface KitchenRepository {
  findById(id: string): Promise<any | null>;
  findByNameAndBranchId(name: string, branchId: string): Promise<any | null>;
  findDefaultByBranchId(branchId: string): Promise<any | null>;
  save(kitchen: any): Promise<void>;
}
