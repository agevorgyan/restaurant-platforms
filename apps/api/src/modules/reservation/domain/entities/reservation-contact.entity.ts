import { Entity } from '@saas/core';

export interface ReservationContactProps {
  email?: string;
  phone?: string;
}

export class ReservationContact extends Entity<ReservationContactProps> {
  get email(): string | undefined { return this.props.email; }
  get phone(): string | undefined { return this.props.phone; }

  private constructor(id: string, props: ReservationContactProps) { super(id, props); }
  public static create(props: ReservationContactProps, id?: string): ReservationContact {
    return new ReservationContact(id || crypto.randomUUID(), props);
  }
}