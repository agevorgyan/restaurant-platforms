export type ReceivingResultValue = 'Accepted' | 'PartiallyAccepted' | 'Rejected';

export class ReceivingResult {
  constructor(public readonly value: ReceivingResultValue) {
    const validResults = ['Accepted', 'PartiallyAccepted', 'Rejected'];
    if (!validResults.includes(value)) {
      throw new Error(`Invalid receiving result: ${value}`);
    }
  }

  isAccepted(): boolean { return this.value === 'Accepted'; }
  isPartiallyAccepted(): boolean { return this.value === 'PartiallyAccepted'; }
  isRejected(): boolean { return this.value === 'Rejected'; }
}
