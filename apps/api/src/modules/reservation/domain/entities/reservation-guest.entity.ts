import { Entity } from '@saas/core';
import { CustomerReference } from '../value-objects/customer-reference.value-object';

export interface ReservationGuestProps {
  firstName: string;
  lastName: string;
  customerRef?: CustomerReference;
}

export class ReservationGuest extends Entity<ReservationGuestProps> {
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get customerRef(): CustomerReference | undefined { return this.props.customerRef; }

  private constructor(id: string, props: ReservationGuestProps) { super(id, props); }
  public static create(props: ReservationGuestProps, id?: string): ReservationGuest {
    return new ReservationGuest(id || crypto.randomUUID(), props);
  }
}