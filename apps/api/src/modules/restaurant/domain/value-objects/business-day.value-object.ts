import { OpeningPeriod } from './opening-period.value-object';

export class BusinessDay {
  constructor(
    public readonly dayOfWeek: number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    public readonly isClosed: boolean,
    public readonly isTwentyFourHours: boolean,
    public readonly openingPeriods: OpeningPeriod[] = [],
  ) {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error('dayOfWeek must be between 0 (Sunday) and 6 (Saturday)');
    }

    if (isClosed && isTwentyFourHours) {
      throw new Error('A day cannot be both closed and open 24 hours');
    }

    if (isClosed && openingPeriods.length > 0) {
      throw new Error('A closed day cannot have opening periods');
    }

    if (isTwentyFourHours && openingPeriods.length > 0) {
      throw new Error('A 24-hour day cannot have specific opening periods');
    }

    if (openingPeriods.length > 5) {
      throw new Error('A business day can have a maximum of 5 opening periods');
    }

    this.validateNonOverlappingPeriods(openingPeriods);
  }

  private validateNonOverlappingPeriods(periods: OpeningPeriod[]): void {
    for (let i = 0; i < periods.length; i++) {
      for (let j = i + 1; j < periods.length; j++) {
        if (periods[i].overlaps(periods[j])) {
          throw new Error(`Opening periods cannot overlap: ${periods[i].opensAt}-${periods[i].closesAt} overlaps with ${periods[j].opensAt}-${periods[j].closesAt}`);
        }
      }
    }
  }

  public isOpen(): boolean {
    return !this.isClosed;
  }
}
