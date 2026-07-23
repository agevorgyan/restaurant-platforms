import { Reservation } from '../aggregates/reservation.aggregate';
import { ReservationId } from '../value-objects/reservation-id.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { ReservationPartySize } from '../value-objects/reservation-party-size.value-object';
import { ReservationDuration } from '../value-objects/reservation-duration.value-object';
import { ReservationDate } from '../value-objects/reservation-date.value-object';
import { ReservationTime } from '../value-objects/reservation-time.value-object';
import { ReservationStatusEnum, ReservationTypeEnum, ReservationSourceEnum, ReservationPriorityEnum } from '../enums/reservation.enum';
import { ReservationGuest } from '../entities/reservation-guest.entity';
import { ReservationContact } from '../entities/reservation-contact.entity';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

describe('Reservation Aggregate', () => {
  const createValidReservation = () => {
    return Reservation.create({
      branchRef: BranchReference.create('branch-1'),
      guest: ReservationGuest.create({ firstName: 'John', lastName: 'Doe' }),
      contact: ReservationContact.create({ phone: '123456789' }),
      partySize: ReservationPartySize.create(4),
      date: ReservationDate.create(new Date(new Date().getTime() + 86400000)), // tomorrow
      time: ReservationTime.create('19:00'),
      duration: ReservationDuration.create(120),
      type: ReservationTypeEnum.STANDARD,
      source: ReservationSourceEnum.WEBSITE,
      priority: ReservationPriorityEnum.NORMAL
    });
  };

  it('should successfully create a valid reservation in PENDING state', () => {
    const reservation = createValidReservation();
    expect(reservation.status).toBe(ReservationStatusEnum.PENDING);
    expect(reservation.domainEvents.length).toBe(1);
    expect(reservation.domainEvents[0].constructor.name).toBe('ReservationCreatedEvent');
  });

  it('should fail creation if party size is 0', () => {
    expect(() => {
      Reservation.create({
        branchRef: BranchReference.create('branch-1'),
        guest: ReservationGuest.create({ firstName: 'John', lastName: 'Doe' }),
        contact: ReservationContact.create({ phone: '123456789' }),
        partySize: ReservationPartySize.create(0),
        date: ReservationDate.create(new Date(new Date().getTime() + 86400000)),
        time: ReservationTime.create('19:00'),
        duration: ReservationDuration.create(120),
        type: ReservationTypeEnum.STANDARD,
        source: ReservationSourceEnum.WEBSITE,
        priority: ReservationPriorityEnum.NORMAL
      });
    }).toThrow(ReservationDomainError);
  });

  it('should progress through the lifecycle', () => {
    const reservation = createValidReservation();
    reservation.clearEvents();

    reservation.confirm();
    expect(reservation.status).toBe(ReservationStatusEnum.CONFIRMED);

    reservation.checkIn();
    expect(reservation.status).toBe(ReservationStatusEnum.SEATED);

    reservation.complete();
    expect(reservation.status).toBe(ReservationStatusEnum.COMPLETED);
  });

  it('should not allow check-in before confirmation', () => {
    const reservation = createValidReservation();
    expect(() => reservation.checkIn()).toThrow(ReservationDomainError);
  });

  it('should not allow cancellation of completed reservations', () => {
    const reservation = createValidReservation();
    reservation.confirm();
    reservation.checkIn();
    reservation.complete();
    expect(() => reservation.cancel('Testing')).toThrow(ReservationDomainError);
  });
});