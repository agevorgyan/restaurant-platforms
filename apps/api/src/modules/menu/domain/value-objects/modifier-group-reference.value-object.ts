import { ValueObject } from '@saas/core';

export interface ModifierGroupReferenceProps { modifierGroupId: string; }

export class ModifierGroupReference extends ValueObject<ModifierGroupReferenceProps> {
  get modifierGroupId(): string { return this.props.modifierGroupId; }
  private constructor(props: ModifierGroupReferenceProps) { super(props); }
  public static create(modifierGroupId: string): ModifierGroupReference {
    if (!modifierGroupId) throw new Error('ModifierGroupReference cannot be empty');
    return new ModifierGroupReference({ modifierGroupId });
  }
}