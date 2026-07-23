import { ValueObject } from '@saas/core';

export interface MenuCausationIdProps { value: string; }

export class MenuCausationId extends ValueObject<MenuCausationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuCausationIdProps) { super(props); }
  public static create(value?: string): MenuCausationId {
    return new MenuCausationId({ value: value || crypto.randomUUID() });
  }
}