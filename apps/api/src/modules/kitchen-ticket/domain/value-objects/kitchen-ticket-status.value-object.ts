export type KitchenTicketStatusType = 'Pending' | 'Queued' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export class KitchenTicketStatus {
  constructor(public readonly value: KitchenTicketStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid ticket status: ${value}`);
    }
  }

  private isValid(value: string): value is KitchenTicketStatusType {
    return ['Pending', 'Queued', 'Preparing', 'Ready', 'Completed', 'Cancelled'].includes(value);
  }

  public isImmutable(): boolean {
    return this.isTerminal();
  }

  public isTerminal(): boolean {
    return this.value === 'Completed' || this.value === 'Cancelled';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canTransitionTo(_newStatus: KitchenTicketStatusType): boolean {
    if (this.isTerminal()) {
      return false;
    }
    return true;
  }
}
