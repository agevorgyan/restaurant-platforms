import { ValueObject } from '@saas/core';

export interface ReservationNotesProps { notes: string; }
export class ReservationNotes extends ValueObject<ReservationNotesProps> {
  get notes(): string { return this.props.notes; }
  private constructor(props: ReservationNotesProps) { super(props); }
  public static create(notes: string): ReservationNotes { return new ReservationNotes({ notes }); }
}