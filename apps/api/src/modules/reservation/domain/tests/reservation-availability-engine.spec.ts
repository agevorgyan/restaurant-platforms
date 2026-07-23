import { ReservationAvailabilityEngine } from '../services/reservation-availability.engine';
import { AvailabilityContext } from '../contexts/availability.context';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { ReservationDate } from '../value-objects/reservation-date.value-object';
import { ReservationTime } from '../value-objects/reservation-time.value-object';
import { ReservationDuration } from '../value-objects/reservation-duration.value-object';
import { ReservationPartySize } from '../value-objects/reservation-party-size.value-object';
import { ReservationType } from '../value-objects/reservation-type.value-object';
import { ReservationTypeEnum } from '../enums/reservation.enum';
import { BusinessDate } from '../value-objects/business-date.value-object';
import { BusinessHours } from '../value-objects/business-hours.value-object';
import { BusinessTime } from '../value-objects/business-time.value-object';
import { ReservationWindow } from '../value-objects/reservation-window.value-object';
import { CapacityForecast } from '../value-objects/capacity-forecast.value-object';
import { EventPublisher } from '../../shared/interfaces/event-publisher.interface';

describe('ReservationAvailabilityEngine', () => {
  let engine: ReservationAvailabilityEngine;
  let mockPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    mockPublisher = { publish: jest.fn(), publishAll: jest.fn() };
    engine = new ReservationAvailabilityEngine(mockPublisher);
  });

  const now = new Date();
  
  const createValidContext = (leadDays = 1, partySize = 4, time = '19:00') => {
    const resDate = new Date(now.getTime() + (leadDays * 86400000));
    return new AvailabilityContext(
      BranchReference.create('branch-1'),
      ReservationDate.create(resDate),
      ReservationTime.create(time),
      ReservationDuration.create(90),
      ReservationPartySize.create(partySize),
      ReservationType.create(ReservationTypeEnum.STANDARD),
      BusinessDate.create(now)
    );
  };

  const businessHours = BusinessHours.create(
    BusinessTime.create('17:00'),
    BusinessTime.create('23:00')
  );

  const reservationWindow = ReservationWindow.create(2, 30); // 2 hours min, 30 days max
  const capacityForecast = CapacityForecast.create(100, 20, 80);

  it('should approve availability for valid inputs', () => {
    const context = createValidContext();
    const decision = engine.evaluate(context, businessHours, reservationWindow, [], capacityForecast);

    expect(decision.available).toBe(true);
    expect(decision.unavailable).toBe(false);
    expect(mockPublisher.publish).toHaveBeenCalled();
  });

  it('should reject when time is outside business hours', () => {
    const context = createValidContext(1, 4, '12:00'); // Restaurant opens at 17:00
    const decision = engine.evaluate(context, businessHours, reservationWindow, [], capacityForecast);

    expect(decision.available).toBe(false);
    expect(decision.reason?.reason).toContain('outside business hours');
  });

  it('should reject when lead time is too short', () => {
    const context = createValidContext(0, 4, '17:00'); // Not meeting 2-hour minimum if executed at 16:30
    // Simulating current time relative to reservation time for test
    const currentTime = new Date(context.reservationDate.date);
    const [h,m] = '17:00'.split(':').map(Number);
    currentTime.setHours(h-1, m, 0, 0); // Only 1 hour lead
    
    const nearContext = new AvailabilityContext(
      context.branchRef,
      context.reservationDate,
      context.reservationTime,
      context.reservationDuration,
      context.partySize,
      context.reservationType,
      BusinessDate.create(currentTime)
    );

    const decision = engine.evaluate(nearContext, businessHours, reservationWindow, [], capacityForecast);

    expect(decision.available).toBe(false);
    expect(decision.reason?.reason).toContain('lead time');
  });

  it('should reject when capacity is insufficient', () => {
    const context = createValidContext(1, 100, '19:00'); // Requesting 100, only 80 available
    const decision = engine.evaluate(context, businessHours, reservationWindow, [], capacityForecast);

    expect(decision.available).toBe(false);
    expect(decision.reason?.reason).toContain('capacity');
  });
});