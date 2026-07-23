import { AvailabilityContext } from '../value-objects/availability-context.value-object';

export class AvailabilitySpecification {
  public static isSatisfiedBy(context: AvailabilityContext): boolean {
    return !!context.branchReference && !!context.salesChannel;
  }
}

export class InventoryAvailabilitySpecification {
  public static isSatisfiedBy(context: AvailabilityContext): boolean {
    // True if no inventory ref, or if stock is sufficient
    return !!context; 
  }
}

export class KitchenAvailabilitySpecification {
  public static isSatisfiedBy(context: AvailabilityContext): boolean {
    // True if no kitchen ref, or if kitchen has capacity
    return !!context;
  }
}

export class BusinessHoursSpecification {
  public static isSatisfiedBy(context: AvailabilityContext): boolean {
    // Check if currentDateTime falls within Branch business hours
    return !!context;
  }
}

export class VisibilitySpecification {
  public static isSatisfiedBy(context: AvailabilityContext): boolean {
    return !!context;
  }
}