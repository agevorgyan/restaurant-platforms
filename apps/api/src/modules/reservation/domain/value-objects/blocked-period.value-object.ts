import { ValueObject } from '@saas/core';
import { BusinessTime } from './business-time.value-object';
import { BusinessDate } from './business-date.value-object';

export interface BlockedPeriodProps { date: BusinessDate; start: BusinessTime; end: BusinessTime; reason: string; }
export class BlockedPeriod extends ValueObject<BlockedPeriodProps> {
  get date(): BusinessDate { return this.props.date; }
  get start(): BusinessTime { return this.props.start; }
  get end(): BusinessTime { return this.props.end; }
  get reason(): string { return this.props.reason; }
  private constructor(props: BlockedPeriodProps) { super(props); }
  public static create(date: BusinessDate, start: BusinessTime, end: BusinessTime, reason: string): BlockedPeriod { return new BlockedPeriod({ date, start, end, reason }); }
}