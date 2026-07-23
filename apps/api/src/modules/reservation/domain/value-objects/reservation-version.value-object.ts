import { ValueObject } from '@saas/core';

export interface ReservationVersionProps { version: number; }
export class ReservationVersion extends ValueObject<ReservationVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: ReservationVersionProps) { super(props); }
  public static create(version: number): ReservationVersion { return new ReservationVersion({ version }); }
}