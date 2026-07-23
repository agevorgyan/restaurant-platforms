import { ValueObject } from '@saas/core';

export interface ProcurementEventTypeProps { type: string; }

export class ProcurementEventType extends ValueObject<ProcurementEventTypeProps> {
  get type(): string { return this.props.type; }
  private constructor(props: ProcurementEventTypeProps) { super(props); }
  public static create(type: string): ProcurementEventType {
    if (!type) throw new Error('Event type is required');
    return new ProcurementEventType({ type });
  }
}