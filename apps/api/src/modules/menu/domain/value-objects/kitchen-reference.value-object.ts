import { ValueObject } from '@saas/core';

export interface KitchenReferenceProps { referenceId: string; }

export class KitchenReference extends ValueObject<KitchenReferenceProps> {
  get referenceId(): string { return this.props.referenceId; }
  private constructor(props: KitchenReferenceProps) { super(props); }
  public static create(referenceId: string): KitchenReference {
    if (!referenceId) throw new Error('KitchenReference cannot be empty');
    return new KitchenReference({ referenceId });
  }
}