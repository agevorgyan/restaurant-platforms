import { ValueObject } from '@saas/core';

export interface AvailabilityStatusProps { status: 'AVAILABLE' | 'UNAVAILABLE'; }
export class AvailabilityStatus extends ValueObject<AvailabilityStatusProps> {
  get status(): 'AVAILABLE' | 'UNAVAILABLE' { return this.props.status; }
  private constructor(props: AvailabilityStatusProps) { super(props); }
  public static create(status: 'AVAILABLE' | 'UNAVAILABLE'): AvailabilityStatus { return new AvailabilityStatus({ status }); }
}