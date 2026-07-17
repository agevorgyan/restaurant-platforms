export type CountStatusType = 'Draft' | 'InProgress' | 'Completed' | 'Approved' | 'Cancelled';

export class CountStatus {
  constructor(public readonly value: CountStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid count status: ${value}`);
    }
  }

  private isValid(value: string): value is CountStatusType {
    return ['Draft', 'InProgress', 'Completed', 'Approved', 'Cancelled'].includes(value);
  }

  public isDraft(): boolean {
    return this.value === 'Draft';
  }

  public isInProgress(): boolean {
    return this.value === 'InProgress';
  }

  public isCompleted(): boolean {
    return this.value === 'Completed';
  }

  public isApproved(): boolean {
    return this.value === 'Approved';
  }

  public isCancelled(): boolean {
    return this.value === 'Cancelled';
  }
}
