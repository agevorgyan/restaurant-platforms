import { ValueObject } from '@saas/core';

export interface ProcurementContractVersionProps { version: string; }

export class ProcurementContractVersion extends ValueObject<ProcurementContractVersionProps> {
  get version(): string { return this.props.version; }
  private constructor(props: ProcurementContractVersionProps) { super(props); }
  public static create(version: string): ProcurementContractVersion {
    if (!version) throw new Error('Contract version is required');
    return new ProcurementContractVersion({ version });
  }
}