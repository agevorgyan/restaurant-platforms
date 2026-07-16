import { TimeRange } from './time-range.value-object';

export class WorkingHours {
  constructor(
    public readonly dayOfWeek: number, // 0 = Sunday, 1 = Monday, etc.
    public readonly ranges: TimeRange[],
    public readonly isClosed: boolean,
  ) {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error('Invalid day of week. Must be between 0 and 6.');
    }
  }
}
