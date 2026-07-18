export type SegmentStatusValue = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class SegmentStatus {
  constructor(public readonly value: SegmentStatusValue) {
    const validStatuses = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid segment status: ${value}`);
    }
  }

  isArchived(): boolean {
    return this.value === 'Archived';
  }

  isActive(): boolean {
    return this.value === 'Active';
  }
}
