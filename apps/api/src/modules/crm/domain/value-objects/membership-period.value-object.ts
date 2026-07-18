export class MembershipPeriod {
  constructor(
    public readonly startDate: Date,
    public readonly endDate?: Date
  ) {
    if (endDate && startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  isEffective(date: Date = new Date()): boolean {
    if (date < this.startDate) return false;
    if (this.endDate && date > this.endDate) return false;
    return true;
  }
}
