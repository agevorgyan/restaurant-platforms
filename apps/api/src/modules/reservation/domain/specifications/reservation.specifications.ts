export class ReservationSpecification {
  public isSatisfiedBy(reservation: any): boolean {
    void reservation;
    return true;
  }
}

export class ReservationValidationSpecification {
  public isSatisfiedBy(data: any): boolean {
    void data;
    return true;
  }
}

export class AvailabilitySpecification {
  public isSatisfiedBy(time: any): boolean {
    void time;
    return true;
  }
}

export class CapacitySpecification {
  public isSatisfiedBy(partySize: any, tableCapacity: any): boolean {
    void partySize; void tableCapacity;
    return true;
  }
}

export class WaitlistSpecification {
  public isSatisfiedBy(waitlistEntry: any): boolean {
    void waitlistEntry;
    return true;
  }
}