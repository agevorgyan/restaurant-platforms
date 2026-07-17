export class CartItemModifierDto {
  modifierOptionId: string;
  quantity: number;
  priceAdjustment: number;
}

export class CreateCartDto {
  restaurantId: string;
  branchId: string;
  customerId?: string;
  sessionId?: string;
  tableId?: string;
  currency: string;
  expiresInMinutes?: number;
}

export class AddCartItemDto {
  productId: string;
  quantity: number;
  modifierSelections?: CartItemModifierDto[];
  specialInstructions?: string;
  unitPrice: number;
}

export class CheckoutCartDto {
  orderId?: string;
}
