import { ValueObject } from '@saas/core';
import { MenuReference } from './menu-reference.value-object';
import { MenuItemReference } from './menu-item-reference.value-object';
import { ModifierGroupReference } from './modifier-group-reference.value-object';
import { InventoryItemReference } from './inventory-item-reference.value-object';
import { KitchenStationReference } from './kitchen-station-reference.value-object';

export interface AvailabilityContextProps {
  menuRef?: MenuReference;
  menuItemRef?: MenuItemReference;
  modifierGroupRef?: ModifierGroupReference;
  inventoryItemRef?: InventoryItemReference;
  kitchenStationRef?: KitchenStationReference;
  currentDateTime: Date;
  salesChannel: string;
  branchReference: string;
}

export class AvailabilityContext extends ValueObject<AvailabilityContextProps> {
  get currentDateTime(): Date { return this.props.currentDateTime; }
  get salesChannel(): string { return this.props.salesChannel; }
  get branchReference(): string { return this.props.branchReference; }
  
  get menuRef(): MenuReference | undefined { return this.props.menuRef; }
  get menuItemRef(): MenuItemReference | undefined { return this.props.menuItemRef; }
  get modifierGroupRef(): ModifierGroupReference | undefined { return this.props.modifierGroupRef; }
  get inventoryItemRef(): InventoryItemReference | undefined { return this.props.inventoryItemRef; }
  get kitchenStationRef(): KitchenStationReference | undefined { return this.props.kitchenStationRef; }

  private constructor(props: AvailabilityContextProps) { super(props); }

  public static create(props: AvailabilityContextProps): AvailabilityContext {
    if (!props.branchReference) throw new Error('Branch reference is required for availability context');
    if (!props.salesChannel) throw new Error('Sales channel is required for availability context');
    return new AvailabilityContext(props);
  }
}