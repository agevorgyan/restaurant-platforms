import { ValueObject } from '@saas/core';

export interface KitchenStationIdProps {
  value: string;
}

export class KitchenStationId extends ValueObject<KitchenStationIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: KitchenStationIdProps) {
    super(props);
  }

  public static create(value?: string): KitchenStationId {
    return new KitchenStationId({
      value: value || crypto.randomUUID(),
    });
  }
}
