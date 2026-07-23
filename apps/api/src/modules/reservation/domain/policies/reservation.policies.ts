import { Reservation } from '../aggregates/reservation.aggregate';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class ReservationLifecyclePolicy {
  public static enforce(reservation: Reservation): void {
    if (!reservation) throw new ReservationDomainError('Reservation is required');
  }
}

export class ReservationValidationPolicy {
  public static enforceNew(partySize: number, duration: number): void {
    if (partySize <= 0) throw new ReservationDomainError('Party size must be greater than 0');
    if (duration <= 0) throw new ReservationDomainError('Duration must be greater than 0');
  }
}

export class ReservationAssignmentPolicy {
  public static enforce(assignment: any): void {
    if (!assignment) throw new ReservationDomainError('Assignment cannot be null');
  }
}

export class ReservationConfirmationPolicy {
  public static enforce(status: string): void {
    if (status === 'CANCELLED') throw new ReservationDomainError('Cannot confirm a cancelled reservation');
  }
}

export class ReservationCancellationPolicy {
  public static enforce(status: string): void {
    if (status === 'COMPLETED') throw new ReservationDomainError('Cannot cancel completed reservation');
  }
}