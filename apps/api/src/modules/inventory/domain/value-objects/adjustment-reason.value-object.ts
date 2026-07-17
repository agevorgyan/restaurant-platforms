export class AdjustmentReason {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Adjustment reason must not be empty');
    }
  }
}
