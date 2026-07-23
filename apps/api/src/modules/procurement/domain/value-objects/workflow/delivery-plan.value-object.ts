import { ValueObject } from '@saas/core';

export interface DeliveryPlanProps {
  estimatedLeadTimeDays: number;
  expectedDeliveryDate: Date;
  targetWarehouseId: string;
}

export class DeliveryPlan extends ValueObject<DeliveryPlanProps> {
  get estimatedLeadTimeDays(): number { return this.props.estimatedLeadTimeDays; }
  get expectedDeliveryDate(): Date { return this.props.expectedDeliveryDate; }
  get targetWarehouseId(): string { return this.props.targetWarehouseId; }

  private constructor(props: DeliveryPlanProps) { super(props); }

  public static create(props: DeliveryPlanProps): DeliveryPlan {
    if (props.estimatedLeadTimeDays < 0) throw new Error('Lead time cannot be negative');
    return new DeliveryPlan(props);
  }
}