import { ValueObject } from '@saas/core';

export interface KitchenVersionProps {
  version: number;
}

export class KitchenVersion extends ValueObject<KitchenVersionProps> {
  get version(): number {
    return this.props.version;
  }

  private constructor(props: KitchenVersionProps) {
    super(props);
  }

  public static create(version: number = 1): KitchenVersion {
    if (version < 1) {
      throw new Error('Kitchen version must be at least 1');
    }
    return new KitchenVersion({ version });
  }

  public increment(): KitchenVersion {
    return new KitchenVersion({ version: this.props.version + 1 });
  }
}
