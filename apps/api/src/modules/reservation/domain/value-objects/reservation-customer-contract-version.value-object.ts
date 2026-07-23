import { ValueObject } from '@saas/core';

export interface ReservationCustomerContractVersionProps { version: string; }
export class ReservationCustomerContractVersion extends ValueObject<ReservationCustomerContractVersionProps> {
  get version(): string { return this.props.version; }
  private constructor(props: ReservationCustomerContractVersionProps) { super(props); }
  public static create(version: string): ReservationCustomerContractVersion { return new ReservationCustomerContractVersion({ version }); }
}