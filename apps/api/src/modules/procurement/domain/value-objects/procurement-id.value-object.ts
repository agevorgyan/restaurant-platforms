import { ValueObject } from '@saas/core';

export interface ProcurementIdProps {
  value: string;
}

export class ProcurementId extends ValueObject<ProcurementIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ProcurementIdProps) {
    super(props);
  }

  public static create(value: string): ProcurementId {
    if (!value || value.trim() === '') {
      throw new Error('ProcurementId cannot be empty');
    }
    return new ProcurementId({ value: value.trim() });
  }

  public static generate(): ProcurementId {
    return new ProcurementId({ value: crypto.randomUUID() });
  }
}
