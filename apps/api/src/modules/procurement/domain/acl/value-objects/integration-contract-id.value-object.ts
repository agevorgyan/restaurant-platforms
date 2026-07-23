import { ValueObject } from '@saas/core';

export interface IntegrationContractIdProps { value: string; }

export class IntegrationContractId extends ValueObject<IntegrationContractIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IntegrationContractIdProps) { super(props); }
  public static create(value: string): IntegrationContractId {
    if (!value) throw new Error('IntegrationContractId is required');
    return new IntegrationContractId({ value });
  }
}