import { ValueObject } from '@saas/core';
import { AddressType as AddressTypeEnum } from '../enums/customer.enums';

export interface AddressTypeProps { type: AddressTypeEnum; }

export class AddressType extends ValueObject<AddressTypeProps> {
  get type(): AddressTypeEnum { return this.props.type; }
  private constructor(props: AddressTypeProps) { super(props); }
  public static create(type: AddressTypeEnum): AddressType {
    return new AddressType({ type });
  }
}