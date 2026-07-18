export type InvoiceStatusValue = 'Draft' | 'Posted' | 'Matched' | 'Cancelled';

export class InvoiceStatus {
  constructor(public readonly value: InvoiceStatusValue) {
    const validStatuses = ['Draft', 'Posted', 'Matched', 'Cancelled'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid invoice status: ${value}`);
    }
  }

  isDraft(): boolean { return this.value === 'Draft'; }
  isPosted(): boolean { return this.value === 'Posted'; }
  isMatched(): boolean { return this.value === 'Matched'; }
  isCancelled(): boolean { return this.value === 'Cancelled'; }
}
