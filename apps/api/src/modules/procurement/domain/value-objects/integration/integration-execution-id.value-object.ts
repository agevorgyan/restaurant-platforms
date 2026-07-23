import { ValueObject } from '@saas/core';

export interface IntegrationExecutionIdProps { value: string; }

export class IntegrationExecutionId extends ValueObject<IntegrationExecutionIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IntegrationExecutionIdProps) { super(props); }
  public static create(value?: string): IntegrationExecutionId {
    return new IntegrationExecutionId({ value: value || crypto.randomUUID() });
  }
}