import { ValueObject } from '@saas/core';

export enum ValuationMethodEnum {
  FIFO = 'FIFO',
  WEIGHTED_AVERAGE = 'WEIGHTED_AVERAGE',
  MOVING_AVERAGE = 'MOVING_AVERAGE'
}

export interface ValuationMethodProps {
  value: ValuationMethodEnum;
}

export class ValuationMethod extends ValueObject<ValuationMethodProps> {
  private constructor(props: ValuationMethodProps) {
    super(props);
  }

  public static create(value: ValuationMethodEnum): ValuationMethod {
    if (value === 'LIFO' as any) {
      throw new Error('LIFO valuation method is explicitly unsupported');
    }
    
    if (!Object.values(ValuationMethodEnum).includes(value)) {
      throw new Error(`Invalid valuation method: ${value}`);
    }

    return new ValuationMethod({ value });
  }

  get value(): ValuationMethodEnum {
    return this.props.value;
  }
}
