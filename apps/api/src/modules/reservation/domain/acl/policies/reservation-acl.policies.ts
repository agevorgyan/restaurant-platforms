import { ReservationDomainError } from '../../exceptions/reservation.exceptions';

export class ReservationACLPolicy {
  public static enforce(hasCorrelationId: boolean): void {
    if (!hasCorrelationId) throw new ReservationDomainError('Correlation ID is required for ACL processing');
  }
}

export class ReservationContractCompatibilityPolicy {
  public static enforce(isCompatible: boolean): void {
    if (!isCompatible) throw new ReservationDomainError('Contract is not compatible with the Reservation context');
  }
}

export class ReservationVersionNegotiationPolicy {
  public static enforce(isSupported: boolean): void {
    if (!isSupported) throw new ReservationDomainError('Contract version is not supported');
  }
}

export class ReservationTranslationPolicy {
  public static enforce(isTranslatable: boolean): void {
    if (!isTranslatable) throw new ReservationDomainError('Payload format is invalid for translation');
  }
}

export class ReservationExternalReferencePolicy {
  public static enforce(isValidIdentity: boolean): void {
    if (!isValidIdentity) throw new ReservationDomainError('External identity is invalid');
  }
}