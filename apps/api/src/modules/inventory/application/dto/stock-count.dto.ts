export interface StockCountLineDto {
  ingredientId: string;
  expectedQuantity: number;
  countedQuantity: number;
  variance: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expirationDate?: Date;
  comment?: string;
}

export interface CreateStockCountDto {
  restaurantId: string;
  inventoryId: string;
  countNumber: string;
  method: string;
  countDate?: Date;
  lines: StockCountLineDto[];
  notes?: string;
}

export interface UpdateStockCountDto {
  countDate?: Date;
  lines?: StockCountLineDto[];
  notes?: string;
}
