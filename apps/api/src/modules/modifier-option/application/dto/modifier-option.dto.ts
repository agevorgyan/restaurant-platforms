export class CreateModifierOptionDto {
  restaurantId: string;
  menuId: string;
  modifierGroupId: string;
  sku?: string;
  name: string;
  description?: string;
  sortOrder: number;
  priceAdjustment: number;
  currency: string;
  availability?: string;
  status?: string;
  isDefault?: boolean;
  maxQuantity: number;
  calories?: number;
}

export class UpdateModifierOptionDto {
  sku?: string;
  name?: string;
  description?: string;
  sortOrder?: number;
  priceAdjustment?: number;
  currency?: string;
  availability?: string;
  status?: string;
  isDefault?: boolean;
  maxQuantity?: number;
  calories?: number;
}
