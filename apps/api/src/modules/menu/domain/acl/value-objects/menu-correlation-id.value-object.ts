import { ValueObject } from '@saas/core';

export interface MenuCorrelationIdProps { value: string; }

export class MenuCorrelationId extends ValueObject<MenuCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuCorrelationIdProps) { super(props); }
  public static create(value?: string): MenuCorrelationId {
    return new MenuCorrelationId({ value: value || crypto.randomUUID() });
  }
}