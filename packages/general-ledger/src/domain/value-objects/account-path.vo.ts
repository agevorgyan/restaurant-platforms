export class AccountPath {
  private constructor(private readonly ancestors: string[]) {}

  public static create(ancestors: string[] = []): AccountPath {
    return new AccountPath(ancestors.map((a) => a.trim().toUpperCase()));
  }

  public static fromString(pathString: string): AccountPath {
    if (!pathString || pathString.trim().length === 0) {
      return new AccountPath([]);
    }
    const parts = pathString.split('.').map((p) => p.trim().toUpperCase()).filter(Boolean);
    return new AccountPath(parts);
  }

  public append(code: string): AccountPath {
    return new AccountPath([...this.ancestors, code.trim().toUpperCase()]);
  }

  public getDepth(): number {
    return this.ancestors.length;
  }

  public getAncestors(): string[] {
    return [...this.ancestors];
  }

  public getValue(): string {
    return this.ancestors.join('.');
  }

  public isAncestorOf(other: AccountPath): boolean {
    const otherAncestors = other.getAncestors();
    if (otherAncestors.length <= this.ancestors.length) {
      return false;
    }
    return this.ancestors.every((code, idx) => code === otherAncestors[idx]);
  }

  public equals(other: AccountPath): boolean {
    return this.getValue() === other.getValue();
  }
}
