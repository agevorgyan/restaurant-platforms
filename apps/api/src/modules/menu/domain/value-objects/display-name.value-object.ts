import { ValueObject } from '@saas/core';

export interface DisplayNameProps { value: string; }

export class DisplayName extends ValueObject<DisplayNameProps> {
  get value(): string { return this.props.value; }
  private constructor(props: DisplayNameProps) { super(props); }
  public static create(value: string): DisplayName {
    if (!value || value.trim().length === 0) throw new Error('DisplayName cannot be empty');
    return new DisplayName({ value: value.trim() });
  }
}