import { ValueObject } from '@saas/core';

export interface ProcurementEventVersionProps { version: number; }

export class ProcurementEventVersion extends ValueObject<ProcurementEventVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: ProcurementEventVersionProps) { super(props); }
  public static create(version: number): ProcurementEventVersion {
    if (version < 1) throw new Error('Version must be >= 1');
    return new ProcurementEventVersion({ version });
  }
}