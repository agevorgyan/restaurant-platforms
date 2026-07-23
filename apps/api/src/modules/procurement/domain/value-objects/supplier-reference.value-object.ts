import { ValueObject } from '@saas/core';

export interface SupplierReferenceProps {
  supplierId: string;
  supplierName: string;
}

export class SupplierReference extends ValueObject<SupplierReferenceProps> {
  get supplierId(): string {
    return this.props.supplierId;
  }

  get supplierName(): string {
    return this.props.supplierName;
  }

  private constructor(props: SupplierReferenceProps) {
    super(props);
  }

  public static create(supplierId: string, supplierName: string): SupplierReference {
    if (!supplierId || supplierId.trim() === '') {
      throw new Error('SupplierId is required for SupplierReference');
    }
    if (!supplierName || supplierName.trim() === '') {
      throw new Error('SupplierName is required for SupplierReference');
    }
    return new SupplierReference({ 
      supplierId: supplierId.trim(), 
      supplierName: supplierName.trim() 
    });
  }
}
