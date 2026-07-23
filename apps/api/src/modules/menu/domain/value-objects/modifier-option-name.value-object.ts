import { ValueObject } from '@saas/core';

export interface ModifierOptionNameProps { value: string; }

export class ModifierOptionName extends ValueObject<ModifierOptionNameProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ModifierOptionNameProps) { super(props); }
  public static create(value: string): ModifierOptionName {
    if (!value || value.trim().length === 0) throw new Error('ModifierOptionName cannot be empty');
    return new ModifierOptionName({ value: value.trim() });
  }
}