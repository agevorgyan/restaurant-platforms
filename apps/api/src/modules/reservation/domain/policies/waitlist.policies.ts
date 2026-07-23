import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class QueuePolicy {
  public static enforceUniqueReservation(entries: any[], reservationRefStr?: string): void {
    if (!reservationRefStr) return;
    if (entries.some(e => e.reservationRef?.reference === reservationRefStr)) {
      throw new ReservationDomainError('Duplicate ReservationReference prohibited');
    }
  }

  public static enforceUniqueCustomer(entries: any[], customerRefStr?: string): void {
    if (!customerRefStr) return;
    if (entries.some(e => e.customerRef?.customerId === customerRefStr)) {
      throw new ReservationDomainError('Duplicate CustomerReference prohibited');
    }
  }
}

export class PromotionPolicy {
  public static enforceValidTransition(currentStatus: string): void {
    if (currentStatus === 'EXPIRED') throw new ReservationDomainError('Expired entries cannot be promoted');
    if (currentStatus === 'CANCELLED') throw new ReservationDomainError('Cancelled entries cannot be promoted');
  }
}

export class AcceptancePolicy {
  public static enforceValidTransition(currentStatus: string): void {
    if (currentStatus === 'ACCEPTED') throw new ReservationDomainError('Accepted entries cannot return to Waiting');
  }
}

export class ExpirationPolicy {
  public static enforceDeadlineIsInFuture(deadline: Date): void {
    if (deadline.getTime() <= new Date().getTime()) {
      throw new ReservationDomainError('PromotionDeadline must be in the future');
    }
  }
}

export class PriorityPolicy {
  public static enforceValidPosition(position: number): void {
    if (position <= 0) throw new ReservationDomainError('QueuePosition must be > 0');
  }
}