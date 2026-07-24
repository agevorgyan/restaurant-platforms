import { DomainPrimitive } from '@saas/domain';

interface ShiftTimeProps {
  startTime: Date;
  endTime: Date;
}

export class ShiftTime extends DomainPrimitive<ShiftTimeProps> {
  private constructor(value: ShiftTimeProps) {
    super(value);
  }

  public static create(startTime: Date, endTime: Date): ShiftTime {
    if (startTime >= endTime) {
      throw new Error('Shift start time must be before end time.');
    }
    return new ShiftTime({ startTime, endTime });
  }

  get startTime(): Date {
    return this.value.startTime;
  }

  get endTime(): Date {
    return this.value.endTime;
  }
}
