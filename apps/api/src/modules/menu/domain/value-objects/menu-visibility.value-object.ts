export type MenuVisibilityType = 'Public' | 'Private' | 'QR' | 'Hidden';

export class MenuVisibility {
  constructor(public readonly value: MenuVisibilityType) {
    this.validate(value);
  }

  private validate(visibility: string): void {
    const valid = ['Public', 'Private', 'QR', 'Hidden'];
    if (!valid.includes(visibility)) {
      throw new Error(`Invalid Menu Visibility: ${visibility}`);
    }
  }
}
