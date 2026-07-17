export type ApprovalStatusType = 'Pending' | 'Approved' | 'Rejected' | 'NotRequired';

export class ApprovalStatus {
  constructor(public readonly value: ApprovalStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid approval status: ${value}`);
    }
  }

  private isValid(value: string): value is ApprovalStatusType {
    return ['Pending', 'Approved', 'Rejected', 'NotRequired'].includes(value);
  }

  public isApprovedOrNotRequired(): boolean {
    return this.value === 'Approved' || this.value === 'NotRequired';
  }

  public isRejected(): boolean {
    return this.value === 'Rejected';
  }
}
