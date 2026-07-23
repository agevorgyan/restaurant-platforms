import { CustomerIdentitySpecification } from '../specifications/customer.specifications';
import { CustomerDomainError } from '../errors/customer.errors';

export class CustomerLifecyclePolicy {
  public static enforce(_customer: any): void {
    void _customer;
  }
}

export class CustomerValidationPolicy {
  public static validate(props: any): void {
    if (!props.customerId || !props.customerCode) {
      throw new CustomerDomainError('Identity fields are required');
    }
    if (!CustomerIdentitySpecification.isSatisfiedBy(props.identifiers || [])) {
      throw new CustomerDomainError('Duplicate external identifiers prohibited');
    }
  }
}

export class ConsentPolicy {
  public static validate(consent: any): void {
    if (!consent.privacyConsent.isGranted) {
      throw new CustomerDomainError('Privacy consent required');
    }
  }
}

export class CommunicationPolicy {
  public static validate(contact: any): void {
    if (!contact.email && !contact.phone) {
      throw new CustomerDomainError('At least one contact method is required');
    }
  }
}
export class AddressPolicy {
  public static validate(address: any): void {
    if (!address.countryCode || address.countryCode.code.length !== 2) {
      throw new Error('Valid ISO CountryCode required');
    }
  }
}

export class AddressVerificationPolicy {
  public static validate(address: any): void {
    if (address.verification.status.status !== 'VERIFIED') {
      throw new Error('Address is not verified');
    }
  }
}

export class DefaultAddressPolicy {
  public static validate(addresses: any[]): void {
    // Enforcement handled by Specification in aggregate
    void addresses;
  }
}
