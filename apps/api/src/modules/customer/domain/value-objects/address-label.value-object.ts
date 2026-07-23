import { ValueObject } from '@saas/core';

export interface AddressLabelProps { label: string; }

export class AddressLabel extends ValueObject<AddressLabelProps> {
  get label(): string { return this.props.label; }
  private constructor(props: AddressLabelProps) { super(props); }
  public static create(label: string): AddressLabel {
    return new AddressLabel({ label });
  }
}