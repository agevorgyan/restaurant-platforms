import { ValueObject } from '@saas/core';

export interface ModifierGroupDescriptionProps { value: string; }

export class ModifierGroupDescription extends ValueObject<ModifierGroupDescriptionProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ModifierGroupDescriptionProps) { super(props); }
  public static create(value: string): ModifierGroupDescription {
    return new ModifierGroupDescription({ value: value.trim() });
  }
}