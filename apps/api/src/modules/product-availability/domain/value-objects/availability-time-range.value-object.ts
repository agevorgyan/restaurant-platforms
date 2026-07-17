export class AvailabilityTimeRange {
  constructor(
    public readonly startTime: string, // format: "HH:mm"
    public readonly endTime: string
  ) {
    this.validate();
  }

  private validate(): void {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    
    if (!timeRegex.test(this.startTime)) {
      throw new Error(`Invalid startTime format: ${this.startTime}. Expected HH:mm`);
    }
    
    if (!timeRegex.test(this.endTime)) {
      throw new Error(`Invalid endTime format: ${this.endTime}. Expected HH:mm`);
    }

    if (this.startTime >= this.endTime) {
      throw new Error('Start time must be earlier than end time');
    }
  }

  public overlapsWith(other: AvailabilityTimeRange): boolean {
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }
}
