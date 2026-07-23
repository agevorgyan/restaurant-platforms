import { ValueObject } from '@saas/core';

export interface ReservationContractTypeProps { type: string; }
export class ReservationContractType extends ValueObject<ReservationContractTypeProps> {
  get type(): string { return this.props.type; }
  private constructor(props: ReservationContractTypeProps) { super(props); }
  public static create(type: string): ReservationContractType { return new ReservationContractType({ type }); }
}