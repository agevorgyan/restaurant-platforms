import { ValueObject } from '@saas/core';

export interface TableCapacityProps { capacity: number; }
export class TableCapacity extends ValueObject<TableCapacityProps> {
  get capacity(): number { return this.props.capacity; }
  private constructor(props: TableCapacityProps) { super(props); }
  public static create(capacity: number): TableCapacity { return new TableCapacity({ capacity }); }
}