import { ValueObject } from '@saas/core';

export interface MenuReferenceProps { menuId: string; }

export class MenuReference extends ValueObject<MenuReferenceProps> {
  get menuId(): string { return this.props.menuId; }
  private constructor(props: MenuReferenceProps) { super(props); }
  public static create(menuId: string): MenuReference {
    if (!menuId) throw new Error('MenuReference cannot be empty');
    return new MenuReference({ menuId });
  }
}