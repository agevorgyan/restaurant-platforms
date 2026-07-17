export interface StockMovementLineDto {
  ingredientId: string;
  quantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expirationDate?: Date;
}

export interface CreateStockMovementDto {
  restaurantId: string;
  inventoryId: string;
  movementNumber: string;
  movementType: string;
  reason: string;
  referenceType?: string;
  referenceId?: string;
  movementDate?: Date;
  lines: StockMovementLineDto[];
  notes?: string;
}

export interface UpdateStockMovementDto {
  reason?: string;
  referenceType?: string;
  referenceId?: string;
  movementDate?: Date;
  lines?: StockMovementLineDto[];
  notes?: string;
}
