import { Entity } from '@saas/core';
import { ModifierOptionName } from '../value-objects/modifier-option-name.value-object';
import { DisplayOrder } from '../value-objects/display-order.value-object';
import { PriceReference } from '../value-objects/price-reference.value-object';
import { InventoryItemReference } from '../value-objects/inventory-item-reference.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { TaxCategoryReference } from '../value-objects/tax-category-reference.value-object';

export interface ModifierOptionProps {
  id: string;
  name: ModifierOptionName;
  displayOrder: DisplayOrder;
  isAvailable: boolean;
  priceRef?: PriceReference;
  inventoryItemRef?: InventoryItemReference;
  recipeRef?: RecipeReference;
  taxCategoryRef?: TaxCategoryReference;
}

export class ModifierOption extends Entity<ModifierOptionProps> {
  get name(): ModifierOptionName { return this.props.name; }
  get displayOrder(): DisplayOrder { return this.props.displayOrder; }
  get isAvailable(): boolean { return this.props.isAvailable; }
  get priceRef(): PriceReference | undefined { return this.props.priceRef; }
  get inventoryItemRef(): InventoryItemReference | undefined { return this.props.inventoryItemRef; }
  get recipeRef(): RecipeReference | undefined { return this.props.recipeRef; }
  get taxCategoryRef(): TaxCategoryReference | undefined { return this.props.taxCategoryRef; }

  private constructor(props: any) { super(props.id, props); }

  public static create(props: ModifierOptionProps): ModifierOption {
    return new ModifierOption(props);
  }
}