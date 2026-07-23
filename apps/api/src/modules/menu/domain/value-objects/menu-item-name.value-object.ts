import { ValueObject } from '@saas/core';

export interface MenuItemNameProps { value: string; }

export class MenuItemName extends ValueObject<MenuItemNameProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuItemNameProps) { super(props); }
  public static create(value: string): MenuItemName {
    if (!value || value.trim().length === 0) throw new Error('MenuItemName cannot be empty');
    return new MenuItemName({ value: value.trim() });
  }
}