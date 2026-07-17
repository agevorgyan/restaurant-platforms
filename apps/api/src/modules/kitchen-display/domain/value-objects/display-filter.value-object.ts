export class DisplayFilter {
  constructor(
    public readonly categories?: string[],
    public readonly priorities?: string[]
  ) {
    if (categories && !Array.isArray(categories)) {
      throw new Error('Categories filter must be an array');
    }
    if (priorities && !Array.isArray(priorities)) {
      throw new Error('Priorities filter must be an array');
    }
  }
}
