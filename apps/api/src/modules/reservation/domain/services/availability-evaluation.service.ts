import { AvailabilityContext } from '../contexts/availability.context';
import { BusinessHours } from '../value-objects/business-hours.value-object';
import { BusinessHoursSpecification } from '../specifications/availability.specifications';
import { BusinessHoursPolicy } from '../policies/availability.policies';

export class BusinessHoursValidationService {
  private readonly spec = new BusinessHoursSpecification();
  public validate(context: AvailabilityContext, hours: BusinessHours): boolean {
    const isValid = this.spec.isSatisfiedBy(context, hours);
    BusinessHoursPolicy.enforce(isValid);
    return isValid;
  }
}