import { ValueObject } from '@saas/core';
import { MenuItemReference } from './menu-item-reference.value-object';
import { ModifierGroupReference } from './modifier-group-reference.value-object';
import { RecipeReference } from './recipe-reference.value-object';
import { KitchenStationReference } from './kitchen-station-reference.value-object';
import { InventoryItemReference } from './inventory-item-reference.value-object';

export interface MenuIntegrationContextProps {
  menuItemRef?: MenuItemReference;
  modifierGroupRef?: ModifierGroupReference;
  recipeRef?: RecipeReference;
  kitchenStationRef?: KitchenStationReference;
  inventoryItemRef?: InventoryItemReference;
  branchReference: string;
  salesChannel: string;
  evaluationDateTime: Date;
}

export class MenuIntegrationContext extends ValueObject<MenuIntegrationContextProps> {
  get recipeRef(): RecipeReference | undefined { return this.props.recipeRef; }
  get kitchenStationRef(): KitchenStationReference | undefined { return this.props.kitchenStationRef; }
  get inventoryItemRef(): InventoryItemReference | undefined { return this.props.inventoryItemRef; }
  get branchReference(): string { return this.props.branchReference; }
  get salesChannel(): string { return this.props.salesChannel; }
  get evaluationDateTime(): Date { return this.props.evaluationDateTime; }

  private constructor(props: MenuIntegrationContextProps) { super(props); }
  public static create(props: MenuIntegrationContextProps): MenuIntegrationContext {
    if (!props.branchReference) throw new Error('Branch reference is required in MenuIntegrationContext');
    return new MenuIntegrationContext(props);
  }
}