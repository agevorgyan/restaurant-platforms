import { Entity } from '@saas/core';

export interface SupplierConfirmationProps {
  confirmationReference: string;
  confirmedDate: Date;
  notes?: string;
}

export class SupplierConfirmation extends Entity<SupplierConfirmationProps> {
  get confirmationReference(): string { return this.props.confirmationReference; }
  get confirmedDate(): Date { return this.props.confirmedDate; }
  get notes(): string | undefined { return this.props.notes; }

  private constructor(id: string, props: SupplierConfirmationProps) { super(id, props); }

  public static create(props: SupplierConfirmationProps, id?: string): SupplierConfirmation {
    return new SupplierConfirmation(id || crypto.randomUUID(), props);
  }
}