export type ServiceChargeType = 'Percentage' | 'Fixed';

export class ServiceCharge {
  constructor(
    public readonly name: string,
    public readonly type: ServiceChargeType,
    public readonly value: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.type === 'Fixed' && this.value < 0) {
      throw new Error('Fixed service charges must be zero or greater');
    }
    if (this.type === 'Percentage' && (this.value < 0 || this.value > 100)) {
      throw new Error('Service charge percentages must be between 0 and 100');
    }
  }
}
