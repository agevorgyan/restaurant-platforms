import { Entity } from '@saas/core';
import { ExpectedDeliveryDate } from '../../value-objects/purchase-order/expected-delivery-date.value-object';

export interface DeliveryScheduleProps {
  expectedDate: ExpectedDeliveryDate;
  instructions?: string;
}

export class DeliverySchedule extends Entity<DeliveryScheduleProps> {
  get expectedDate(): ExpectedDeliveryDate { return this.props.expectedDate; }
  get instructions(): string | undefined { return this.props.instructions; }

  private constructor(id: string, props: DeliveryScheduleProps) { super(id, props); }

  public static create(props: DeliveryScheduleProps, id?: string): DeliverySchedule {
    return new DeliverySchedule(id || crypto.randomUUID(), props);
  }
}