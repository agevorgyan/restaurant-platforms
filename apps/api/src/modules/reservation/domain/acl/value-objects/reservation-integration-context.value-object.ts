import { ValueObject } from '@saas/core';

export interface ReservationIntegrationContextProps { contextId: string; payload: any; }
export class ReservationIntegrationContext extends ValueObject<ReservationIntegrationContextProps> {
  get contextId(): string { return this.props.contextId; }
  get payload(): any { return this.props.payload; }
  private constructor(props: ReservationIntegrationContextProps) { super(props); }
  public static create(contextId: string, payload: any): ReservationIntegrationContext { return new ReservationIntegrationContext({ contextId, payload }); }
}