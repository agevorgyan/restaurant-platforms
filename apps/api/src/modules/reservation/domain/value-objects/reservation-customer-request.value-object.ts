import { ValueObject } from '@saas/core';
import { ReservationReference } from './reservation-reference.value-object';
import { CustomerReference } from './customer-reference.value-object';
import { GuestReference } from './guest-reference.value-object';
import { BranchReference } from './branch-reference.value-object';
import { BusinessDate } from './business-date.value-object';
import { ReservationCustomerCorrelationId } from './reservation-customer-correlation-id.value-object';

export interface ReservationCustomerRequestProps {
  reservationRef: ReservationReference;
  customerRef?: CustomerReference;
  guestRef?: GuestReference;
  branchRef: BranchReference;
  businessDateTime: BusinessDate;
  correlationId: ReservationCustomerCorrelationId;
}

export class ReservationCustomerRequest extends ValueObject<ReservationCustomerRequestProps> {
  get reservationRef(): ReservationReference { return this.props.reservationRef; }
  get customerRef(): CustomerReference | undefined { return this.props.customerRef; }
  get guestRef(): GuestReference | undefined { return this.props.guestRef; }
  get branchRef(): BranchReference { return this.props.branchRef; }
  get businessDateTime(): BusinessDate { return this.props.businessDateTime; }
  get correlationId(): ReservationCustomerCorrelationId { return this.props.correlationId; }

  private constructor(props: ReservationCustomerRequestProps) { super(props); }
  public static create(props: ReservationCustomerRequestProps): ReservationCustomerRequest { return new ReservationCustomerRequest(props); }
}