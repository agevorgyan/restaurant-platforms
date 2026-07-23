import { ValueObject } from '@saas/core';

export interface ExternalReservationReferenceProps { systemId: string; externalId: string; }
export class ExternalReservationReference extends ValueObject<ExternalReservationReferenceProps> {
  get systemId(): string { return this.props.systemId; }
  get externalId(): string { return this.props.externalId; }
  private constructor(props: ExternalReservationReferenceProps) { super(props); }
  public static create(systemId: string, externalId: string): ExternalReservationReference { return new ExternalReservationReference({ systemId, externalId }); }
}