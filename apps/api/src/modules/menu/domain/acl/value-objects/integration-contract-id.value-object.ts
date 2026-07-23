import { ValueObject } from '@saas/core';

export interface IntegrationContractIdProps { value: string; }

export class IntegrationContractId extends ValueObject<IntegrationContractIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IntegrationContractIdProps) { super(props); }
  public static create(value: string): IntegrationContractId {
    return new IntegrationContractId({ value });
  }
}