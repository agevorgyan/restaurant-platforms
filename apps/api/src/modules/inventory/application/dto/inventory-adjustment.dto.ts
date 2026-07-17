export interface InventoryAdjustmentLineDto {
  ingredientId: string;
  expectedQuantity: number;
  actualQuantity: number;
  differenceQuantity: number;
  unitOfMeasure: string;
  comment?: string;
}

export interface CreateInventoryAdjustmentDto {
  restaurantId: string;
  inventoryId: string;
  adjustmentNumber: string;
  adjustmentType: string;
  reason: string;
  approvalStatus: string;
  adjustmentDate?: Date;
  referenceType?: string;
  referenceId?: string;
  lines: InventoryAdjustmentLineDto[];
  notes?: string;
}

export interface UpdateInventoryAdjustmentDto {
  reason?: string;
  adjustmentDate?: Date;
  referenceType?: string;
  referenceId?: string;
  lines?: InventoryAdjustmentLineDto[];
  notes?: string;
}
