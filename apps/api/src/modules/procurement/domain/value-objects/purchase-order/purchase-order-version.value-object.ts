import { ValueObject } from '@saas/core';

export interface PurchaseOrderVersionProps { version: number; }

export class PurchaseOrderVersion extends ValueObject<PurchaseOrderVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: PurchaseOrderVersionProps) { super(props); }
  public static create(version: number): PurchaseOrderVersion {
    if (version < 1) throw new Error('Version must be at least 1');
    return new PurchaseOrderVersion({ version });
  }
  public static initial(): PurchaseOrderVersion { return new PurchaseOrderVersion({ version: 1 }); }
  public increment(): PurchaseOrderVersion { return new PurchaseOrderVersion({ version: this.props.version + 1 }); }
}