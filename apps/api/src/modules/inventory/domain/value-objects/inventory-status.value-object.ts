import { ValueObject } from '@saas/core';

export enum InventoryStatusEnum {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRED = 'EXPIRED',
  BLOCKED = 'BLOCKED',
  INACTIVE = 'INACTIVE'
}

export interface InventoryStatusProps {
  value: InventoryStatusEnum;
}

export class InventoryStatus extends ValueObject<InventoryStatusProps> {
  private constructor(props: InventoryStatusProps) {
    super(props);
  }

  public static create(value: InventoryStatusEnum = InventoryStatusEnum.AVAILABLE): InventoryStatus {
    if (!Object.values(InventoryStatusEnum).includes(value)) {
      throw new Error(`Invalid Inventory Status: ${value}`);
    }
    return new InventoryStatus({ value });
  }

  get value(): InventoryStatusEnum {
    return this.props.value;
  }
}
