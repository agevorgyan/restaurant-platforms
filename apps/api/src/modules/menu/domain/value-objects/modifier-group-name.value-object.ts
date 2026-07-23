import { ValueObject } from '@saas/core';

export interface ModifierGroupNameProps { value: string; }

export class ModifierGroupName extends ValueObject<ModifierGroupNameProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ModifierGroupNameProps) { super(props); }
  public static create(value: string): ModifierGroupName {
    if (!value || value.trim().length === 0) throw new Error('ModifierGroupName cannot be empty');
    return new ModifierGroupName({ value: value.trim() });
  }
}