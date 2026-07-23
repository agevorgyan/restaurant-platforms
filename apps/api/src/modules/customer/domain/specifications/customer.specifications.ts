import { CustomerType } from '../enums/customer.enums';

export class CustomerConsistencySpecification {
  public static isSatisfiedBy(_customer: any): boolean {
    void _customer;
    return true;
  }
}

export class CustomerContactSpecification {
  public static isSatisfiedBy(contact: any): boolean {
    return contact.email || contact.phone;
  }
}

export class CustomerConsentSpecification {
  public static isSatisfiedBy(consent: any): boolean {
    return consent.privacyConsent.isGranted;
  }
}

export class CustomerIdentitySpecification {
  public static isSatisfiedBy(identifiers: any[]): boolean {
    const providers = identifiers.map(i => i.externalReference.provider);
    return new Set(providers).size === providers.length; // No duplicate providers
  }
}

export class CustomerStatusSpecification {
  public static canVerify(type: CustomerType): boolean {
    return type !== CustomerType.GUEST;
  }
}