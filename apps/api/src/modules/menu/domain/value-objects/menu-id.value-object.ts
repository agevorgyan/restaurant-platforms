import { ValueObject } from '@saas/core';

export interface MenuIdProps { value: string; }

export class MenuId extends ValueObject<MenuIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuIdProps) { super(props); }
  public static create(value?: string): MenuId {
    return new MenuId({ value: value || crypto.randomUUID() });
  }
}