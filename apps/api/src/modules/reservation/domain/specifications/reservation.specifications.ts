import { Reservation } from '../aggregates/reservation.aggregate';

export class ReservationConsistencySpecification {
  public static isConsistent(reservation: Reservation): boolean {
    return reservation.partySize.size > 0 && reservation.duration.minutes > 0;
  }
}

export class ReservationCapacitySpecification {
  public static fits(partySize: number, tableCapacity: number): boolean {
    return partySize <= tableCapacity;
  }
}

export class ReservationStatusSpecification {
  public static canCheckIn(status: string): boolean {
    return status === 'CONFIRMED';
  }
}

export class ReservationGuestSpecification {
  public static hasValidContact(reservation: Reservation): boolean {
    return !!(reservation.contact.phone || reservation.contact.email);
  }
}

export class ReservationAssignmentSpecification {
  public static isAssigned(reservation: Reservation): boolean {
    return reservation.assignments.length > 0;
  }
}