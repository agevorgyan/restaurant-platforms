import { Entity } from '@saas/core';

export interface SupplierCertificationProps {
  name: string;
  issuer: string;
  registrationNumber: string;
  validFrom: Date;
  validTo?: Date;
  documentUrl?: string;
}

export class SupplierCertification extends Entity<SupplierCertificationProps> {
  get name(): string { return this.props.name; }
  get issuer(): string { return this.props.issuer; }
  get registrationNumber(): string { return this.props.registrationNumber; }
  get validFrom(): Date { return this.props.validFrom; }
  get validTo(): Date | undefined { return this.props.validTo; }
  get documentUrl(): string | undefined { return this.props.documentUrl; }

  private constructor(props: SupplierCertificationProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: SupplierCertificationProps, id?: string): SupplierCertification {
    if (!props.name || props.name.trim() === '') throw new Error('Certification name is required');
    if (!props.issuer || props.issuer.trim() === '') throw new Error('Issuer is required');
    if (!props.registrationNumber || props.registrationNumber.trim() === '') throw new Error('Registration number is required');
    
    if (props.validTo && props.validTo < props.validFrom) {
      throw new Error('validTo must be after validFrom');
    }

    return new SupplierCertification(props, id);
  }

  public isExpired(atDate: Date = new Date()): boolean {
    return this.props.validTo !== undefined && this.props.validTo < atDate;
  }
}
