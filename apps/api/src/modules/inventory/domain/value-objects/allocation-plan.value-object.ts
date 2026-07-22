import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface BatchAllocation {
  batchId: string;
  quantityToAllocate: Quantity;
}

export interface AllocationPlanProps {
  inventoryId: string;
  totalAllocated: Quantity;
  batchAllocations: BatchAllocation[];
}

export class AllocationPlan extends ValueObject<AllocationPlanProps> {
  private constructor(props: AllocationPlanProps) {
    super(props);
  }

  public static create(props: AllocationPlanProps): AllocationPlan {
    if (props.batchAllocations.length === 0 && props.totalAllocated.value > 0) {
      throw new Error('Allocation plan must contain batch allocations if total allocated > 0');
    }

    const calculatedTotal = props.batchAllocations.reduce((sum, alloc) => sum + alloc.quantityToAllocate.value, 0);
    // Tolerate small floating point issues, but theoretically should be exact
    if (Math.abs(calculatedTotal - props.totalAllocated.value) > 0.001) {
      throw new Error(`Allocation plan total allocated (${props.totalAllocated.value}) does not match sum of batch allocations (${calculatedTotal})`);
    }

    return new AllocationPlan(props);
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get totalAllocated(): Quantity {
    return this.props.totalAllocated;
  }

  get batchAllocations(): BatchAllocation[] {
    return [...this.props.batchAllocations];
  }

  public isFullySatisfied(requestedQuantity: Quantity): boolean {
    return this.totalAllocated.value >= requestedQuantity.value;
  }
}
