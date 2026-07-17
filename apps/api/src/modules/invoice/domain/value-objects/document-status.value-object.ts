export type DocumentStatusEnum = 'Draft' | 'Issued' | 'Cancelled' | 'Voided';

export class DocumentStatus {
  constructor(public readonly value: DocumentStatusEnum) {
    const valid = ['Draft', 'Issued', 'Cancelled', 'Voided'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid Document Status: ${value}`);
    }
  }

  public isTerminal(): boolean {
    return this.value === 'Cancelled' || this.value === 'Voided';
  }

  public canTransitionTo(newStatus: DocumentStatusEnum): boolean {
    if (this.isTerminal()) {
      return false; // Immutable
    }
    
    if (this.value === 'Draft') {
      return ['Issued', 'Cancelled', 'Voided'].includes(newStatus);
    }
    
    if (this.value === 'Issued') {
      return ['Cancelled', 'Voided'].includes(newStatus);
    }
    
    return false;
  }
}
