import { ValueObject } from '@saas/core';

export interface ReservationContractVersionProps { version: string; }
export class ReservationContractVersion extends ValueObject<ReservationContractVersionProps> {
  get version(): string { return this.props.version; }
  private constructor(props: ReservationContractVersionProps) { super(props); }
  public static create(version: string): ReservationContractVersion { return new ReservationContractVersion({ version }); }
}