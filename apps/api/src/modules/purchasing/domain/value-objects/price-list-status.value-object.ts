export type PriceListStatusValue = 'Draft' | 'Published' | 'Archived';

export class PriceListStatus {
  constructor(public readonly value: PriceListStatusValue) {
    const validStatuses = ['Draft', 'Published', 'Archived'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid price list status: ${value}`);
    }
  }

  isDraft(): boolean { return this.value === 'Draft'; }
  isPublished(): boolean { return this.value === 'Published'; }
  isArchived(): boolean { return this.value === 'Archived'; }
}
