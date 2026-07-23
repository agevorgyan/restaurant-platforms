import { ValueObject } from '@saas/core';

export interface TableReferenceProps { tableId: string; }
export class TableReference extends ValueObject<TableReferenceProps> {
  get tableId(): string { return this.props.tableId; }
  private constructor(props: TableReferenceProps) { super(props); }
  public static create(tableId: string): TableReference { return new TableReference({ tableId }); }
}