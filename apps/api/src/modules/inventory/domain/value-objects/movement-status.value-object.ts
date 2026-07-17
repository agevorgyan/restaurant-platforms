export type MovementStatusType = 'Draft' | 'Posted' | 'Cancelled';

export class MovementStatus {
  constructor(public readonly value: MovementStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid movement status: ${value}`);
    }
  }

  private isValid(value: string): value is MovementStatusType {
    return ['Draft', 'Posted', 'Cancelled'].includes(value);
  }

  public isPosted(): boolean {
    return this.value === 'Posted';
  }

  public isCancelled(): boolean {
    return this.value === 'Cancelled';
  }

  public isDraft(): boolean {
    return this.value === 'Draft';
  }
}
