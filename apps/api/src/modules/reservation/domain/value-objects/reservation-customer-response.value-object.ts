import { ValueObject } from '@saas/core';
import { CustomerEligibility } from './customer-eligibility.value-object';
import { CustomerReservationStatistics } from './customer-reservation-statistics.value-object';

export interface ReservationCustomerResponseProps {
  eligibility: CustomerEligibility;
  statistics?: CustomerReservationStatistics;
  guestStatus: string; // 'Guest' | 'Registered' | 'Corporate' | 'VIP' | 'Employee'
  loyaltyIndicator: boolean;
  preferredCommunicationChannel: string;
}

export class ReservationCustomerResponse extends ValueObject<ReservationCustomerResponseProps> {
  get eligibility(): CustomerEligibility { return this.props.eligibility; }
  get statistics(): CustomerReservationStatistics | undefined { return this.props.statistics; }
  get guestStatus(): string { return this.props.guestStatus; }
  get loyaltyIndicator(): boolean { return this.props.loyaltyIndicator; }
  get preferredCommunicationChannel(): string { return this.props.preferredCommunicationChannel; }

  private constructor(props: ReservationCustomerResponseProps) { super(props); }
  public static create(props: ReservationCustomerResponseProps): ReservationCustomerResponse { return new ReservationCustomerResponse(props); }
}