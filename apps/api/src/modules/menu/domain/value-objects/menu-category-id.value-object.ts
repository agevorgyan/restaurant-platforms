import { ValueObject } from '@saas/core';

export interface MenuCategoryIdProps { value: string; }

export class MenuCategoryId extends ValueObject<MenuCategoryIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuCategoryIdProps) { super(props); }
  public static create(value?: string): MenuCategoryId {
    return new MenuCategoryId({ value: value || crypto.randomUUID() });
  }
}