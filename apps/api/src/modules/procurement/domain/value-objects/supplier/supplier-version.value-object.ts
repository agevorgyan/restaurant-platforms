import { ValueObject } from '@saas/core';

export interface SupplierVersionProps {
  version: number;
}

export class SupplierVersion extends ValueObject<SupplierVersionProps> {
  get version(): number {
    return this.props.version;
  }

  private constructor(props: SupplierVersionProps) {
    super(props);
  }

  public static create(version: number): SupplierVersion {
    if (version < 1) {
      throw new Error('SupplierVersion must be at least 1');
    }
    return new SupplierVersion({ version });
  }

  public static initial(): SupplierVersion {
    return new SupplierVersion({ version: 1 });
  }

  public increment(): SupplierVersion {
    return new SupplierVersion({ version: this.props.version + 1 });
  }
}
