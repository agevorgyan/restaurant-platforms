import { AvailabilityContext } from '../contexts/availability.context';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class AvailabilityPolicy {
  public static enforce(context: AvailabilityContext): void {
    if (context.partySize.size <= 0) throw new ReservationDomainError('Party size must be greater than 0');
  }
}

export class BusinessHoursPolicy {
  public static enforce(isWithinHours: boolean): void {
    if (!isWithinHours) throw new ReservationDomainError('Reservation time is outside business hours');
  }
}

export class ReservationWindowPolicy {
  public static enforce(isWithinWindow: boolean): void {
    if (!isWithinWindow) throw new ReservationDomainError('Reservation violates lead time or max horizon policies');
  }
}

export class BlockedPeriodPolicy {
  public static enforce(isNotBlocked: boolean): void {
    if (!isNotBlocked) throw new ReservationDomainError('Reservation time falls within a blackout or blocked period');
  }
}

export class CapacityForecastPolicy {
  public static enforce(hasCapacity: boolean): void {
    if (!hasCapacity) throw new ReservationDomainError('Insufficient capacity forecasted for this party size');
  }
}