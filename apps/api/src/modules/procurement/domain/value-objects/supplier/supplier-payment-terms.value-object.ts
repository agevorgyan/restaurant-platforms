import { ValueObject } from '@saas/core';

export enum SupplierPaymentTermsType {
  PREPAID = 'PREPAID',
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_60 = 'NET_60',
  COD = 'COD',
  CUSTOM = 'CUSTOM'
}

export interface SupplierPaymentTermsProps {
  type: SupplierPaymentTermsType;
  customDays?: number;
}

export class SupplierPaymentTerms extends ValueObject<SupplierPaymentTermsProps> {
  get type(): SupplierPaymentTermsType {
    return this.props.type;
  }

  get customDays(): number | undefined {
    return this.props.customDays;
  }

  private constructor(props: SupplierPaymentTermsProps) {
    super(props);
  }

  public static create(type: SupplierPaymentTermsType, customDays?: number): SupplierPaymentTerms {
    if (type === SupplierPaymentTermsType.CUSTOM && (customDays === undefined || customDays < 0)) {
      throw new Error('Custom payment terms must specify valid days');
    }
    return new SupplierPaymentTerms({ type, customDays });
  }

  public static net30(): SupplierPaymentTerms {
    return new SupplierPaymentTerms({ type: SupplierPaymentTermsType.NET_30 });
  }
}
