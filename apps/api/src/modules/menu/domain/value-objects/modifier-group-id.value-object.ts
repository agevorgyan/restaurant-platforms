import { ValueObject } from '@saas/core';

export interface ModifierGroupIdProps { value: string; }

export class ModifierGroupId extends ValueObject<ModifierGroupIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ModifierGroupIdProps) { super(props); }
  public static create(value?: string): ModifierGroupId {
    return new ModifierGroupId({ value: value || crypto.randomUUID() });
  }
}