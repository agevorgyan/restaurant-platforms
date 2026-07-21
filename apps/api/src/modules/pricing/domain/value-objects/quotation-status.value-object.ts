import { ValueObject } from '@saas/core';

export enum QuotationStatusEnum {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  PUBLISHED = 'PUBLISHED',
  EXPIRED = 'EXPIRED',
  SUPERSEDED = 'SUPERSEDED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface QuotationStatusProps {
  value: QuotationStatusEnum;
}

export class QuotationStatus extends ValueObject<QuotationStatusProps> {
  private constructor(props: QuotationStatusProps) {
    super(props);
  }

  public static create(value: QuotationStatusEnum): QuotationStatus {
    if (!Object.values(QuotationStatusEnum).includes(value)) {
      throw new Error(`Invalid quotation status: ${value}`);
    }
    return new QuotationStatus({ value });
  }

  public static initial(): QuotationStatus {
    return new QuotationStatus({ value: QuotationStatusEnum.DRAFT });
  }

  get value(): QuotationStatusEnum {
    return this.props.value;
  }
}
