import { ValueObject } from '@saas/core';

export interface ContractCompatibilityProps { isCompatible: boolean; requiresMapping: boolean; }

export class ContractCompatibility extends ValueObject<ContractCompatibilityProps> {
  get isCompatible(): boolean { return this.props.isCompatible; }
  get requiresMapping(): boolean { return this.props.requiresMapping; }
  private constructor(props: ContractCompatibilityProps) { super(props); }
  public static create(props: ContractCompatibilityProps): ContractCompatibility {
    return new ContractCompatibility(props);
  }
}