import { ValueObject } from '@saas/core';

export interface DisplayOrderProps { order: number; }

export class DisplayOrder extends ValueObject<DisplayOrderProps> {
  get order(): number { return this.props.order; }
  private constructor(props: DisplayOrderProps) { super(props); }
  public static create(order: number): DisplayOrder {
    if (order < 0) throw new Error('DisplayOrder cannot be negative');
    return new DisplayOrder({ order });
  }
}