import { ValueObject } from '@saas/core';
import { BusinessTime } from './business-time.value-object';

export interface BusinessHoursProps { open: BusinessTime; close: BusinessTime; }
export class BusinessHours extends ValueObject<BusinessHoursProps> {
  get open(): BusinessTime { return this.props.open; }
  get close(): BusinessTime { return this.props.close; }
  private constructor(props: BusinessHoursProps) { super(props); }
  public static create(open: BusinessTime, close: BusinessTime): BusinessHours { return new BusinessHours({ open, close }); }
}