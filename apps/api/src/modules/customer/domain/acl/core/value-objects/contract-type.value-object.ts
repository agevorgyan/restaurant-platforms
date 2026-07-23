import { ValueObject } from '@saas/core';

export interface ContractTypeProps { type: string; }

export class ContractType extends ValueObject<ContractTypeProps> {
  get type(): string { return this.props.type; }
  private constructor(props: ContractTypeProps) { super(props); }
  public static create(type: string): ContractType {
    return new ContractType({ type });
  }
}