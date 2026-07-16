export class TimeRange {
  constructor(
    public readonly startTime: string, // e.g. "09:00"
    public readonly endTime: string,   // e.g. "17:00"
  ) {
    if (!this.isValidTime(startTime) || !this.isValidTime(endTime)) {
      throw new Error("Invalid time format. Expected HH:mm");
    }
  }

  private isValidTime(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }
}
