import { AggregateRoot } from '@saas/core';
import { SupplierId } from '../value-objects/supplier-id.value-object';
import { SupplierName } from '../value-objects/supplier/supplier-name.value-object';
import { SupplierCode } from '../value-objects/supplier/supplier-code.value-object';
import { SupplierTaxNumber } from '../value-objects/supplier/supplier-tax-number.value-object';
import { SupplierPaymentTerms } from '../value-objects/supplier/supplier-payment-terms.value-object';
import { SupplierCurrency } from '../value-objects/supplier/supplier-currency.value-object';
import { SupplierRating } from '../value-objects/supplier/supplier-rating.value-object';
import { SupplierStatus } from '../enums/procurement.enums';
import { SupplierContact } from '../entities/supplier/supplier-contact.entity';
import { SupplierAddress } from '../entities/supplier/supplier-address.entity';
import { SupplierBankAccount } from '../entities/supplier/supplier-bank-account.entity';
import { SupplierCertification } from '../entities/supplier/supplier-certification.entity';
import { SupplierPerformanceRecord } from '../entities/supplier/supplier-performance-record.entity';
import { SupplierNote } from '../entities/supplier/supplier-note.entity';
import { 
  SupplierCreatedEvent, 
  SupplierApprovedEvent, 
  SupplierActivatedEvent, 
  SupplierSuspendedEvent, 
  SupplierArchivedEvent,
  SupplierContactAddedEvent,
  SupplierAddressAddedEvent,
  SupplierPaymentTermsUpdatedEvent,
  SupplierRatingChangedEvent
} from '../events/supplier.events';
import { SupplierLifecyclePolicy, SupplierValidationPolicy, SupplierApprovalPolicy } from '../policies/supplier.policy';

export interface SupplierProps {
  name: SupplierName;
  code: SupplierCode;
  taxNumber?: SupplierTaxNumber;
  status: SupplierStatus;
  paymentTerms?: SupplierPaymentTerms;
  currency?: SupplierCurrency;
  rating: SupplierRating;
  
  contacts: SupplierContact[];
  addresses: SupplierAddress[];
  bankAccounts: SupplierBankAccount[];
  certifications: SupplierCertification[];
  performanceRecords: SupplierPerformanceRecord[];
  notes: SupplierNote[];

  createdAt: Date;
  updatedAt: Date;
}

export class Supplier extends AggregateRoot<SupplierProps> {
  get name(): SupplierName { return this.props.name; }
  get code(): SupplierCode { return this.props.code; }
  get taxNumber(): SupplierTaxNumber | undefined { return this.props.taxNumber; }
  get status(): SupplierStatus { return this.props.status; }
  get paymentTerms(): SupplierPaymentTerms | undefined { return this.props.paymentTerms; }
  get currency(): SupplierCurrency | undefined { return this.props.currency; }
  get rating(): SupplierRating { return this.props.rating; }
  
  get contacts(): SupplierContact[] { return [...this.props.contacts]; }
  get addresses(): SupplierAddress[] { return [...this.props.addresses]; }
  get bankAccounts(): SupplierBankAccount[] { return [...this.props.bankAccounts]; }
  get certifications(): SupplierCertification[] { return [...this.props.certifications]; }
  get performanceRecords(): SupplierPerformanceRecord[] { return [...this.props.performanceRecords]; }
  get notes(): SupplierNote[] { return [...this.props.notes]; }

  private constructor(props: SupplierProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(name: SupplierName, code: SupplierCode, taxNumber?: SupplierTaxNumber): Supplier {
    const id = SupplierId.generate().value;
    const supplier = new Supplier({
      name,
      code,
      taxNumber,
      status: SupplierStatus.INACTIVE, // Draft essentially
      rating: SupplierRating.unrated(),
      contacts: [],
      addresses: [],
      bankAccounts: [],
      certifications: [],
      performanceRecords: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }, id);

    supplier.addDomainEvent(new SupplierCreatedEvent(id, code.value, name.value));
    return supplier;
  }

  public approve(approverId: string): void {
    SupplierApprovalPolicy.ensureCanApprove(this.props.status);
    // Move to next logical step if needed. Since enum doesn't have PendingApproval, we might jump directly to active or just record approval.
    // Let's assume approval is recorded, but activation is separate.
    this.addDomainEvent(new SupplierApprovedEvent(this._id, approverId));
  }

  public activate(): void {
    SupplierLifecyclePolicy.ensureCanActivate(
      this.props.status, 
      this.props.contacts, 
      this.props.addresses, 
      this.props.paymentTerms
    );
    
    this.props.status = SupplierStatus.ACTIVE;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SupplierActivatedEvent(this._id));
  }

  public suspend(reason: string): void {
    SupplierLifecyclePolicy.ensureCanSuspend(this.props.status);
    this.props.status = SupplierStatus.ON_HOLD;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SupplierSuspendedEvent(this._id, reason));
  }

  public archive(): void {
    this.props.status = SupplierStatus.INACTIVE; // Represent archived as inactive
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SupplierArchivedEvent(this._id));
  }

  public updateCode(newCode: SupplierCode): void {
    SupplierValidationPolicy.ensureCodeImmutable(this.props.status === SupplierStatus.ACTIVE, newCode.value, this.props.code.value);
    this.props.code = newCode;
    this.props.updatedAt = new Date();
  }

  public addContact(contact: SupplierContact): void {
    this.props.contacts.push(contact);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SupplierContactAddedEvent(this._id, contact.id));
  }

  public removeContact(contactId: string): void {
    this.props.contacts = this.props.contacts.filter(c => c.id !== contactId);
    this.props.updatedAt = new Date();
  }

  public addAddress(address: SupplierAddress): void {
    this.props.addresses.push(address);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SupplierAddressAddedEvent(this._id, address.id));
  }

  public updatePaymentTerms(terms: SupplierPaymentTerms): void {
    this.props.paymentTerms = terms;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SupplierPaymentTermsUpdatedEvent(this._id, terms.type));
  }

  public updateRating(rating: SupplierRating): void {
    this.props.rating = rating;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SupplierRatingChangedEvent(this._id, rating.score));
  }
}
