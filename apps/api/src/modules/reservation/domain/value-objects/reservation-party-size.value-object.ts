import { ValueObject } from '@saas/core';

export interface ReservationPartySizeProps { size: number; }
export class ReservationPartySize extends ValueObject<ReservationPartySizeProps> {
  get size(): number { return this.props.size; }
  private constructor(props: ReservationPartySizeProps) { super(props); }
  public static create(size: number): ReservationPartySize { return new ReservationPartySize({ size }); }
}