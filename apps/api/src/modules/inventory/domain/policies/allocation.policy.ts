import { Inventory } from '../aggregates/inventory.aggregate';
import { AllocationRequest } from '../value-objects/allocation-request.value-object';
import { AllocationSpecification } from '../specifications/allocation.specification';

export class AllocationPolicy {
  public static validateAllocationRequest(inventory: Inventory, request: AllocationRequest): void {
    AllocationSpecification.isSatisfiedBy(inventory, request);
  }
}
