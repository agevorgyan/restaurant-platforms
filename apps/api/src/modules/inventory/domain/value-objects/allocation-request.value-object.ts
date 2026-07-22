import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';
import { ReferenceId } from './reference-id.value-object';

export enum AllocationStrategyEnum {
  FIFO = 'FIFO',
  FEFO = 'FEFO',
  MANUAL = 'MANUAL'
}

export interface AllocationRequestProps {
  inventoryId: string;
  orderId: ReferenceId;
  quantity: Quantity;
  strategy: AllocationStrategyEnum;
  specificBatchIds?: string[]; // Only used if strategy is MANUAL
}

export class AllocationRequest extends ValueObject<AllocationRequestProps> {
  private constructor(props: AllocationRequestProps) {
    super(props);
  }

  public static create(props: AllocationRequestProps): AllocationRequest {
    if (!props.inventoryId) {
      throw new Error('Allocation request must specify an inventory ID');
    }
    if (props.quantity.value <= 0) {
      throw new Error('Allocation request quantity must be strictly positive');
    }
    if (props.strategy === AllocationStrategyEnum.MANUAL && (!props.specificBatchIds || props.specificBatchIds.length === 0)) {
      throw new Error('MANUAL allocation strategy requires specific batch IDs');
    }

    return new AllocationRequest(props);
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get orderId(): ReferenceId {
    return this.props.orderId;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get strategy(): AllocationStrategyEnum {
    return this.props.strategy;
  }

  get specificBatchIds(): string[] | undefined {
    return this.props.specificBatchIds;
  }
}
