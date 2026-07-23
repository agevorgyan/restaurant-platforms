import { AggregateRoot } from '@saas/core';
import { CustomerId } from '../value-objects/customer-id.value-object';
import { CustomerCode } from '../value-objects/customer-code.value-object';
import { CustomerStatusVo } from '../value-objects/customer-status.value-object';
import { CustomerVersion } from '../value-objects/customer-version.value-object';
import { CustomerType } from '../enums/customer.enums';
import { CustomerStatus } from '../enums/customer.enums';
import { CustomerProfile } from '../entities/customer-profile.entity';
import { CustomerContact } from '../entities/customer-contact.entity';
import { CustomerPreference } from '../entities/customer-preference.entity';
import { CustomerConsent } from '../entities/customer-consent.entity';
import { CustomerIdentifier } from '../entities/customer-identifier.entity';
import { CustomerCreatedEvent, CustomerActivatedEvent } from '../events/customer.events';
import { CustomerValidationPolicy } from '../policies/customer.policies';

export interface CustomerProps {
  customerId: CustomerId;
  customerCode: CustomerCode;
  status: CustomerStatusVo;
  type: CustomerType;
  version: CustomerVersion;
  profile: CustomerProfile;
  contact: CustomerContact;
  preference?: CustomerPreference;
  consent: CustomerConsent;
  identifiers: CustomerIdentifier[];
}

export class Customer extends AggregateRoot<CustomerProps> {
  get customerId(): CustomerId { return this.props.customerId; }
  get customerCode(): CustomerCode { return this.props.customerCode; }
  get status(): CustomerStatusVo { return this.props.status; }
  get type(): CustomerType { return this.props.type; }
  get version(): CustomerVersion { return this.props.version; }
  get profile(): CustomerProfile { return this.props.profile; }
  get contact(): CustomerContact { return this.props.contact; }
  get consent(): CustomerConsent { return this.props.consent; }
  get identifiers(): CustomerIdentifier[] { return this.props.identifiers; }

  private constructor(props: CustomerProps) {
    super(props.customerId.value, props);
  }

  public static create(props: CustomerProps): Customer {
    CustomerValidationPolicy.validate(props);
    const customer = new Customer(props);
    customer.addDomainEvent(new CustomerCreatedEvent(customer.id, customer.type));
    return customer;
  }

  public activate(): void {
    if (this.type === CustomerType.GUEST) {
      throw new Error('Guest customers cannot be activated/verified');
    }
    if (!this.contact.isVerified) {
      throw new Error('At least one verified contact method required before activation');
    }
    if (!this.consent.privacyConsent.isGranted) {
      throw new Error('Privacy consent required before activation');
    }

    this.props.status = CustomerStatusVo.create(CustomerStatus.ACTIVE);
    this.addDomainEvent(new CustomerActivatedEvent(this.id));
  }
}