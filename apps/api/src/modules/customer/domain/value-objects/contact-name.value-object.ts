import { ValueObject } from '@saas/core';

export interface ContactNameProps { name: string; }

export class ContactName extends ValueObject<ContactNameProps> {
  get name(): string { return this.props.name; }
  private constructor(props: ContactNameProps) { super(props); }
  public static create(name: string): ContactName {
    return new ContactName({ name });
  }
}