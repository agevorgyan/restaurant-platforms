import { ValueObject } from '@saas/core';

export interface ProcurementVersionProps {
  version: number;
}

export class ProcurementVersion extends ValueObject<ProcurementVersionProps> {
  get version(): number {
    return this.props.version;
  }

  private constructor(props: ProcurementVersionProps) {
    super(props);
  }

  public static create(version: number): ProcurementVersion {
    if (version < 1) {
      throw new Error('ProcurementVersion must be at least 1');
    }
    return new ProcurementVersion({ version });
  }

  public static initial(): ProcurementVersion {
    return new ProcurementVersion({ version: 1 });
  }

  public increment(): ProcurementVersion {
    return new ProcurementVersion({ version: this.props.version + 1 });
  }
}
