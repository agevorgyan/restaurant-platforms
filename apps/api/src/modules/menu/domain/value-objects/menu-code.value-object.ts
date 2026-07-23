import { ValueObject } from '@saas/core';

export interface MenuCodeProps { value: string; }

export class MenuCode extends ValueObject<MenuCodeProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuCodeProps) { super(props); }
  public static create(value: string): MenuCode {
    if (!value || value.trim().length === 0) throw new Error('MenuCode cannot be empty');
    return new MenuCode({ value: value.trim().toUpperCase() });
  }
}