import { ValueObject } from '@saas/core';

export interface SupplierSelectionResultProps {
  selectedSupplierId: string;
  alternativeSupplierIds: string[];
  selectionReason: string;
}

export class SupplierSelectionResult extends ValueObject<SupplierSelectionResultProps> {
  get selectedSupplierId(): string { return this.props.selectedSupplierId; }
  get alternativeSupplierIds(): string[] { return [...this.props.alternativeSupplierIds]; }
  get selectionReason(): string { return this.props.selectionReason; }

  private constructor(props: SupplierSelectionResultProps) { super(props); }

  public static create(props: SupplierSelectionResultProps): SupplierSelectionResult {
    if (!props.selectedSupplierId) throw new Error('SelectedSupplierId cannot be empty');
    return new SupplierSelectionResult(props);
  }
}