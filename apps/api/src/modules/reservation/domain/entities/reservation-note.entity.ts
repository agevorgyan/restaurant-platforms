import { Entity } from '@saas/core';
import { ReservationNotes } from '../value-objects/reservation-notes.value-object';

export interface ReservationNoteProps {
  note: ReservationNotes;
  author: string;
  createdAt: Date;
}

export class ReservationNote extends Entity<ReservationNoteProps> {
  get note(): ReservationNotes { return this.props.note; }
  get author(): string { return this.props.author; }
  get createdAt(): Date { return this.props.createdAt; }

  private constructor(id: string, props: ReservationNoteProps) { super(id, props); }
  public static create(props: ReservationNoteProps, id?: string): ReservationNote {
    return new ReservationNote(id || crypto.randomUUID(), props);
  }
}