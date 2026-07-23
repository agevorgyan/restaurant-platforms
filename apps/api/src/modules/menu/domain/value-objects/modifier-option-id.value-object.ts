import { ValueObject } from '@saas/core';

export interface ModifierOptionIdProps { value: string; }

export class ModifierOptionId extends ValueObject<ModifierOptionIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ModifierOptionIdProps) { super(props); }
  public static create(value?: string): ModifierOptionId {
    return new ModifierOptionId({ value: value || crypto.randomUUID() });
  }
}