export interface ICartItemModifier {
  modifierOptionId: string;
  quantity: number;
  priceAdjustment: number;
}

export interface ICartItem {
  id: string;
  productId: string;
  quantity: number;
  modifierSelections: ICartItemModifier[];
  specialInstructions?: string;
  unitPrice: number;
  lineTotal: number;
}
