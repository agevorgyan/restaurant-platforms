export class RecipeVersion {
  constructor(public readonly major: number, public readonly minor: number) {
    if (typeof major !== 'number' || major < 1) {
      throw new Error('Major version must be greater than zero');
    }
    if (typeof minor !== 'number' || minor < 0) {
      throw new Error('Minor version must be zero or positive');
    }
  }

  public toString(): string {
    return `${this.major}.${this.minor}`;
  }

  public incrementMajor(): RecipeVersion {
    return new RecipeVersion(this.major + 1, 0);
  }

  public incrementMinor(): RecipeVersion {
    return new RecipeVersion(this.major, this.minor + 1);
  }
}
