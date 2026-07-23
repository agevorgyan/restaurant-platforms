export class ReservationDomainError extends Error {
  public readonly code = 'RESERVATION_DOMAIN_ERROR';
  constructor(message: string) {
    super(message);
    this.name = 'ReservationDomainError';
  }
}

export class ReservationValidationError extends Error {
  public readonly code = 'RESERVATION_VALIDATION_ERROR';
  constructor(message: string) {
    super(message);
    this.name = 'ReservationValidationError';
  }
}

export class WaitlistDomainError extends Error {
  public readonly code = 'WAITLIST_DOMAIN_ERROR';
  constructor(message: string) {
    super(message);
    this.name = 'WaitlistDomainError';
  }
}