export type KitchenTicketPriorityType = 'Low' | 'Normal' | 'High' | 'Rush';

export class KitchenTicketPriority {
  constructor(public readonly value: KitchenTicketPriorityType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid ticket priority: ${value}`);
    }
  }

  private isValid(value: string): value is KitchenTicketPriorityType {
    return ['Low', 'Normal', 'High', 'Rush'].includes(value);
  }
}
