import { ValueObject } from '@saas/core';

export interface MenuItemReferenceProps { itemId: string; }

export class MenuItemReference extends ValueObject<MenuItemReferenceProps> {
  get itemId(): string { return this.props.itemId; }
  private constructor(props: MenuItemReferenceProps) { super(props); }
  public static create(itemId: string): MenuItemReference {
    if (!itemId) throw new Error('MenuItemReference cannot be empty');
    return new MenuItemReference({ itemId });
  }
}