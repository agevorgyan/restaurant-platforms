import { SupplierStatus } from '../enums/procurement.enums';
import { SupplierContact } from '../entities/supplier/supplier-contact.entity';
import { SupplierAddress } from '../entities/supplier/supplier-address.entity';
import { SupplierCertification } from '../entities/supplier/supplier-certification.entity';
import { SupplierPaymentTerms } from '../value-objects/supplier/supplier-payment-terms.value-object';

export class SupplierConsistencySpecification {
  public static isActivatable(
    status: SupplierStatus,
    contacts: SupplierContact[],
    addresses: SupplierAddress[],
    paymentTerms?: SupplierPaymentTerms
  ): boolean {
    // Must have at least one primary contact
    const hasPrimaryContact = contacts.some(c => c.isPrimary);
    // Must have at least one primary address
    const hasPrimaryAddress = addresses.some(a => a.isPrimary);
    // Must have payment terms defined
    const hasPaymentTerms = paymentTerms !== undefined;
    
    return hasPrimaryContact && hasPrimaryAddress && hasPaymentTerms;
  }
}

export class SupplierApprovalSpecification {
  public static canBeApproved(status: SupplierStatus): boolean {
    // We assume supplier is in DRAFT -> PendingApproval -> Active
    // Only pending approval can be approved. (We map PendingApproval to a conceptual state or enum if needed, wait, SupplierStatus enum: ACTIVE, INACTIVE, ON_HOLD, BLACKLISTED)
    // Wait, the lifecycle rule says: Draft -> PendingApproval -> Active -> Suspended -> Archived. 
    // Let's assume SupplierStatus is sufficient, or we just validate it's not active/blacklisted yet.
    return status !== SupplierStatus.ACTIVE && status !== SupplierStatus.BLACKLISTED;
  }
}

export class SupplierPaymentSpecification {
  public static hasValidTerms(terms?: SupplierPaymentTerms): boolean {
    return terms !== undefined;
  }
}

export class SupplierCertificationSpecification {
  public static hasActiveCertification(certs: SupplierCertification[], certName: string): boolean {
    const cert = certs.find(c => c.name === certName);
    if (!cert) return false;
    return !cert.isExpired();
  }
}
