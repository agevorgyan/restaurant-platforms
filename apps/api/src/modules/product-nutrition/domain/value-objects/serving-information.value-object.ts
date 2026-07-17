export class ServingInformation {
  constructor(
    public readonly servingSize: number,
    public readonly servingsPerContainer: number,
    public readonly measurementUnit: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.servingSize <= 0) {
      throw new Error('Serving size must be greater than zero');
    }

    if (this.servingsPerContainer < 0) {
      throw new Error('Servings per container cannot be negative');
    }

    const validUnits = ['g', 'mg', 'oz', 'ml', 'fl oz', 'piece', 'slice'];
    if (!validUnits.includes(this.measurementUnit)) {
      throw new Error(`Invalid measurement unit: ${this.measurementUnit}`);
    }
  }
}
