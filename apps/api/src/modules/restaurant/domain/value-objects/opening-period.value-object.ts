export class OpeningPeriod {
  constructor(
    public readonly opensAt: string, // Format HH:mm
    public readonly closesAt: string, // Format HH:mm
  ) {
    this.validateTimeFormat(opensAt, 'opensAt');
    this.validateTimeFormat(closesAt, 'closesAt');
    this.validateChronology(opensAt, closesAt);
  }

  private validateTimeFormat(time: string, field: string): void {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(time)) {
      throw new Error(`Invalid time format for ${field}. Expected HH:mm, got ${time}`);
    }
  }

  private validateChronology(opensAt: string, closesAt: string): void {
    if (opensAt >= closesAt) {
      throw new Error(`Closing time (${closesAt}) must be strictly after opening time (${opensAt})`);
    }
  }

  public overlaps(other: OpeningPeriod): boolean {
    // True if one period starts before the other ends, and ends after the other starts
    return this.opensAt < other.closesAt && this.closesAt > other.opensAt;
  }
}
