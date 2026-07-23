import { Entity } from '@saas/core';
import { MenuName } from '../value-objects/menu-name.value-object';
import { DisplayOrder } from '../value-objects/display-order.value-object';
import { MenuItemReference } from '../value-objects/menu-item-reference.value-object';

export interface MenuSectionProps {
  id: string;
  name: MenuName;
  displayOrder: DisplayOrder;
  items: MenuItemReference[];
}

export class MenuSection extends Entity<MenuSectionProps> {
  get id(): string { return this.props.id; }
  get name(): MenuName { return this.props.name; }
  get displayOrder(): DisplayOrder { return this.props.displayOrder; }
  get items(): MenuItemReference[] { return this.props.items; }

  public linkItem(item: MenuItemReference): void {
    if (this.props.items.some(i => i.itemId === item.itemId)) {
      throw new Error(`Item ${item.itemId} is already linked to section ${this.name.value}`);
    }
    this.props.items.push(item);
  }

  public unlinkItem(itemId: string): void {
    this.props.items = this.props.items.filter(i => i.itemId !== itemId);
  }

  private constructor(props: any) { super(props.id, props); }
  public static create(props: MenuSectionProps): MenuSection {
    return new MenuSection(props);
  }
}