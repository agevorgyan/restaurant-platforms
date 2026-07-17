export class MenuVersion {
  constructor(public readonly version: number = 1) {
    if (this.version < 1) {
      throw new Error('Version starts at 1');
    }
  }

  public increment(): MenuVersion {
    return new MenuVersion(this.version + 1);
  }
}
