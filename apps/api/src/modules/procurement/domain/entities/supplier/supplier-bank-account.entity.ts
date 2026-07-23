import { Entity } from '@saas/core';

export interface SupplierBankAccountProps {
  bankName: string;
  accountName: string;
  accountNumber: string; // Keep as string or encrypted string depending on infra, Domain only holds string
  routingNumber?: string;
  swiftBic?: string;
  iban?: string;
  isPrimary: boolean;
}

export class SupplierBankAccount extends Entity<SupplierBankAccountProps> {
  get bankName(): string { return this.props.bankName; }
  get accountName(): string { return this.props.accountName; }
  get accountNumber(): string { return this.props.accountNumber; }
  get routingNumber(): string | undefined { return this.props.routingNumber; }
  get swiftBic(): string | undefined { return this.props.swiftBic; }
  get iban(): string | undefined { return this.props.iban; }
  get isPrimary(): boolean { return this.props.isPrimary; }

  private constructor(props: SupplierBankAccountProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: SupplierBankAccountProps, id?: string): SupplierBankAccount {
    if (!props.bankName || props.bankName.trim() === '') throw new Error('bankName is required');
    if (!props.accountName || props.accountName.trim() === '') throw new Error('accountName is required');
    if (!props.accountNumber || props.accountNumber.trim() === '') throw new Error('accountNumber is required');
    
    return new SupplierBankAccount(props, id);
  }

  public setPrimary(isPrimary: boolean): void {
    this.props.isPrimary = isPrimary;
  }
}
