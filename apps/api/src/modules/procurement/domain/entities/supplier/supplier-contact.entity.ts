import { Entity } from '@saas/core';
import { SupplierEmail } from '../../value-objects/supplier/supplier-email.value-object';
import { SupplierPhone } from '../../value-objects/supplier/supplier-phone.value-object';

export interface SupplierContactProps {
  firstName: string;
  lastName: string;
  role: string;
  email: SupplierEmail;
  phone?: SupplierPhone;
  isPrimary: boolean;
}

export class SupplierContact extends Entity<SupplierContactProps> {
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get role(): string { return this.props.role; }
  get email(): SupplierEmail { return this.props.email; }
  get phone(): SupplierPhone | undefined { return this.props.phone; }
  get isPrimary(): boolean { return this.props.isPrimary; }

  private constructor(props: SupplierContactProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: SupplierContactProps, id?: string): SupplierContact {
    if (!props.firstName || props.firstName.trim() === '') throw new Error('Contact firstName is required');
    if (!props.lastName || props.lastName.trim() === '') throw new Error('Contact lastName is required');
    if (!props.role || props.role.trim() === '') throw new Error('Contact role is required');
    
    return new SupplierContact(props, id);
  }

  public setPrimary(isPrimary: boolean): void {
    this.props.isPrimary = isPrimary;
  }
}
