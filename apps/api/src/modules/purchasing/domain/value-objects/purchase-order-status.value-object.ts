export type PurchaseOrderStatusValue = 
  | 'Draft' 
  | 'Submitted' 
  | 'Approved' 
  | 'PartiallyReceived' 
  | 'Completed' 
  | 'Cancelled';

export class PurchaseOrderStatus {
  constructor(public readonly value: PurchaseOrderStatusValue) {
    const validStatuses = ['Draft', 'Submitted', 'Approved', 'PartiallyReceived', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid purchase order status: ${value}`);
    }
  }

  isDraft(): boolean { return this.value === 'Draft'; }
  isSubmitted(): boolean { return this.value === 'Submitted'; }
  isApproved(): boolean { return this.value === 'Approved'; }
  isPartiallyReceived(): boolean { return this.value === 'PartiallyReceived'; }
  isCompleted(): boolean { return this.value === 'Completed'; }
  isCancelled(): boolean { return this.value === 'Cancelled'; }
}
