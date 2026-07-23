import { TableAssignmentContext } from '../contexts/table-assignment.context';
import { SeatingPlan } from '../value-objects/seating-plan.value-object';
import { TableReference } from '../value-objects/table-reference.value-object';

export class SeatingOptimizationService {
  public optimize(context: TableAssignmentContext, availableTables: { ref: TableReference, capacity: number }[]): SeatingPlan {
    // Basic greedy algorithm for seating optimization: pick the smallest table that fits, else combine tables
    const sorted = [...availableTables].sort((a, b) => b.capacity - a.capacity);
    const selected: TableReference[] = [];
    let currentCapacity = 0;

    for (const table of sorted) {
      if (currentCapacity >= context.requiredCapacity.required) break;
      selected.push(table.ref);
      currentCapacity += table.capacity;
    }

    return SeatingPlan.create(selected, currentCapacity);
  }
}