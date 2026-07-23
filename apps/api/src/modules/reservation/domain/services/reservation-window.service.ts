import { AvailabilityContext } from '../contexts/availability.context';
import { ReservationWindow } from '../value-objects/reservation-window.value-object';
import { ReservationWindowSpecification } from '../specifications/availability.specifications';
import { ReservationWindowPolicy } from '../policies/availability.policies';

export class ReservationWindowService {
  private readonly spec = new ReservationWindowSpecification();
  public validate(context: AvailabilityContext, window: ReservationWindow): boolean {
    const isValid = this.spec.isSatisfiedBy(context, window);
    ReservationWindowPolicy.enforce(isValid);
    return isValid;
  }
}