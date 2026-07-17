export type AdjustmentStatusType = 'Draft' | 'Approved' | 'Posted' | 'Rejected' | 'Cancelled';

export class AdjustmentStatus {
  constructor(public readonly value: AdjustmentStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid adjustment status: ${value}`);
    }
  }

  private isValid(value: string): value is AdjustmentStatusType {
    return ['Draft', 'Approved', 'Posted', 'Rejected', 'Cancelled'].includes(value);
  }

  public isPosted(): boolean {
    return this.value === 'Posted';
  }

  public isRejected(): boolean {
    return this.value === 'Rejected';
  }

  public isCancelled(): boolean {
    return this.value === 'Cancelled';
  }

  public isApproved(): boolean {
    return this.value === 'Approved';
  }

  public isDraft(): boolean {
    return this.value === 'Draft';
  }
}
