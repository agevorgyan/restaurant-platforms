import { ValueObject } from '@saas/core';

export interface MarketingEventIdProps {
  value: string;
}

export class MarketingEventId extends ValueObject<MarketingEventIdProps> {
  private constructor(props: MarketingEventIdProps) {
    super(props);
  }

  public static create(value: string): MarketingEventId {
    if (!value || value.trim().length === 0) {
      throw new Error('MarketingEventId cannot be empty');
    }
    return new MarketingEventId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
