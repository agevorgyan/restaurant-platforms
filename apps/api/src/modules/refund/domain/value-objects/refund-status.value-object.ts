export type RefundStatusEnum = 'Requested' | 'Approved' | 'Rejected' | 'Processing' | 'Completed' | 'Cancelled';

export class RefundStatus {
  constructor(public readonly value: RefundStatusEnum) {
    const valid = ['Requested', 'Approved', 'Rejected', 'Processing', 'Completed', 'Cancelled'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid Refund Status: ${value}`);
    }
  }

  public isTerminal(): boolean {
    return ['Completed', 'Rejected', 'Cancelled'].includes(this.value);
  }

  public canTransitionTo(newStatus: RefundStatusEnum): boolean {
    if (this.isTerminal()) {
      return false; // Immutable terminal states
    }

    if (this.value === 'Requested') {
      return ['Approved', 'Rejected', 'Cancelled'].includes(newStatus);
    }

    if (this.value === 'Approved') {
      return ['Processing', 'Cancelled'].includes(newStatus);
    }

    if (this.value === 'Processing') {
      return ['Completed', 'Cancelled'].includes(newStatus);
    }

    return false;
  }
}
