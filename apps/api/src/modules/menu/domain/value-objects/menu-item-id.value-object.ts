import { ValueObject } from '@saas/core';

export interface MenuItemIdProps { value: string; }

export class MenuItemId extends ValueObject<MenuItemIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuItemIdProps) { super(props); }
  public static create(value?: string): MenuItemId {
    return new MenuItemId({ value: value || crypto.randomUUID() });
  }
}