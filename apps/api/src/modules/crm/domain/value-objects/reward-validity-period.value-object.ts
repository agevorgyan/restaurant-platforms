export class RewardValidityPeriod {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    if (startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  isValid(date: Date = new Date()): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  overlaps(other: RewardValidityPeriod): boolean {
    return this.startDate <= other.endDate && this.endDate >= other.startDate;
  }
}
