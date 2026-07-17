export type KitchenStatusType = 'Open' | 'Closed' | 'Paused' | 'Maintenance';

export class KitchenStatus {
  constructor(public readonly value: KitchenStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid kitchen status: ${value}`);
    }
  }

  private isValid(value: string): value is KitchenStatusType {
    return ['Open', 'Closed', 'Paused', 'Maintenance'].includes(value);
  }

  public canReceiveTickets(): boolean {
    return this.value === 'Open';
  }

  public canKeepExistingTickets(): boolean {
    return this.value === 'Open' || this.value === 'Paused';
  }

  public canTransitionTo(newStatus: KitchenStatusType): boolean {
    if (this.value === newStatus) return true;
    
    // Any status can technically transition to any other status manually by a manager,
    // but we can define some logic if needed. For now, unrestricted manual transitions.
    return true;
  }
}
