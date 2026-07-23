import { ValueObject } from '@saas/core';

export interface InventoryFailureReasonProps { code: string; message: string; }

export class InventoryFailureReason extends ValueObject<InventoryFailureReasonProps> {
  get code(): string { return this.props.code; }
  get message(): string { return this.props.message; }
  private constructor(props: InventoryFailureReasonProps) { super(props); }
  public static create(code: string, message: string): InventoryFailureReason {
    return new InventoryFailureReason({ code, message });
  }
}