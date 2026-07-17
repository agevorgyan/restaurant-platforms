import { AvailabilitySchedule } from './availability-schedule.value-object';

export type AvailabilityMode = 'Always' | 'Scheduled' | 'Manual' | 'Seasonal';

export class ProductAvailabilityPolicy {
  constructor(
    public readonly availabilityMode: AvailabilityMode,
    public readonly alwaysAvailable: boolean,
    public readonly enabled: boolean,
    public readonly seasonal: boolean,
    public readonly priority: number,
    public readonly timezone: string,
    public readonly branchIds?: string[],
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly schedule?: AvailabilitySchedule
  ) {
    this.validate();
  }

  private validate(): void {
    const validModes = ['Always', 'Scheduled', 'Manual', 'Seasonal'];
    if (!validModes.includes(this.availabilityMode)) {
      throw new Error(`Invalid availability mode: ${this.availabilityMode}`);
    }

    // Rule: Timezone must be a valid IANA timezone.
    try {
      Intl.DateTimeFormat(undefined, { timeZone: this.timezone });
    } catch {
      throw new Error(`Invalid IANA timezone: ${this.timezone}`);
    }

    // Rule: When availabilityMode is Always, alwaysAvailable must be true.
    if (this.availabilityMode === 'Always' && !this.alwaysAvailable) {
      throw new Error('When availabilityMode is Always, alwaysAvailable must be true');
    }

    // Rule: When availabilityMode is Scheduled, at least one day and one time range are required.
    // (This is implicitly handled by the AvailabilitySchedule VO throwing if empty, 
    // but we must ensure a schedule is provided).
    if (this.availabilityMode === 'Scheduled') {
      if (!this.schedule) {
        throw new Error('Schedule is required when availabilityMode is Scheduled');
      }
    }

    // Rule: When availabilityMode is Seasonal, startDate and endDate are required.
    if (this.availabilityMode === 'Seasonal') {
      if (!this.startDate || !this.endDate) {
        throw new Error('startDate and endDate are required when availabilityMode is Seasonal');
      }
    }

    // Rule: End date must not be before start date.
    if (this.startDate && this.endDate) {
      if (this.endDate < this.startDate) {
        throw new Error('End date must not be before start date');
      }
    }
  }
}
