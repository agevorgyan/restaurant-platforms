export interface PriceListItemDto {
  ingredientId: string;
  unitPrice: number;
  minimumQuantity: number;
  discountPercent: number;
}

export interface CreateSupplierPriceListDto {
  restaurantId: string;
  supplierId: string;
  name: string;
  currency: string;
  validityStartDate: Date;
  validityEndDate: Date;
  items: PriceListItemDto[];
}
