import { ValueObject } from '@saas/core';
import { ExternalReservationReference } from './external-reservation-reference.value-object';

export interface ExternalReservationIdentityProps { reference: ExternalReservationReference; contextName: string; }
export class ExternalReservationIdentity extends ValueObject<ExternalReservationIdentityProps> {
  get reference(): ExternalReservationReference { return this.props.reference; }
  get contextName(): string { return this.props.contextName; }
  private constructor(props: ExternalReservationIdentityProps) { super(props); }
  public static create(reference: ExternalReservationReference, contextName: string): ExternalReservationIdentity { return new ExternalReservationIdentity({ reference, contextName }); }
}