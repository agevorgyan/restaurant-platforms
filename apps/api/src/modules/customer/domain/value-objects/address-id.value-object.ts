import { ValueObject } from '@saas/core';

export interface AddressIdProps { value: string; }

export class AddressId extends ValueObject<AddressIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: AddressIdProps) { super(props); }
  public static create(value?: string): AddressId {
    return new AddressId({ value: value || crypto.randomUUID() });
  }
}