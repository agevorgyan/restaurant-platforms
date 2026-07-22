import { ValueObject } from '@saas/core';

export enum InventoryStateEnum {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DEPLETED = 'DEPLETED',
  ARCHIVED = 'ARCHIVED'
}

export interface InventoryStateProps {
  value: InventoryStateEnum;
}

export class InventoryState extends ValueObject<InventoryStateProps> {
  private constructor(props: InventoryStateProps) {
    super(props);
  }

  public static create(value: InventoryStateEnum): InventoryState {
    if (!Object.values(InventoryStateEnum).includes(value)) {
      throw new Error(`Invalid Inventory State: ${value}`);
    }
    return new InventoryState({ value });
  }

  get value(): InventoryStateEnum {
    return this.props.value;
  }
}
