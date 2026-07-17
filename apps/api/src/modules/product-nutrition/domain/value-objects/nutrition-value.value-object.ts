export class NutritionValue {
  constructor(
    public readonly value: number,
    public readonly unit: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.value < 0) {
      throw new Error('Nutrition values cannot be negative');
    }

    const validUnits = ['g', 'mg', 'mcg', 'kcal', 'oz', 'ml', 'fl oz'];
    if (!validUnits.includes(this.unit)) {
      throw new Error(`Invalid measurement unit: ${this.unit}`);
    }
  }
}
