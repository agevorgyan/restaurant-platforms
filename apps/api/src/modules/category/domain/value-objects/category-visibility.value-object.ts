export type CategoryVisibilityType = 'Public' | 'Hidden' | 'QR';

export class CategoryVisibility {
  constructor(public readonly value: CategoryVisibilityType) {
    this.validate(value);
  }

  private validate(visibility: string): void {
    const valid = ['Public', 'Hidden', 'QR'];
    if (!valid.includes(visibility)) {
      throw new Error(`Invalid Category Visibility: ${visibility}`);
    }
  }
}
