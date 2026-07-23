import { ValueObject } from '@saas/core';

export interface MenuItemDescriptionProps { value: string; }

export class MenuItemDescription extends ValueObject<MenuItemDescriptionProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuItemDescriptionProps) { super(props); }
  public static create(value: string): MenuItemDescription {
    return new MenuItemDescription({ value: value.trim() });
  }
}