export type MenuStatusType = 'Draft' | 'Published' | 'Archived';

export class MenuStatus {
  constructor(public readonly value: MenuStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Draft', 'Published', 'Archived'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Menu Status: ${status}`);
    }
  }

  public canTransitionTo(newStatus: MenuStatusType): boolean {
    if (this.value === newStatus) return false;
    
    // Business Rule: Archived menus cannot be published directly.
    if (this.value === 'Archived' && newStatus === 'Published') {
      return false;
    }
    
    return true;
  }
}
