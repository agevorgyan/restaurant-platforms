export type ReturnStatusValue = 'Draft' | 'Authorized' | 'Posted' | 'Cancelled';

export class ReturnStatus {
  constructor(public readonly value: ReturnStatusValue) {
    const validStatuses = ['Draft', 'Authorized', 'Posted', 'Cancelled'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid return status: ${value}`);
    }
  }

  isDraft(): boolean { return this.value === 'Draft'; }
  isAuthorized(): boolean { return this.value === 'Authorized'; }
  isPosted(): boolean { return this.value === 'Posted'; }
  isCancelled(): boolean { return this.value === 'Cancelled'; }
}
