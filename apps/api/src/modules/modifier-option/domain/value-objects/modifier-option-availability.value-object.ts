export type ModifierOptionAvailabilityType = 'Available' | 'Unavailable' | 'Hidden';

export class ModifierOptionAvailability {
  constructor(public readonly value: ModifierOptionAvailabilityType) {
    this.validate(value);
  }

  private validate(availability: string): void {
    const valid = ['Available', 'Unavailable', 'Hidden'];
    if (!valid.includes(availability)) {
      throw new Error(`Invalid Modifier Option Availability: ${availability}`);
    }
  }

  public isAvailable(): boolean {
    return this.value === 'Available';
  }
}
