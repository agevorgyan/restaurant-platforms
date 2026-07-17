export type ModifierSelectionType = 'Single' | 'Multiple' | 'Quantity';

export class ModifierSelectionRules {
  constructor(
    public readonly selectionType: ModifierSelectionType,
    public readonly minimumSelections: number,
    public readonly maximumSelections: number,
    public readonly isRequired: boolean,
    public readonly allowMultipleSelections: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    const validTypes = ['Single', 'Multiple', 'Quantity'];
    if (!validTypes.includes(this.selectionType)) {
      throw new Error(`Invalid selectionType: ${this.selectionType}`);
    }

    if (this.minimumSelections < 0) {
      throw new Error('minimumSelections cannot be negative');
    }

    if (this.maximumSelections < this.minimumSelections) {
      throw new Error('maximumSelections must be greater than or equal to minimumSelections');
    }

    if (this.selectionType === 'Single' && this.maximumSelections !== 1) {
      throw new Error('If selectionType is Single, maximumSelections must equal 1');
    }
  }
}
