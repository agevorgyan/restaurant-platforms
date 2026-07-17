export class OrderItemModifierDto {
  modifierGroupId: string;
  modifierOptionId: string;
  name: string;
  quantity: number;
  priceAdjustment: number;
}

export class OrderItemSnapshotDto {
  productId: string;
  sku?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryName?: string;
  taxCategory?: string;
}

export class AddOrderItemDto {
  orderId: string;
  productId: string;
  productSnapshot: OrderItemSnapshotDto;
  quantity: number;
  unitPrice: number;
  modifierSelections?: OrderItemModifierDto[];
  specialInstructions?: string;
}

export class UpdateOrderItemDto {
  quantity?: number;
  modifierSelections?: OrderItemModifierDto[];
  specialInstructions?: string;
  status?: string;
}
