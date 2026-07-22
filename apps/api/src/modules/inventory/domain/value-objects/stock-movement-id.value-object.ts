import { ValueObject } from '@saas/core';

export interface StockMovementIdProps {
  value: string;
}

export class StockMovementId extends ValueObject<StockMovementIdProps> {
  private constructor(props: StockMovementIdProps) {
    super(props);
  }

  public static create(value?: string): StockMovementId {
    return new StockMovementId({ value: value || crypto.randomUUID() });
  }

  get value(): string {
    return this.props.value;
  }
}
