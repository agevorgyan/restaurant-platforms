import { AvailabilityContext } from '../contexts/availability.context';
import { BusinessHours } from '../value-objects/business-hours.value-object';
import { ReservationWindow } from '../value-objects/reservation-window.value-object';
import { BlockedPeriod } from '../value-objects/blocked-period.value-object';
import { CapacityForecast } from '../value-objects/capacity-forecast.value-object';

export class AvailabilitySpecification {
  public isSatisfiedBy(context: AvailabilityContext): boolean {
    return context.partySize.size > 0 && context.reservationDuration.minutes > 0;
  }
}

export class BusinessHoursSpecification {
  public isSatisfiedBy(context: AvailabilityContext, hours: BusinessHours): boolean {
    // simplified for scaffold
    return context.reservationTime.time >= hours.open.time && context.reservationTime.time < hours.close.time;
  }
}

export class ReservationWindowSpecification {
  public isSatisfiedBy(context: AvailabilityContext, window: ReservationWindow): boolean {
    const requestedTime = new Date(context.reservationDate.date);
    const [h, m] = context.reservationTime.time.split(':').map(Number);
    requestedTime.setHours(h, m, 0, 0);

    const now = context.businessDateTime.date;
    const diffHours = (requestedTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    return diffHours >= window.minLeadTimeHours && diffDays <= window.maxHorizonDays;
  }
}

export class BlockedPeriodSpecification {
  public isSatisfiedBy(context: AvailabilityContext, blockouts: BlockedPeriod[]): boolean {
    return !blockouts.some(b => 
      b.date.date.toDateString() === context.reservationDate.date.toDateString() &&
      context.reservationTime.time >= b.start.time &&
      context.reservationTime.time < b.end.time
    );
  }
}

export class CapacityForecastSpecification {
  public isSatisfiedBy(context: AvailabilityContext, forecast: CapacityForecast): boolean {
    return forecast.availableCapacity >= context.partySize.size;
  }
}