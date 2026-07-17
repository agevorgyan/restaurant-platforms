export type KitchenWorkflowStateType = 'Pending' | 'Queued' | 'Preparing' | 'Paused' | 'Ready' | 'Completed' | 'Cancelled';

export class KitchenWorkflowState {
  constructor(public readonly value: KitchenWorkflowStateType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid workflow state: ${value}`);
    }
  }

  private isValid(value: string): value is KitchenWorkflowStateType {
    return ['Pending', 'Queued', 'Preparing', 'Paused', 'Ready', 'Completed', 'Cancelled'].includes(value);
  }

  public isTerminal(): boolean {
    return this.value === 'Completed' || this.value === 'Cancelled';
  }

  public canTransitionTo(newState: KitchenWorkflowStateType): boolean {
    if (this.isTerminal()) return false;

    const transitions: Record<KitchenWorkflowStateType, KitchenWorkflowStateType[]> = {
      Pending: ['Queued', 'Cancelled'],
      Queued: ['Preparing', 'Cancelled'],
      Preparing: ['Paused', 'Ready', 'Cancelled'],
      Paused: ['Preparing', 'Cancelled'],
      Ready: ['Completed'],
      Completed: [],
      Cancelled: []
    };

    return transitions[this.value].includes(newState);
  }
}
