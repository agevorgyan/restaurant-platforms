import { ValueObject } from '@saas/core';

export interface CustomerReservationStatisticsProps { totalReservations: number; noShows: number; cancellations: number; }
export class CustomerReservationStatistics extends ValueObject<CustomerReservationStatisticsProps> {
  get totalReservations(): number { return this.props.totalReservations; }
  get noShows(): number { return this.props.noShows; }
  get cancellations(): number { return this.props.cancellations; }
  private constructor(props: CustomerReservationStatisticsProps) { super(props); }
  public static create(totalReservations: number, noShows: number, cancellations: number): CustomerReservationStatistics { return new CustomerReservationStatistics({ totalReservations, noShows, cancellations }); }
}