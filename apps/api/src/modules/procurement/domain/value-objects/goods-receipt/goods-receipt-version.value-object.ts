import { ValueObject } from '@saas/core';

export interface GoodsReceiptVersionProps { version: number; }

export class GoodsReceiptVersion extends ValueObject<GoodsReceiptVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: GoodsReceiptVersionProps) { super(props); }
  public static create(version: number): GoodsReceiptVersion {
    if (version < 1) throw new Error('GoodsReceiptVersion must be at least 1');
    return new GoodsReceiptVersion({ version });
  }
  public static initial(): GoodsReceiptVersion { return new GoodsReceiptVersion({ version: 1 }); }
  public increment(): GoodsReceiptVersion { return new GoodsReceiptVersion({ version: this.props.version + 1 }); }
}