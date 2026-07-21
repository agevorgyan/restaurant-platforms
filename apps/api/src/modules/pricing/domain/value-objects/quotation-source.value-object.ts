import { ValueObject } from '@saas/core';

export enum QuotationSourceEnum {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  POS = 'POS',
  KIOSK = 'KIOSK',
  API = 'API'
}

export interface QuotationSourceProps {
  value: QuotationSourceEnum;
}

export class QuotationSource extends ValueObject<QuotationSourceProps> {
  private constructor(props: QuotationSourceProps) {
    super(props);
  }

  public static create(value: QuotationSourceEnum): QuotationSource {
    if (!Object.values(QuotationSourceEnum).includes(value)) {
      throw new Error(`Invalid quotation source: ${value}`);
    }
    return new QuotationSource({ value });
  }

  get value(): QuotationSourceEnum {
    return this.props.value;
  }
}
