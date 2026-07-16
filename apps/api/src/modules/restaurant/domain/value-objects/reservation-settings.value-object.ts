export class ReservationSettings {
  constructor(
    public readonly reservationsEnabled: boolean,
    public readonly reservationInterval: number,
    public readonly maxGuestsPerReservation: number,
  ) {
    if (reservationsEnabled) {
      if (reservationInterval <= 0) {
        throw new Error(`reservationInterval must be a positive numeric value`);
      }
      if (maxGuestsPerReservation <= 0) {
        throw new Error(`maxGuestsPerReservation must be a positive numeric value`);
      }
    }
  }
}
