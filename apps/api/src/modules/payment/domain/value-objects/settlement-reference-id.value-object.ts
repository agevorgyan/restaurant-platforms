import { ValueObject } from '@saas/core';

export interface SettlementReferenceIdProps {
  value: string;
}

export class SettlementReferenceId extends ValueObject<SettlementReferenceIdProps> {
  private constructor(props: SettlementReferenceIdProps) {
    super(props);
  }

  public static create(value: string): SettlementReferenceId {
    if (!value || value.trim().length === 0) {
      throw new Error('SettlementReferenceId cannot be empty');
    }
    return new SettlementReferenceId({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
