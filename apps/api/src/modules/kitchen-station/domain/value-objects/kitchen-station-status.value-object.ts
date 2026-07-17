export type KitchenStationStatusType = 'Active' | 'Inactive' | 'Maintenance';

export class KitchenStationStatus {
  constructor(public readonly value: KitchenStationStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid station status: ${value}`);
    }
  }

  private isValid(value: string): value is KitchenStationStatusType {
    return ['Active', 'Inactive', 'Maintenance'].includes(value);
  }

  public canReceiveTickets(): boolean {
    return this.value === 'Active';
  }

  public participatesInRouting(): boolean {
    return this.value === 'Active';
  }
}
