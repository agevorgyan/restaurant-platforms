import { ValueObject } from '@saas/core';

export interface ContractVersionProps { version: string; }

export class ContractVersion extends ValueObject<ContractVersionProps> {
  get version(): string { return this.props.version; }
  private constructor(props: ContractVersionProps) { super(props); }
  public static create(version: string): ContractVersion {
    return new ContractVersion({ version });
  }
}