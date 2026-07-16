export type ProductAvailabilityType = 'Available' | 'Unavailable' | 'OutOfStock' | 'Hidden';

export class ProductAvailability {
  constructor(public readonly value: ProductAvailabilityType) {
    this.validate(value);
  }

  private validate(availability: string): void {
    const valid = ['Available', 'Unavailable', 'OutOfStock', 'Hidden'];
    if (!valid.includes(availability)) {
      throw new Error(`Invalid Product Availability: ${availability}`);
    }
  }
}
