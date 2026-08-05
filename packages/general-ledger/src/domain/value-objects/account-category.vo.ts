export class AccountCategory {
  private constructor(
    private readonly name: string,
    private readonly subCategory?: string
  ) {}

  public static create(name: string, subCategory?: string): AccountCategory {
    if (!name || name.trim().length === 0) {
      throw new Error('AccountCategory name cannot be empty');
    }
    return new AccountCategory(name.trim(), subCategory?.trim());
  }

  public getName(): string {
    return this.name;
  }

  public getSubCategory(): string | undefined {
    return this.subCategory;
  }

  public equals(other: AccountCategory): boolean {
    return (
      this.name.toLowerCase() === other.getName().toLowerCase() &&
      this.subCategory?.toLowerCase() === other.getSubCategory()?.toLowerCase()
    );
  }
}
