import { ValueObject } from '@saas/core';

export interface MenuItemCodeProps { value: string; }

export class MenuItemCode extends ValueObject<MenuItemCodeProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuItemCodeProps) { super(props); }
  public static create(value: string): MenuItemCode {
    if (!value || value.trim().length === 0) throw new Error('MenuItemCode cannot be empty');
    return new MenuItemCode({ value: value.trim().toUpperCase() });
  }
}