export type GoodsReceiptStatusValue = 'Draft' | 'Posted' | 'Cancelled';

export class GoodsReceiptStatus {
  constructor(public readonly value: GoodsReceiptStatusValue) {
    const validStatuses = ['Draft', 'Posted', 'Cancelled'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid goods receipt status: ${value}`);
    }
  }

  isDraft(): boolean { return this.value === 'Draft'; }
  isPosted(): boolean { return this.value === 'Posted'; }
  isCancelled(): boolean { return this.value === 'Cancelled'; }
}
