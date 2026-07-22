import { ValueObject } from '@saas/core';

export interface KitchenReferenceProps {
  kitchenId: string;
  name: string;
}

export class KitchenReference extends ValueObject<KitchenReferenceProps> {
  get kitchenId(): string {
    return this.props.kitchenId;
  }

  get name(): string {
    return this.props.name;
  }

  private constructor(props: KitchenReferenceProps) {
    super(props);
  }

  public static create(kitchenId: string, name: string): KitchenReference {
    if (!kitchenId || kitchenId.trim() === '') {
      throw new Error('Kitchen ID cannot be empty');
    }
    if (!name || name.trim() === '') {
      throw new Error('Kitchen name cannot be empty');
    }
    return new KitchenReference({ kitchenId, name });
  }
}
