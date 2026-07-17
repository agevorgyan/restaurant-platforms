export class PreparationTimePolicy {
  constructor(
    public readonly expectedDurationMinutes: number,
    public readonly slaThresholdMinutes: number
  ) {
    if (expectedDurationMinutes < 0) {
      throw new Error('Workflow duration cannot be negative');
    }
    if (slaThresholdMinutes < expectedDurationMinutes) {
      throw new Error('SLA threshold cannot be less than expected duration');
    }
  }

  public isExceeded(elapsedMinutes: number): boolean {
    return elapsedMinutes > this.slaThresholdMinutes;
  }
}
