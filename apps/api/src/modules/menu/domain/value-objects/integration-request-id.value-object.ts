import { ValueObject } from '@saas/core';

export interface IntegrationRequestIdProps { value: string; }

export class IntegrationRequestId extends ValueObject<IntegrationRequestIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IntegrationRequestIdProps) { super(props); }
  public static create(value?: string): IntegrationRequestId {
    return new IntegrationRequestId({ value: value || crypto.randomUUID() });
  }
}