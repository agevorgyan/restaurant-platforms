export class ContractPeriod {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) throw new Error('Invalid start date');
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) throw new Error('Invalid end date');
    if (startDate >= endDate) throw new Error('Start date must be before end date');
  }

  isCurrent(currentDate: Date = new Date()): boolean {
    return currentDate >= this.startDate && currentDate <= this.endDate;
  }
}
