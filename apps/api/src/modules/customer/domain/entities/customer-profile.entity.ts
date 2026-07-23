import { Entity } from '@saas/core';
import { CustomerName } from '../value-objects/customer-name.value-object';
import { DateOfBirth } from '../value-objects/date-of-birth.value-object';
import { Gender } from '../value-objects/gender.value-object';

export interface CustomerProfileProps {
  name: CustomerName;
  dateOfBirth?: DateOfBirth;
  gender?: Gender;
}

export class CustomerProfile extends Entity<CustomerProfileProps> {
  get name(): CustomerName { return this.props.name; }
  get dateOfBirth(): DateOfBirth | undefined { return this.props.dateOfBirth; }
  get gender(): Gender | undefined { return this.props.gender; }
  private constructor(id: string, props: CustomerProfileProps) { super(id, props); }
  public static create(id: string, props: CustomerProfileProps): CustomerProfile {
    return new CustomerProfile(id, props);
  }
}