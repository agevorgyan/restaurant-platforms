import { ValueObject } from '@saas/core';

export interface AcceptanceStatusProps { status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'; }
export class AcceptanceStatus extends ValueObject<AcceptanceStatusProps> {
  get status(): 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' { return this.props.status; }
  private constructor(props: AcceptanceStatusProps) { super(props); }
  public static create(status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'): AcceptanceStatus { return new AcceptanceStatus({ status }); }
}