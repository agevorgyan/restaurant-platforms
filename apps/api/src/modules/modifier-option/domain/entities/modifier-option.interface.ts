import { ModifierOptionStatus } from '../value-objects/modifier-option-status.value-object';
import { ModifierOptionAvailability } from '../value-objects/modifier-option-availability.value-object';
import { ModifierOptionPrice } from '../value-objects/modifier-option-price.value-object';

export interface IModifierOption {
  id: string;
  restaurantId: string;
  menuId: string;
  modifierGroupId: string;
  sku?: string;
  name: string;
  description?: string;
  sortOrder: number;
  priceDetails: ModifierOptionPrice;
  availability: ModifierOptionAvailability;
  status: ModifierOptionStatus;
  isDefault: boolean;
  maxQuantity: number;
  calories?: number;
  createdAt: Date;
  updatedAt: Date;
}
