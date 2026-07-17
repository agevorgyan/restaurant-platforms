export type AvailabilityDayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export class AvailabilityDay {
  constructor(public readonly value: AvailabilityDayType) {
    this.validate(value);
  }

  private validate(day: string): void {
    const valid = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!valid.includes(day)) {
      throw new Error(`Invalid Availability Day: ${day}`);
    }
  }
}
