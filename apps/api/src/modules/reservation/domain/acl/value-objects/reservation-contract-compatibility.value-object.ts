import { ValueObject } from '@saas/core';

export interface ReservationContractCompatibilityProps { isCompatible: boolean; }
export class ReservationContractCompatibility extends ValueObject<ReservationContractCompatibilityProps> {
  get isCompatible(): boolean { return this.props.isCompatible; }
  private constructor(props: ReservationContractCompatibilityProps) { super(props); }
  public static create(isCompatible: boolean): ReservationContractCompatibility { return new ReservationContractCompatibility({ isCompatible }); }
}