import { AvailabilityDay } from './availability-day.value-object';
import { AvailabilityTimeRange } from './availability-time-range.value-object';

export class AvailabilitySchedule {
  constructor(
    public readonly daysOfWeek: AvailabilityDay[],
    public readonly timeRanges: AvailabilityTimeRange[]
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.daysOfWeek.length === 0) {
      throw new Error('At least one day is required for a schedule');
    }

    if (this.timeRanges.length === 0) {
      throw new Error('At least one time range is required for a schedule');
    }

    // Rule: Time ranges within the same day must not overlap.
    // Since the schedule applies the same time ranges to the selected days, 
    // we just need to ensure the time ranges themselves do not overlap.
    for (let i = 0; i < this.timeRanges.length; i++) {
      for (let j = i + 1; j < this.timeRanges.length; j++) {
        if (this.timeRanges[i].overlapsWith(this.timeRanges[j])) {
          throw new Error('Time ranges must not overlap');
        }
      }
    }
  }
}
