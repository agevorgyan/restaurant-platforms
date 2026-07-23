import { ValueObject } from '@saas/core';
import { BusinessTime } from './business-time.value-object';

export interface AvailabilityWindowProps { start: BusinessTime; end: BusinessTime; }
export class AvailabilityWindow extends ValueObject<AvailabilityWindowProps> {
  get start(): BusinessTime { return this.props.start; }
  get end(): BusinessTime { return this.props.end; }
  private constructor(props: AvailabilityWindowProps) { super(props); }
  public static create(start: BusinessTime, end: BusinessTime): AvailabilityWindow { return new AvailabilityWindow({ start, end }); }
}