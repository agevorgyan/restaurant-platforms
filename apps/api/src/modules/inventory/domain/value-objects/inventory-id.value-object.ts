import { ValueObject } from '@saas/core';

export interface InventoryIdProps {
  value: string;
}

export class InventoryId extends ValueObject<InventoryIdProps> {
  private constructor(props: InventoryIdProps) {
    super(props);
  }

  public static create(value?: string): InventoryId {
    return new InventoryId({ value: value || crypto.randomUUID() });
  }

  get value(): string {
    return this.props.value;
  }
}
