import { ValueObject } from '@saas/core';

export interface ModifierGroupCodeProps { value: string; }

export class ModifierGroupCode extends ValueObject<ModifierGroupCodeProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ModifierGroupCodeProps) { super(props); }
  public static create(value: string): ModifierGroupCode {
    if (!value || value.trim().length === 0) throw new Error('ModifierGroupCode cannot be empty');
    return new ModifierGroupCode({ value: value.trim().toUpperCase() });
  }
}