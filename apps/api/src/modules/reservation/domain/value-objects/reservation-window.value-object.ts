import { ValueObject } from '@saas/core';

export interface ReservationWindowProps { minLeadTimeHours: number; maxHorizonDays: number; }
export class ReservationWindow extends ValueObject<ReservationWindowProps> {
  get minLeadTimeHours(): number { return this.props.minLeadTimeHours; }
  get maxHorizonDays(): number { return this.props.maxHorizonDays; }
  private constructor(props: ReservationWindowProps) { super(props); }
  public static create(minLeadTimeHours: number, maxHorizonDays: number): ReservationWindow { return new ReservationWindow({ minLeadTimeHours, maxHorizonDays }); }
}