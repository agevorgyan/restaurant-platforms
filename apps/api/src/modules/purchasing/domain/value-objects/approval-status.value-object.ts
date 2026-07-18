export type ApprovalStatusValue = 'Pending' | 'Approved' | 'Rejected' | 'NotRequired';

export class ApprovalStatus {
  constructor(public readonly value: ApprovalStatusValue) {
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'NotRequired'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid approval status: ${value}`);
    }
  }

  isPending(): boolean { return this.value === 'Pending'; }
  isApproved(): boolean { return this.value === 'Approved'; }
  isRejected(): boolean { return this.value === 'Rejected'; }
  isNotRequired(): boolean { return this.value === 'NotRequired'; }
}
