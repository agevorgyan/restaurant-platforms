export type DisplayLayoutType = 'Grid' | 'Columns' | 'Kanban' | 'Timeline';

export class DisplayLayout {
  constructor(public readonly value: DisplayLayoutType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid display layout: ${value}`);
    }
  }

  private isValid(value: string): value is DisplayLayoutType {
    return ['Grid', 'Columns', 'Kanban', 'Timeline'].includes(value);
  }
}
