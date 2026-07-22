import { ValueObject } from '@saas/core';

export interface KitchenIdProps {
  value: string;
}

export class KitchenId extends ValueObject<KitchenIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: KitchenIdProps) {
    super(props);
  }

  public static create(value?: string): KitchenId {
    return new KitchenId({
      value: value || crypto.randomUUID(),
    });
  }
}
