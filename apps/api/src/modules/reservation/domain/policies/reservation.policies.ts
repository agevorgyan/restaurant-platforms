export class ReservationPolicy {
  public static enforce(reservation: any): void {
    void reservation;
  }
}

export class ReservationValidationPolicy {
  public static enforce(data: any): void {
    void data;
  }
}

export class CapacityPolicy {
  public static enforce(partySize: any): void {
    void partySize;
  }
}

export class AvailabilityPolicy {
  public static enforce(time: any): void {
    void time;
  }
}

export class WaitlistPolicy {
  public static enforce(entry: any): void {
    void entry;
  }
}