import { ValueObject } from '@saas/core';

export interface ReservationCustomerContextProps { context: any; }
export class ReservationCustomerContext extends ValueObject<ReservationCustomerContextProps> {
  get context(): any { return this.props.context; }
  private constructor(props: ReservationCustomerContextProps) { super(props); }
  public static create(context: any): ReservationCustomerContext { return new ReservationCustomerContext({ context }); }
}