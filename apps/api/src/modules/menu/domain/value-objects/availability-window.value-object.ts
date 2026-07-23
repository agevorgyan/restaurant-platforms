import { ValueObject } from '@saas/core';

export interface AvailabilityWindowProps {
  startTime: string; // HH:mm format
  endTime: string;
}

export class AvailabilityWindow extends ValueObject<AvailabilityWindowProps> {
  get startTime(): string { return this.props.startTime; }
  get endTime(): string { return this.props.endTime; }

  private constructor(props: AvailabilityWindowProps) { super(props); }

  public static create(startTime: string, endTime: string): AvailabilityWindow {
    return new AvailabilityWindow({ startTime, endTime });
  }
}