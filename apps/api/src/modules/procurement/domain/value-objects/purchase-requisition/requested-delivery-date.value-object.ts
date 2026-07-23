import { ValueObject } from '@saas/core';

export interface RequestedDeliveryDateProps {
  date: Date;
}

export class RequestedDeliveryDate extends ValueObject<RequestedDeliveryDateProps> {
  get date(): Date {
    return this.props.date;
  }

  private constructor(props: RequestedDeliveryDateProps) {
    super(props);
  }

  public static create(date: Date, currentDate: Date = new Date()): RequestedDeliveryDate {
    // Delivery date must be in the future
    // Just resetting time for pure date comparison if needed, but doing simple compare here:
    if (date <= currentDate) {
      throw new Error('Requested delivery date must be in the future');
    }
    return new RequestedDeliveryDate({ date });
  }
}
