import { BusinessDay } from './business-day.value-object';

export class WorkingHours {
  constructor(
    public readonly days: BusinessDay[],
  ) {
    this.validateSevenDays(days);
  }

  private validateSevenDays(days: BusinessDay[]): void {
    if (days.length !== 7) {
      throw new Error('WorkingHours must explicitly define all 7 days of the week');
    }

    const assignedDays = new Set(days.map(d => d.dayOfWeek));
    if (assignedDays.size !== 7) {
      throw new Error('WorkingHours must define exactly one BusinessDay for each day of the week (0-6)');
    }
  }

  public getDay(dayOfWeek: number): BusinessDay {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error('dayOfWeek must be between 0 and 6');
    }
    const day = this.days.find(d => d.dayOfWeek === dayOfWeek);
    if (!day) {
      throw new Error(`BusinessDay for dayOfWeek ${dayOfWeek} is missing`);
    }
    return day;
  }

  public isOpen(dayOfWeek: number): boolean {
    return this.getDay(dayOfWeek).isOpen();
  }

  public isClosed(dayOfWeek: number): boolean {
    return this.getDay(dayOfWeek).isClosed;
  }

  public isTwentyFourHours(dayOfWeek: number): boolean {
    return this.getDay(dayOfWeek).isTwentyFourHours;
  }

  public getOpeningPeriods(dayOfWeek: number) {
    return this.getDay(dayOfWeek).openingPeriods;
  }
}
