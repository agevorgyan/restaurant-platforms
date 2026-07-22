import { ValueObject } from '@saas/core';

export interface InventoryVersionProps {
  value: number;
}

export class InventoryVersion extends ValueObject<InventoryVersionProps> {
  private constructor(props: InventoryVersionProps) {
    super(props);
  }

  public static create(value: number = 0): InventoryVersion {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Inventory version must be a non-negative integer');
    }
    return new InventoryVersion({ value });
  }

  public increment(): InventoryVersion {
    return new InventoryVersion({ value: this.props.value + 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
