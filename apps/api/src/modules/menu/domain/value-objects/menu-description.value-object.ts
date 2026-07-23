import { ValueObject } from '@saas/core';

export interface MenuDescriptionProps { value: string; }

export class MenuDescription extends ValueObject<MenuDescriptionProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuDescriptionProps) { super(props); }
  public static create(value: string): MenuDescription {
    return new MenuDescription({ value: value.trim() });
  }
}