import { ValueObject } from '@saas/core';

export interface PurchaseRequisitionVersionProps {
  version: number;
}

export class PurchaseRequisitionVersion extends ValueObject<PurchaseRequisitionVersionProps> {
  get version(): number {
    return this.props.version;
  }

  private constructor(props: PurchaseRequisitionVersionProps) {
    super(props);
  }

  public static create(version: number): PurchaseRequisitionVersion {
    if (version < 1) {
      throw new Error('PurchaseRequisitionVersion must be at least 1');
    }
    return new PurchaseRequisitionVersion({ version });
  }

  public static initial(): PurchaseRequisitionVersion {
    return new PurchaseRequisitionVersion({ version: 1 });
  }

  public increment(): PurchaseRequisitionVersion {
    return new PurchaseRequisitionVersion({ version: this.props.version + 1 });
  }
}
