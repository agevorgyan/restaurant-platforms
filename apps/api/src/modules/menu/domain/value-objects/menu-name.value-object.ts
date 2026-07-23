import { ValueObject } from '@saas/core';

export interface MenuNameProps { value: string; }

export class MenuName extends ValueObject<MenuNameProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuNameProps) { super(props); }
  public static create(value: string): MenuName {
    if (!value || value.trim().length === 0) throw new Error('MenuName cannot be empty');
    return new MenuName({ value: value.trim() });
  }
}