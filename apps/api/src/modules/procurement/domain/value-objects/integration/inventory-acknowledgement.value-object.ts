import { ValueObject } from '@saas/core';

export interface InventoryAcknowledgementProps {
  isAcknowledged: boolean;
  acknowledgedAt: Date;
  referenceId: string;
}

export class InventoryAcknowledgement extends ValueObject<InventoryAcknowledgementProps> {
  get isAcknowledged(): boolean { return this.props.isAcknowledged; }
  get acknowledgedAt(): Date { return this.props.acknowledgedAt; }
  get referenceId(): string { return this.props.referenceId; }

  private constructor(props: InventoryAcknowledgementProps) { super(props); }

  public static create(props: InventoryAcknowledgementProps): InventoryAcknowledgement {
    return new InventoryAcknowledgement(props);
  }
}