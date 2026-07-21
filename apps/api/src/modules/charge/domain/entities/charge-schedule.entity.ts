import { Entity } from '@saas/core';

export interface ChargeScheduleProps {
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
}

export class ChargeSchedule extends Entity<ChargeScheduleProps> {
  private constructor(id: string, props: ChargeScheduleProps) {
    super(id, props);
  }

  public static create(id: string, props: ChargeScheduleProps): ChargeSchedule {
    if (props.daysOfWeek.some(d => d < 0 || d > 6)) {
      throw new Error('daysOfWeek must be between 0 (Sunday) and 6 (Saturday)');
    }
    if (props.startTime && !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(props.startTime)) {
      throw new Error('startTime must be in HH:mm format');
    }
    if (props.endTime && !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(props.endTime)) {
      throw new Error('endTime must be in HH:mm format');
    }
    return new ChargeSchedule(id, props);
  }

  get daysOfWeek(): number[] {
    return [...this.props.daysOfWeek];
  }

  get startTime(): string | undefined {
    return this.props.startTime;
  }

  get endTime(): string | undefined {
    return this.props.endTime;
  }
}
