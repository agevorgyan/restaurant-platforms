import { ValueObject } from '@saas/core';

export interface ModifierOptionReferenceProps { optionId: string; }

export class ModifierOptionReference extends ValueObject<ModifierOptionReferenceProps> {
  get optionId(): string { return this.props.optionId; }
  private constructor(props: ModifierOptionReferenceProps) { super(props); }
  public static create(optionId: string): ModifierOptionReference {
    if (!optionId) throw new Error('ModifierOptionReference cannot be empty');
    return new ModifierOptionReference({ optionId });
  }
}