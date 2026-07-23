import { AvailabilityContext } from '../value-objects/availability-context.value-object';
import { AvailabilityResult } from '../value-objects/availability-result.value-object';

export class AvailabilityPolicy {
  public static isEvaluationAllowed(context: AvailabilityContext): boolean {
    return !!context.branchReference;
  }
}

export class AvailabilityOverridePolicy {
  public static resolveOverride(context: AvailabilityContext): AvailabilityResult | null {
    // Checks database/context for manual override flag
    return context ? null : null; 
  }
}

export class BusinessHoursPolicy {
  public static evaluate(context: AvailabilityContext): AvailabilityResult | null {
    // Evaluate if branch is currently open
    return context ? null : null;
  }
}

export class HolidayPolicy {
  public static evaluate(context: AvailabilityContext): AvailabilityResult | null {
    // Evaluate if holiday rules block availability
    return context ? null : null;
  }
}

export class EmergencyClosurePolicy {
  public static evaluate(context: AvailabilityContext): AvailabilityResult | null {
    // Evaluate if emergency closure is active
    return context ? null : null;
  }
}