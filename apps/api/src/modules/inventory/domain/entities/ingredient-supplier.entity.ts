import { Entity } from '@saas/core';

export interface IngredientSupplierProps {
  id: string;
  ingredientId: string;
  supplierId: string;
  supplierItemCode?: string;
  isPreferred: boolean;
  leadTimeDays?: number;
  minimumOrderQuantity?: number;
}

export class IngredientSupplier extends Entity<IngredientSupplierProps> {
  get id(): string {
    return this._id;
  }
  
  get ingredientId(): string {
    return this.props.ingredientId;
  }

  get supplierId(): string {
    return this.props.supplierId;
  }

  get supplierItemCode(): string | undefined {
    return this.props.supplierItemCode;
  }

  get isPreferred(): boolean {
    return this.props.isPreferred;
  }

  get leadTimeDays(): number | undefined {
    return this.props.leadTimeDays;
  }

  get minimumOrderQuantity(): number | undefined {
    return this.props.minimumOrderQuantity;
  }

  public setPreferred(isPreferred: boolean): void {
    this.props.isPreferred = isPreferred;
  }

  public static create(props: IngredientSupplierProps): IngredientSupplier {
    if (!props.supplierId) {
      throw new Error('Supplier ID is required');
    }
    
    if (props.leadTimeDays !== undefined && props.leadTimeDays < 0) {
      throw new Error('Lead time cannot be negative');
    }
    
    if (props.minimumOrderQuantity !== undefined && props.minimumOrderQuantity <= 0) {
      throw new Error('Minimum order quantity must be greater than zero');
    }

    return new IngredientSupplier(props.id, {
      ...props,
      isPreferred: props.isPreferred ?? false
    });
  }
}
