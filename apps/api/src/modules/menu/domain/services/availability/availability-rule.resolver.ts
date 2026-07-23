import { AvailabilityContext } from '../../value-objects/availability-context.value-object';
import { AvailabilityResult } from '../../value-objects/availability-result.value-object';

import { EmergencyClosurePolicy, AvailabilityOverridePolicy, BusinessHoursPolicy, HolidayPolicy } from '../../policies/availability.policies';
import { InventoryAvailabilitySpecification, KitchenAvailabilitySpecification } from '../../specifications/availability.specifications';
import { AvailabilityDecision, DecisionStatus } from '../../value-objects/availability-decision.value-object';
import { AvailabilityReason } from '../../value-objects/availability-reason.value-object';
import { AvailabilityPriority } from '../../value-objects/availability-priority.value-object';

export class AvailabilityRuleResolver {
  public resolveAll(context: AvailabilityContext): AvailabilityResult | null {
    
    // 1. Emergency Closure
    let result = EmergencyClosurePolicy.evaluate(context);
    if (result) return result;

    // 2. Manual Override
    result = AvailabilityOverridePolicy.resolveOverride(context);
    if (result) return result;

    // 3. Business Hours
    result = BusinessHoursPolicy.evaluate(context);
    if (result) return result;

    // 4. Holiday Rules
    result = HolidayPolicy.evaluate(context);
    if (result) return result;

    // 5. Menu Status (stubbed validation)
    // 6. Menu Item Status (stubbed validation)
    // 7. Modifier Status (stubbed validation)
    
    // 8. Inventory Availability
    if (!InventoryAvailabilitySpecification.isSatisfiedBy(context)) {
      return AvailabilityResult.create({
        decision: AvailabilityDecision.create(DecisionStatus.UNAVAILABLE),
        reason: AvailabilityReason.create('Out of stock'),
        priority: AvailabilityPriority.create(8)
      });
    }

    // 9. Kitchen Availability
    if (!KitchenAvailabilitySpecification.isSatisfiedBy(context)) {
      return AvailabilityResult.create({
        decision: AvailabilityDecision.create(DecisionStatus.UNAVAILABLE),
        reason: AvailabilityReason.create('Kitchen capacity reached'),
        priority: AvailabilityPriority.create(9)
      });
    }

    return null; // Means AVAILABLE
  }
}