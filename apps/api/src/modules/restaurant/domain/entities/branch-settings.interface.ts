export interface IBranchSettings {
  id: string;
  branchId: string;
  acceptsPickup: boolean;
  acceptsDelivery: boolean;
  preparationTimeMinutes: number;
  updatedAt: Date;
}
