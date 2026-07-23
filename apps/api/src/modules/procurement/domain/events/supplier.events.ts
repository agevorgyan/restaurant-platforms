import { DomainEvent } from '@saas/core';

export class SupplierCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly code: string, public readonly name: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierApprovedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly approvedBy: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierSuspendedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly reason: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierContactAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly contactId: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierContactRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly contactId: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierAddressAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly addressId: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierPaymentTermsUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly termsType: string) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}

export class SupplierRatingChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly supplierId: string, public readonly newScore: number) {
    this.dateTimeOccurred = new Date();
  }
  public getAggregateId(): string { return this.supplierId; }
}
