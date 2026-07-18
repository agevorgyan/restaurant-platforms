export class PriceValidityPeriod {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) throw new Error('Invalid start date');
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) throw new Error('Invalid end date');
    if (startDate >= endDate) throw new Error('Start date must be before end date');
  }

  overlapsWith(other: PriceValidityPeriod): boolean {
    return this.startDate <= other.endDate && this.endDate >= other.startDate;
  }
}
