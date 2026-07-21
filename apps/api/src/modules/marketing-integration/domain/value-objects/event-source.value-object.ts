import { ValueObject } from '@saas/core';

export enum EventSourceEnum {
  CAMPAIGN = 'marketing.campaign',
  PROMOTION = 'marketing.promotion',
  COUPON = 'marketing.coupon',
  DISCOUNT_POLICY = 'marketing.discount_policy',
  AUTOMATION = 'marketing.automation',
  COMMUNICATION = 'marketing.communication',
}

export interface EventSourceProps {
  value: EventSourceEnum;
}

export class EventSource extends ValueObject<EventSourceProps> {
  private constructor(props: EventSourceProps) {
    super(props);
  }

  public static create(value: EventSourceEnum): EventSource {
    return new EventSource({ value });
  }

  get value(): EventSourceEnum {
    return this.props.value;
  }
}
