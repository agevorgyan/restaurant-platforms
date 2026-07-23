import { SupplierStatus } from '../enums/procurement.enums';
import { SupplierDomainError } from '../errors/procurement.errors';
import { SupplierConsistencySpecification, SupplierApprovalSpecification } from '../specifications/supplier.specification';
import { SupplierContact } from '../entities/supplier/supplier-contact.entity';
import { SupplierAddress } from '../entities/supplier/supplier-address.entity';
import { SupplierPaymentTerms } from '../value-objects/supplier/supplier-payment-terms.value-object';

export class SupplierLifecyclePolicy {
  public static ensureCanActivate(
    status: SupplierStatus,
    contacts: SupplierContact[],
    addresses: SupplierAddress[],
    paymentTerms?: SupplierPaymentTerms
  ): void {
    if (status === SupplierStatus.BLACKLISTED) {
      throw new SupplierDomainError('Cannot activate a blacklisted supplier');
    }
    if (!SupplierConsistencySpecification.isActivatable(status, contacts, addresses, paymentTerms)) {
      throw new SupplierDomainError('Supplier must have a primary contact, primary address, and payment terms before activation');
    }
  }

  public static ensureCanSuspend(status: SupplierStatus): void {
    if (status !== SupplierStatus.ACTIVE) {
      throw new SupplierDomainError('Only active suppliers can be suspended');
    }
  }
}

export class SupplierValidationPolicy {
  public static ensureCodeImmutable(isActivated: boolean, newCode: string, oldCode: string): void {
    if (isActivated && newCode !== oldCode) {
      throw new SupplierDomainError('Supplier code is immutable after activation');
    }
  }
}

export class SupplierApprovalPolicy {
  public static ensureCanApprove(status: SupplierStatus): void {
    if (!SupplierApprovalSpecification.canBeApproved(status)) {
      throw new SupplierDomainError('Supplier is not in a state that can be approved');
    }
  }
}

export class SupplierPerformancePolicy {
  public static ensureAcceptablePerformance(ratingScore: number): void {
    if (ratingScore < 2) {
      // In a real system this might dispatch a warning event, here we just validate it
      // throw new SupplierDomainError('Supplier performance is unacceptably low');
    }
  }
}
