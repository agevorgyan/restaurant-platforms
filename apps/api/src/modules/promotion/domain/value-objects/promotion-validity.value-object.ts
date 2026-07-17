export class PromotionValidity {
  constructor(
    public readonly startDate: Date,
    public readonly endDate?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.endDate && this.endDate.getTime() < this.startDate.getTime()) {
      throw new Error('Validity end date must not be before start date');
    }
  }

  public isActive(currentDate: Date = new Date()): boolean {
    const current = currentDate.getTime();
    if (current < this.startDate.getTime()) {
      return false;
    }
    if (this.endDate && current > this.endDate.getTime()) {
      return false;
    }
    return true;
  }
}
